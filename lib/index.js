// src/index.ts
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
var name = "dsh-local-models";
var inject = ["llm", "timer"];
function apply(ctx) {
  function getSp() {
    return ctx.get("subprocess");
  }
  function getFs() {
    return ctx.get("fs");
  }
  var CONFIG_PATH = join(process.env.DSH_HOME || join(homedir(), ".dsh"), "local-models.json");
  function baseName(p) {
    return String(p).split(/[\\/]/).pop().replace(/\.(gguf|safetensors|bin)$/i, "");
  }
  var IDLE_MS = 5 * 60 * 1e3;
  var ROUTE = "local-turbo";
  var MIN_SIZE = 1258291200;
  var SKIP_DIR = /^(node_modules|\.git|\.hg|\.svn|\$recycle\.bin|system volume information|lost\+found)$/i;
  var VIS_RE = /mmproj|projector|vision|visual|clip|ocr|image|vit[-_. 0-9]|[-_. ]vl[-_. 0-9]|internvl|minicpm-v/i;
  var lastError = null;
  function clampGB(v) {
    var n = Number(v);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(64, n);
  }
  function normalize(data) {
    var d = data && typeof data === "object" ? data : {};
    var models = Array.isArray(d.models) ? d.models : [];
    return {
      dir: typeof d.dir === "string" ? d.dir : "",
      primary: typeof d.primary === "string" ? d.primary : "",
      backend: typeof d.backend === "string" && d.backend ? d.backend : "G:\\modes\\turboquant-plus-tqp-v0.3.0-windows-x64-cuda12.4",
      port: Number(d.port) > 0 ? Math.floor(Number(d.port)) : 8080,
      reserveVRAMGB: clampGB(d.reserveVRAMGB),
      reserveRAMGB: clampGB(d.reserveRAMGB),
      models: models.map(function(m) {
        return {
          path: String(m.path || ""),
          shortName: String(m.shortName || "").trim() || String(m.path || "").split(/[\\/]/).pop().replace(/\.(gguf|safetensors|bin)$/i, ""),
          size: Number(m.size) >= 0 ? Number(m.size) : -1,
          contextSize: [0, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144].indexOf(Number(m.contextSize)) >= 0 ? Number(m.contextSize) : 0,
          spec: {
            mode: m.spec && m.spec.mode === "mtp" ? "mtp" : m.spec && m.spec.mode === "draft" ? "draft" : "none",
            count: Math.min(8, Math.max(1, Number(m.spec && m.spec.count) || 2)),
            draftPath: String(m.spec && m.spec.draftPath || "")
          }
        };
      }).filter(function(m) {
        return m.path;
      })
    };
  }
  function readData() {
    try {
      return normalize(JSON.parse(readFileSync(CONFIG_PATH, "utf8")));
    } catch (_e) {
      return normalize({});
    }
  }
  var hwCache = { at: 0, gpu: null, ram: null };
  async function detectRam(cwd) {
    var sp = getSp();
    if (hwCache.ram && Date.now() - hwCache.at < 6e4) return hwCache.ram;
    var out = { totalMB: 0, freeMB: 0 };
    try {
      var h = sp.spawn({ argv: ["powershell", "-NoProfile", "-Command", '$o=Get-CimInstance Win32_OperatingSystem; "$($o.TotalVisibleMemorySize),$($o.FreePhysicalMemory)"'], cwd: cwd || "C:\\", stdio: { stdin: "ignore", stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } }, graceMs: 8e3 });
      await h.done.catch(function() {
      });
      var text = h.collected && h.collected.stdout ? h.collected.stdout.readFrom(0).text : "";
      var parts = (text.trim().split(/\r?\n/)[0] || "").split(",");
      out = { totalMB: Math.round((parseInt(parts[0], 10) || 0) / 1024), freeMB: Math.round((parseInt(parts[1], 10) || 0) / 1024) };
    } catch (_e) {
    }
    hwCache.ram = out;
    return out;
  }
  async function detectGpu(cwd) {
    var sp = getSp();
    if (hwCache.gpu && Date.now() - hwCache.at < 6e4) return hwCache.gpu;
    var out = { totalVRAM: 0, freeVRAM: 0, hasNvidia: false };
    try {
      var h = sp.spawn({ argv: ["nvidia-smi", "--query-gpu=memory.total,memory.free", "--format=csv,noheader,nounits"], cwd: cwd || "C:\\", stdio: { stdin: "ignore", stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } }, graceMs: 5e3 });
      await h.done.catch(function() {
      });
      var text = h.collected && h.collected.stdout ? h.collected.stdout.readFrom(0).text : "";
      var parts = (text.trim().split(/\r?\n/)[0] || "").split(",").map(function(s) {
        return s.trim();
      });
      var total = parseInt(parts[0], 10) || 0;
      out = { totalVRAM: total, freeVRAM: parseInt(parts[1], 10) || 0, hasNvidia: total > 0 };
    } catch (_e) {
    }
    hwCache.gpu = out;
    hwCache.at = Date.now();
    return out;
  }
  function inferModelInfo(filename, fileSize) {
    var lower = String(filename).toLowerCase();
    var layers = 32, kvHeads = 8, headDim = 128, contextLength = 8192, activeB = 0;
    if (/70b/.test(lower)) {
      layers = 80;
      kvHeads = 8;
    } else if (/35b|32b/.test(lower)) {
      layers = 64;
      kvHeads = 4;
    } else if (/13b/.test(lower)) {
      layers = 40;
      kvHeads = 4;
    } else if (/9b|8b/.test(lower)) {
      layers = 32;
      kvHeads = 8;
    } else if (/7b/.test(lower)) {
      layers = 32;
      kvHeads = 8;
    } else if (/3b|4b/.test(lower)) {
      layers = 26;
      kvHeads = 4;
    } else if (/1b/.test(lower)) {
      layers = 16;
      kvHeads = 4;
      headDim = 64;
    }
    var m = lower.match(/(\d+)k(?![a-z])/);
    if (m) contextLength = parseInt(m[1], 10) * 1024;
    var am = lower.match(/(\d+)b[-_ ]?a[-_ ]?(\d+)b/);
    var moe = Boolean(am);
    if (am) activeB = parseInt(am[2], 10);
    return { sizeBytes: fileSize, layers, kvHeads, headDim, contextLength, isMoE: moe, activeB };
  }
  function optimalContext(freeVRAM, sizeBytes, info) {
    var availKV = (freeVRAM - sizeBytes / 1048576) * 0.85;
    if (availKV <= 0) return 2048;
    var perTok = 2 * info.layers * info.kvHeads * info.headDim * 2 * 0.4 / 1048576;
    var maxTok = Math.floor(availKV / perTok);
    return Math.min(Math.max(Math.floor(maxTok / 2048) * 2048, 2048), info.contextLength, 131072);
  }
  function kvBitsOf(t) {
    if (t === "f16") return 16;
    if (t === "q8_0") return 8;
    if (t === "turbo4") return 4.25;
    if (t === "turbo3") return 3.5;
    if (t === "turbo2") return 2.5;
    return 4;
  }
  function optimizeParams(modelPath, sizeBytes, sys, port, ctxOverride, reserveVRAMMB, draftPath) {
    var info = inferModelInfo(modelPath, sizeBytes || 0);
    var freeVRAM = Math.max(0, (sys.hasNvidia ? sys.freeVRAM : 8e3) - (reserveVRAMMB || 0));
    if (draftPath) freeVRAM = Math.max(0, freeVRAM - 2048);
    var ck = "turbo4", cv = "turbo3";
    var sizeMB = Math.ceil((sizeBytes || 0) / 1048576);
    var moeOffloadPct = 0;
    var contextSize, vramMB;
    if (info.isMoE && sizeMB > 0) {
      var kvPerTokMB = 2 * info.layers * info.kvHeads * info.headDim * (kvBitsOf(ck) + kvBitsOf(cv)) / 8 / 1048576;
      var denseMB = Math.round(sizeMB * 0.15);
      var activeMB = info.activeB > 0 ? Math.round(info.activeB * 550) : Math.round(sizeMB * 0.12);
      var overhead = 512;
      var targetCtx = ctxOverride > 0 ? ctxOverride : 65536;
      var need = denseMB + activeMB + kvPerTokMB * targetCtx + overhead;
      if (need > freeVRAM) {
        var availKV = Math.max(0, freeVRAM - denseMB - activeMB - overhead);
        targetCtx = Math.max(2048, Math.floor(availKV / kvPerTokMB / 2048) * 2048);
      }
      contextSize = Math.min(targetCtx, 131072);
      var kvMB = kvPerTokMB * contextSize;
      var resident = denseMB + activeMB + kvMB + overhead;
      var expertMB = sizeMB - denseMB;
      var leftover = Math.max(0, freeVRAM - resident);
      var residentExpert = Math.min(expertMB, activeMB + leftover);
      var off = expertMB > 0 ? Math.ceil((expertMB - residentExpert) / expertMB * 100) : 0;
      moeOffloadPct = off >= 5 ? Math.min(90, off) : 0;
      vramMB = Math.ceil(denseMB + (expertMB - (moeOffloadPct > 0 ? Math.floor(expertMB * moeOffloadPct / 100) : 0)) + kvMB);
    } else {
      contextSize = ctxOverride > 0 ? ctxOverride : optimalContext(freeVRAM, sizeBytes || 0, info);
      vramMB = Math.ceil((sizeMB + 2 * info.layers * info.kvHeads * info.headDim * contextSize * 2 * 0.4) / 1048576);
    }
    var b = 2048, ub = 512;
    if (freeVRAM > 0 && vramMB / freeVRAM > 0.9) {
      b = 1024;
      ub = 256;
    }
    var args = ["-m", modelPath, "-ngl", "999", "-c", String(contextSize), "-b", String(b), "-ub", String(ub), "-ctk", ck, "-ctv", cv, "-fa", "on", "--context-shift", "--host", "127.0.0.1", "--port", String(port), "--no-webui"];
    if (moeOffloadPct > 0) args.push("--n-cpu-moe", String(moeOffloadPct));
    else if (!info.isMoE && freeVRAM > 12e3) args.push("--mlock");
    return { args, contextSize, batchSize: b, ubatchSize: ub, cacheTypeK: ck, cacheTypeV: cv, vramMB, vramUsage: freeVRAM > 0 ? Math.min(100, Math.round(vramMB / freeVRAM * 100)) : 0, isMoE: info.isMoE, moeOffloadPct };
  }
  var current = null;
  var lastExit = null;
  function touch() {
    if (current) current.lastUsed = Date.now();
  }
  function idleMs() {
    return current ? Date.now() - (current.lastUsed || Date.now()) : 0;
  }
  function gc() {
    if (current && idleMs() >= IDLE_MS) {
      lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, idle: true };
      current.meta.retired = true;
      current.handle.terminate();
      current = null;
    }
  }
  ctx.interval(function() {
    try {
      gc();
    } catch (err) {
      console.error("idle gc failed", err);
    }
  }, 3e4);
  function sleep(ms) {
    return new Promise(function(r) {
      setTimeout(r, ms);
    });
  }
  async function serverReady(port, timeoutMs) {
    var deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      var s = getSp();
      try {
        var h = s.spawn({ argv: ["curl", "-sS", "-o", "NUL", "-w", "%{http_code}", "--max-time", "2", "http://127.0.0.1:" + port + "/health"], cwd: "C:\\", stdio: { stdin: "ignore", stdout: { maxBytes: 64 }, stderr: "ignore" }, graceMs: 3e3 });
        await h.done.catch(function() {
        });
        var text = h.collected && h.collected.stdout ? h.collected.stdout.readFrom(0).text : "";
        if (text.trim() === "200") return true;
      } catch (_e) {
      }
      await sleep(1200);
    }
    return false;
  }
  async function ensure(modelPath, data, force) {
    var sp = getSp();
    var fsvc = getFs();
    gc();
    if (!sp || typeof sp.spawn !== "function") throw new Error("\u5BBF\u4E3B subprocess \u670D\u52A1\u4E0D\u53EF\u7528");
    if (!fsvc) throw new Error("\u5BBF\u4E3B fs \u670D\u52A1\u4E0D\u53EF\u7528");
    var backend = data.backend;
    var card = data.models.find(function(m) {
      return m.path === modelPath;
    });
    if (!card) throw new Error("\u672A\u77E5\u672C\u5730\u6A21\u578B\uFF1A" + modelPath);
    var userCtx = card.contextSize || 0;
    if (current && current.meta.model === modelPath && !force && current.meta.userCtx === userCtx) {
      touch();
      return current.lastResult;
    }
    try {
      var exeT = await fsvc.resolve(backend + "\\llama-server.exe");
      var ei = await fsvc.stat(exeT);
      if (!ei || ei.type !== "file") throw new Error("x");
    } catch (_e) {
      throw new Error("\u540E\u7AEF\u76EE\u5F55\u4E0B\u6CA1\u6709 llama-server.exe\uFF1A" + backend);
    }
    var reserveVRAMMB = Math.round(clampGB(data.reserveVRAMGB) * 1024);
    var reserveRAMMB = Math.round(clampGB(data.reserveRAMGB) * 1024);
    var sys = await detectGpu(backend);
    var opt = optimizeParams(card.path, card.size > 0 ? card.size : 0, sys, data.port, card.contextSize || 0, reserveVRAMMB, card.spec.mode === "draft" ? card.spec.draftPath : "");
    if (card.spec.mode === "mtp" || card.spec.mode === "draft") {
      opt.args.push("--spec-type", "draft-mtp", "--spec-draft-n-max", String(card.spec.count));
      if (card.spec.mode === "draft" && card.spec.draftPath) opt.args.push("--spec-draft-model", card.spec.draftPath);
    }
    var sizeMB = card.size > 0 ? Math.ceil(card.size / 1048576) : 0;
    var effFreeVRAM = Math.max(0, (sys.hasNvidia ? sys.freeVRAM : 0) - reserveVRAMMB);
    var ramNeedMB = sizeMB > 0 ? Math.max(opt.isMoE && opt.moeOffloadPct > 0 ? Math.ceil(sizeMB * opt.moeOffloadPct / 100) : opt.vramMB > effFreeVRAM ? opt.vramMB - effFreeVRAM : 256, 256) : 0;
    var ram = await detectRam(backend);
    sys.ramFreeMB = ram.freeMB;
    sys.ramTotalMB = ram.totalMB;
    if (ramNeedMB > 0 && sys.ramFreeMB > 0 && ramNeedMB + reserveRAMMB > sys.ramFreeMB) {
      throw new Error("\u7CFB\u7EDF\u5185\u5B58\u4E0D\u8DB3\uFF1A\u9884\u8BA1\u9700 " + ramNeedMB + "MB + \u9884\u7559 " + reserveRAMMB + "MB\uFF0C\u5F53\u524D\u7A7A\u95F2\u4EC5 " + sys.ramFreeMB + "MB");
    }
    if (current) {
      lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, swapped: true };
      current.meta.retired = true;
      current.handle.terminate();
      current = null;
      await sleep(1500);
    }
    var handle = sp.spawn({ argv: [backend + "\\llama-server.exe"].concat(opt.args), cwd: backend, stdio: { stdin: "ignore", stdout: "inherit", stderr: "inherit" }, graceMs: 3e3 });
    var entry = { handle, lastUsed: Date.now(), lastResult: null, meta: { pid: handle.pid, port: data.port, model: modelPath, name: card.shortName, userCtx } };
    handle.done.then(function(oc) {
      if (!entry.meta.retired) lastExit = { exitCode: oc.exitCode === null ? -1 : oc.exitCode, model: modelPath, name: card.shortName };
      if (current === entry) current = null;
    }).catch(function() {
      if (current === entry) current = null;
    });
    current = entry;
    var result = { pid: handle.pid, port: data.port, contextSize: opt.contextSize, batchSize: opt.batchSize, ubatchSize: opt.ubatchSize, cacheTypeK: opt.cacheTypeK, cacheTypeV: opt.cacheTypeV, vramMB: opt.vramMB, vramUsage: opt.vramUsage, ramNeedMB, effFreeVRAM, moeOffloadPct: opt.moeOffloadPct };
    entry.lastResult = result;
    var ready = await serverReady(data.port, 24e4);
    if (!ready) {
      lastError = "\u672C\u5730\u6A21\u578B\u670D\u52A1\u542F\u52A8\u8D85\u65F6\uFF08\u7AEF\u53E3 " + data.port + "\uFF09";
      try {
        handle.terminate();
      } catch (_e) {
      }
      current = null;
      throw new Error(lastError);
    }
    return result;
  }
  function toOpenAiMessages(options) {
    var msgs = [];
    msgs.push({ role: "system", content: "\u4F60\u662F\u4E00\u4E2A\u4E50\u4E8E\u52A9\u4EBA\u7684\u4E2D\u6587AI\u52A9\u624B\u3002\u8BF7\u7B80\u6D01\u3001\u81EA\u7136\u3001\u76F4\u63A5\u5730\u56DE\u7B54\u7528\u6237\u95EE\u9898\uFF0C\u4E0D\u8981\u8F93\u51FA\u4EFB\u4F55\u5DE5\u5177\u8C03\u7528\u3001XML\u6807\u7B7E\u6216Markdown\u4EE3\u7801\u5757\u3002" });
    var list = Array.isArray(options.messages) ? options.messages : [];
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      var content = m.content;
      var text = "";
      if (typeof content === "string") text = content;
      else if (Array.isArray(content)) {
        for (var j = 0; j < content.length; j++) {
          var b = content[j];
          if (b && b.type === "text" && b.text) text += (text ? "\n" : "") + b.text;
        }
      }
      msgs.push({ role: m.role === "assistant" ? "assistant" : "user", content: text });
    }
    return msgs;
  }
  var WAKE_HINTS = [
    "\u55B5\uFF5E \u6B63\u5728\u5524\u9192\u300C{m}\u300D\uFF0C\u9A6C\u4E0A\u5C31\u6765~",
    "\u545C\uFF5E \u6B63\u5728\u628A\u300C{m}\u300D\u53EB\u9192\uFF0C\u7B49\u4E00\u4E0B\u4E0B~",
    "\u54C8\u55BD\uFF5E \u300C{m}\u300D\u6B63\u5728\u540E\u53F0\u52A0\u8F7D\uFF0C\u7A0D\u7B49\u7247\u523B~"
  ];
  var REWAKE_HINTS = [
    "\u521A\u624D\u7A7A\u95F2\u88AB\u81EA\u52A8\u5378\u8F7D\u5566\uFF0C\u6B63\u5728\u91CD\u65B0\u5524\u9192\u300C{m}\u300D\u2026",
    "\u6A21\u578B\u95F2\u7F6E\u88AB\u5378\u8F7D\u4E86\uFF0C\u6211\u8FD9\u5C31\u628A\u5B83\u53EB\u56DE\u6765~",
    "\u521A\u81EA\u52A8\u5378\u8F7D\u8FC7\uFF0C\u6B63\u5728\u91CD\u65B0\u62C9\u8D77\u300C{m}\u300D\uFF0C\u9A6C\u4E0A\u597D~"
  ];
  var SWITCH_HINTS = [
    "\u6B63\u5728\u70ED\u5207\u6362\uFF1A\u4ECE\u300C{o}\u300D\u6362\u5230\u300C{m}\u300D~",
    "\u6362\u6A21\u578B\u5566\uFF5E \u6B63\u5728\u62C9\u8D77\u300C{m}\u300D\uFF0C\u7A0D\u7B49~",
    "\u5207\u6362\u4E2D\u2026 \u9A6C\u4E0A\u5207\u5230\u300C{m}\u300D\uFF0C\u8BF7\u7A0D\u7B49\u4E00\u4E0B\u4E0B~"
  ];
  var READY_HINTS = [
    "\u597D\u4E86\uFF01\u6211\u9A6C\u4E0A\u63A5\u7740\u56DE\u7B54\u4F60~",
    "\u5C31\u7EEA\u5566\uFF0C\u7EE7\u7EED\u56DE\u7B54\u54AF~",
    "\u6765\u5566\u6765\u5566\uFF5E \u9A6C\u4E0A\u63A5\u7740\u56DE\u7B54~"
  ];
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  var adapter = {
    providerInfo: function() {
      return { id: ROUTE, name: "\u672C\u5730\u6A21\u578B" };
    },
    providerRetryPolicy: function() {
      return void 0;
    },
    listModels: async function() {
      var data = await readData();
      return data.models.map(function(m) {
        return { provider: ROUTE, id: m.path, name: m.shortName, description: m.size > 0 ? (m.size / 1073741824).toFixed(1) + " GB" : void 0 };
      });
    },
    resolveModel: async function(_provider, model) {
      var data = await readData();
      var card = data.models.find(function(m) {
        return m.path === model;
      });
      var info = inferModelInfo(model, card && card.size > 0 ? card.size : 0);
      var freeVRAM = 8e3;
      try {
        var g = await detectGpu(data.backend);
        if (g.hasNvidia) freeVRAM = Math.max(0, g.freeVRAM - Math.round(clampGB(data.reserveVRAMGB) * 1024));
      } catch (_e) {
      }
      var ctxSize = card && card.contextSize > 0 ? card.contextSize : optimalContext(freeVRAM, card && card.size > 0 ? card.size : 0, info);
      return {
        provider: ROUTE,
        id: model,
        name: card ? card.shortName : baseName(model),
        context: { contextWindow: ctxSize },
        reasoning: {
          efforts: [
            { id: "none", name: "\u4E0D\u601D\u8003" },
            { id: "brief", name: "\u7B80\u77ED\u601D\u8003" },
            { id: "standard", name: "\u6807\u51C6\u601D\u8003" },
            { id: "deep", name: "\u6DF1\u5165\u601D\u8003" },
            { id: "max", name: "\u6781\u81F4\u601D\u8003" },
            { id: "auto", name: "\u81EA\u52A8" }
          ],
          defaultEffort: "standard"
        }
      };
    },
    prepareCall: async function(provider, model, signal) {
      var self = this;
      return { model: await self.resolveModel(provider, model, signal), stream: function(options) {
        return self.stream(options);
      } };
    },
    stream: async function* (options) {
      var sp = getSp();
      var data, card, handle;
      var hintIndex = 0, realIndex = 1;
      var hinted = false;
      var realStarted = false;
      var assembledReal = "";
      var assembledHint = "";
      var started = false;
      var queue = [];
      var wake = null;
      var sseBuf = Buffer.alloc(0);
      try {
        let push2 = function(v) {
          queue.push(v);
          if (wake) {
            var w = wake;
            wake = null;
            w();
          }
        }, feedLine2 = function(line) {
          if (line.indexOf("data:") !== 0) return;
          var payload = line.slice(5).trim();
          if (payload === "[DONE]") {
            push2({ done: true });
            return;
          }
          var obj;
          try {
            obj = JSON.parse(payload);
          } catch (_e) {
            return;
          }
          if (obj && obj.error) {
            push2({ err: new Error(String(obj.error.message || "\u672C\u5730\u6A21\u578B\u8FD4\u56DE\u9519\u8BEF")) });
            return;
          }
          var delta = obj && obj.choices && obj.choices[0] && obj.choices[0].delta;
          var piece = delta && delta.content;
          if (piece) {
            if (hinted && !realStarted) {
              push2({ chunk: { type: "block-end", index: hintIndex, block: { type: "text", text: assembledHint } } });
              push2({ chunk: { type: "block-start", index: realIndex, blockType: "text" } });
              realStarted = true;
            }
            assembledReal += piece;
            push2({ chunk: { type: "text-delta", index: realStarted ? realIndex : hintIndex, text: piece } });
          }
        };
        var push = push2, feedLine = feedLine2;
        data = await readData();
        card = data.models.find(function(m) {
          return m.path === options.model;
        });
        var modelLabel = card ? card.shortName : baseName(options.model);
        if (current === null) {
          hinted = true;
          var first = pick(lastExit && lastExit.idle ? REWAKE_HINTS : WAKE_HINTS).replace(/\{m\}/g, modelLabel);
          assembledHint = first;
          yield { type: "block-start", index: hintIndex, blockType: "text" };
          yield { type: "text-delta", index: hintIndex, text: first };
        } else if (current.meta.model !== options.model) {
          hinted = true;
          var first2 = pick(SWITCH_HINTS).replace(/\{m\}/g, modelLabel).replace(/\{o\}/g, current.meta.name || "\u65E7\u6A21\u578B");
          assembledHint = first2;
          yield { type: "block-start", index: hintIndex, blockType: "text" };
          yield { type: "text-delta", index: hintIndex, text: first2 };
        }
        await ensure(options.model, data, false);
        if (hinted) {
          var msg = "\n\n" + pick(READY_HINTS);
          assembledHint += msg;
          yield { type: "text-delta", index: hintIndex, text: msg };
        }
        touch();
        var body = JSON.stringify({ model: card ? card.shortName : baseName(options.model), stream: true, messages: toOpenAiMessages(options) });
        if (!sp || typeof sp.spawn !== "function") throw new Error("\u5BBF\u4E3B subprocess \u670D\u52A1\u4E0D\u53EF\u7528");
        handle = sp.spawn({
          argv: ["curl", "-sS", "-N", "--retry", "180", "--retry-delay", "1", "--retry-connrefused", "-X", "POST", "http://127.0.0.1:" + data.port + "/v1/chat/completions", "-H", "Content-Type: application/json", "--data", "@-"],
          cwd: data.backend,
          stdio: { stdin: { data: body }, stdout: "pipe", stderr: "ignore" },
          graceMs: 2e3
        });
        handle.stdout.on("data", function(chunk) {
          sseBuf = Buffer.concat([sseBuf, chunk]);
          var nl;
          while ((nl = sseBuf.indexOf(10)) >= 0) {
            var line = sseBuf.subarray(0, nl).toString("utf8").replace(/\r$/, "");
            sseBuf = sseBuf.subarray(nl + 1);
            feedLine2(line);
          }
        });
        handle.stdout.on("end", function() {
          var rest = sseBuf.toString("utf8").replace(/[\r\n]+$/, "");
          if (rest.trim()) feedLine2(rest);
          sseBuf = Buffer.alloc(0);
          push2(started || hinted ? { done: true } : { err: new Error("\u672C\u5730\u6A21\u578B\u670D\u52A1\u65E0\u54CD\u5E94\uFF08\u7AEF\u53E3 " + data.port + "\uFF09\uFF1A\u540E\u7AEF\u53EF\u80FD\u5728\u52A0\u8F7D\u4E2D\u6216\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u770B\u72B6\u6001\u80F6\u56CA/\u8BBE\u7F6E\u9875") });
        });
        handle.stdout.on("error", function(e) {
          push2({ err: e instanceof Error ? e : new Error(String(e)) });
        });
        handle.done.then(function() {
          push2(started || hinted ? { done: true } : { err: new Error("\u672C\u5730\u6A21\u578B\u670D\u52A1\u8FDE\u63A5\u4E2D\u65AD") });
        }).catch(function() {
        });
        while (true) {
          if (queue.length === 0) {
            await new Promise(function(r) {
              wake = r;
            });
            continue;
          }
          var item = queue.shift();
          if (item.err) throw item.err;
          if (item.done) break;
          if (item.chunk && item.chunk.type === "text-delta") started = true;
          touch();
          yield item.chunk;
        }
        if (hinted) yield { type: "block-end", index: hintIndex, block: { type: "text", text: assembledHint } };
        if (realStarted) yield { type: "block-end", index: realIndex, block: { type: "text", text: assembledReal } };
        yield { type: "finish", reason: { kind: "stop" } };
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        throw e;
      } finally {
        if (handle) {
          try {
            handle.terminate();
          } catch (_e2) {
          }
        }
      }
    }
  };
  function writeConfig(data) {
    writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), "utf8");
  }
  function runEnsure(args, force) {
    return async function() {
      try {
        var data = readData();
        var target = String(args && args.model || data.primary || data.models[0] && data.models[0].path || "");
        if (!target) return { ok: false, error: "\u6CA1\u6709\u53EF\u542F\u52A8\u7684\u6A21\u578B" };
        var r = await ensure(target, data, force);
        return Object.assign({ ok: true }, r);
      } catch (err) {
        lastError = String(err && err.message || err);
        return { ok: false, error: lastError };
      }
    }();
  }
  var localModels = {
    state: async function() {
      return { ok: true, data: readData() };
    },
    saveAll: async function(args) {
      try {
        writeConfig(normalize(args && args.data));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: String(e && e.message || e) };
      }
    },
    scan: async function(args) {
      var fsvc = getFs();
      if (!fsvc || typeof fsvc.listDir !== "function") return { ok: false, error: "\u5BBF\u4E3B fs \u670D\u52A1\u4E0D\u53EF\u7528" };
      var dirPath = String(args && args.dir || "").trim();
      if (!dirPath) return { ok: false, error: "\u672A\u586B\u5199\u76EE\u5F55\u8DEF\u5F84" };
      var out = [];
      var dirsWalked = 0;
      async function walk(target, depth) {
        if (depth > 3 || out.length >= 200 || dirsWalked > 400) return;
        dirsWalked++;
        var entries;
        try {
          entries = await fsvc.listDir(target);
        } catch (_err) {
          return;
        }
        for (var i = 0; i < entries.length; i++) {
          if (out.length >= 200) return;
          var e = entries[i];
          if (!e) continue;
          var name2 = String(e.name);
          if (e.type === "directory") {
            if (SKIP_DIR.test(name2)) continue;
            await walk(e.target, depth + 1);
            continue;
          }
          if (e.type !== "file" && e.type !== "symlink") continue;
          if (!/\.(gguf|safetensors|bin)$/i.test(name2)) continue;
          var size = typeof e.size === "number" ? e.size : void 0;
          if (size === void 0) {
            try {
              var si = await fsvc.stat(e.target);
              size = si && si.type === "file" ? si.size : void 0;
            } catch (_e2) {
            }
          }
          if (typeof size !== "number" || size <= MIN_SIZE) continue;
          out.push({ path: String(e.target.displayPath), name: name2, size });
        }
      }
      try {
        var t = await fsvc.resolve(dirPath);
        var info = await fsvc.stat(t);
        if (!info) return { ok: false, error: "\u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A" + dirPath };
        if (info.type !== "directory") return { ok: false, error: "\u8BE5\u8DEF\u5F84\u4E0D\u662F\u76EE\u5F55\uFF1A" + dirPath };
        await walk(t, 0);
        out.sort(function(a, b) {
          return b.size - a.size;
        });
        return { ok: true, scanned: dirsWalked, models: out };
      } catch (err) {
        return { ok: false, error: "\u626B\u63CF\u5931\u8D25\uFF1A" + String(err && err.code ? "[" + err.code + "] " : "") + String(err && err.message || err) };
      }
    },
    drafts: async function(args) {
      var fsvc = getFs();
      if (!fsvc || typeof fsvc.listDir !== "function") return { ok: false, error: "\u5BBF\u4E3B fs \u670D\u52A1\u4E0D\u53EF\u7528" };
      var modelPath = String(args && args.model || "");
      var cutAt = Math.max(modelPath.lastIndexOf("\\"), modelPath.lastIndexOf("/"));
      if (cutAt <= 0) return { ok: false, error: "\u65E0\u6CD5\u786E\u5B9A\u6A21\u578B\u6240\u5728\u6587\u4EF6\u5939" };
      var dirPath = modelPath.slice(0, cutAt);
      var exclude = {};
      exclude[modelPath] = true;
      (Array.isArray(args && args.exclude) ? args.exclude : []).forEach(function(p) {
        exclude[String(p)] = true;
      });
      var out = [];
      var skipped = 0;
      async function walk(target, depth) {
        if (depth > 1 || out.length >= 60) return;
        var entries;
        try {
          entries = await fsvc.listDir(target);
        } catch (_err) {
          return;
        }
        for (var i = 0; i < entries.length; i++) {
          if (out.length >= 60) return;
          var e = entries[i];
          if (!e) continue;
          var name2 = String(e.name);
          if (e.type === "directory" && depth === 0 && !SKIP_DIR.test(name2)) {
            await walk(e.target, depth + 1);
            continue;
          }
          if (e.type !== "file" && e.type !== "symlink") continue;
          if (!/\.(gguf|safetensors|bin)$/i.test(name2)) continue;
          var p = String(e.target.displayPath);
          if (exclude[p]) continue;
          if (VIS_RE.test(name2.toLowerCase())) {
            skipped++;
            continue;
          }
          var size = typeof e.size === "number" ? e.size : void 0;
          if (size === void 0) {
            try {
              var si = await fsvc.stat(e.target);
              size = si && si.type === "file" ? si.size : void 0;
            } catch (_e2) {
            }
          }
          if (typeof size !== "number" || size < 8388608) continue;
          out.push({ path: p, name: name2, size });
        }
      }
      try {
        var t = await fsvc.resolve(dirPath);
        var info = await fsvc.stat(t);
        if (!info || info.type !== "directory") return { ok: false, error: "\u6A21\u578B\u6587\u4EF6\u5939\u4E0D\u5B58\u5728\uFF1A" + dirPath };
        await walk(t, 0);
        out.sort(function(a, b) {
          return a.size - b.size;
        });
        return { ok: true, dir: dirPath, models: out, skipped };
      } catch (err) {
        return { ok: false, error: "\u8BFB\u53D6\u6587\u4EF6\u5939\u5931\u8D25\uFF1A" + String(err && err.message || err) };
      }
    },
    status: async function() {
      gc();
      var out = { phase: current ? "running" : "idle", running: Boolean(current) };
      if (current) {
        out.pid = current.meta.pid;
        out.port = current.meta.port;
        out.model = current.meta.model;
        out.modelName = current.meta.name;
        out.idleSec = Math.floor(idleMs() / 1e3);
        if (current.lastResult) {
          out.contextSize = current.lastResult.contextSize;
          out.cacheTypeK = current.lastResult.cacheTypeK;
          out.cacheTypeV = current.lastResult.cacheTypeV;
        }
      }
      if (lastError) out.lastError = lastError;
      if (lastExit) out.lastExit = { exitCode: lastExit.exitCode, name: lastExit.name, swapped: Boolean(lastExit.swapped), idle: Boolean(lastExit.idle) };
      return out;
    },
    ensure: async function(args) {
      return runEnsure(args, false);
    },
    relaunch: async function(args) {
      return runEnsure(args, true);
    },
    stop: async function() {
      if (!current) return { ok: true, stopped: false };
      lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, manual: true };
      current.meta.retired = true;
      current.handle.terminate();
      current = null;
      return { ok: true, stopped: true };
    },
    gpu: async function(args) {
      try {
        var g = await detectGpu(String(args && args.backend || ""));
        var ram = await detectRam(String(args && args.backend || ""));
        if (!g.hasNvidia && ram.totalMB === 0) return { ok: false, error: "\u672A\u68C0\u6D4B\u5230 NVIDIA GPU\uFF0C\u4E5F\u65E0\u6CD5\u8BFB\u53D6\u5185\u5B58\u4FE1\u606F" };
        return { ok: true, totalMB: g.totalVRAM, freeMB: g.freeVRAM, ramTotalMB: ram.totalMB, ramFreeMB: ram.freeMB };
      } catch (err) {
        return { ok: false, error: "\u786C\u4EF6\u68C0\u6D4B\u5931\u8D25\uFF1A" + String(err && err.message || err) };
      }
    }
  };
  ctx.effect(function() {
    return ctx.provide("localModels", localModels);
  }, "dsh-local-models: localModels service");
  ctx.effect(function() {
    return ctx.llm.registerAdapter([ROUTE], adapter);
  }, "lmcm: local-turbo adapter");
}
export {
  apply,
  inject,
  name
};
