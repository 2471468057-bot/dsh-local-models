window.__ModuleLoader__.load({
  id: "dsh-local-models",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);
var name = "dsh-local-models";
var inject = ["slots", "connection"];
var CSS_TEXT = '.lm2{max-width:720px;display:flex;flex-direction:column;gap:10px;color:var(--dsw-alias-label-primary)}.lm2-t{margin:0;font-size:14px;line-height:20px;font-weight:500}.lm2-i{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}.lm2-note{margin:0;font-size:11px;line-height:16px}.lm2-ok{color:var(--dsw-alias-state-success-primary)}.lm2-warn{color:var(--dsw-alias-state-warn-label)}.lm2-err{color:var(--dsw-alias-state-error-primary)}.lm2-toolbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.lm2-spacer{flex:1}.lm2-dirline{margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);word-break:break-all}.lm2-input,.lm2-select{box-sizing:border-box;height:26px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font:inherit;font-size:12px;line-height:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}.lm2-input::placeholder{color:var(--dsw-alias-label-dimmed)}.lm2-input:focus,.lm2-select:focus{outline:none;border-color:var(--dsw-alias-brand-primary)}.lm2-search{width:180px}.lm2-num{width:44px}.lm2-port{width:64px}.lm2-res{width:52px}.lm2-ctx{width:88px}.lm2-sel{appearance:none;padding-right:22px;cursor:pointer;background-image:url(%22data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 12 12%27 fill=%27none%27%3E%3Cpath d=%27M3 4.5L6 7.5L9 4.5%27 stroke=%27%2381858C%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 7px center;background-size:10px 10px}.lm2-btn,.lm2-btnd,.lm2-pill{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:3px;height:26px;padding:0 10px;border-radius:13px;font:inherit;font-size:12px;line-height:16px;cursor:pointer;white-space:nowrap}.lm2-btn{border:none;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground)}.lm2-btn:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.lm2-btnd{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary)}.lm2-btnd:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.lm2-pill{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);padding:0 8px}.lm2-pill:hover{background:var(--dsw-alias-interactive-bg-hover)}.lm2-pill.on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.lm2-x{box-sizing:border-box;display:inline-flex;align-items:center;height:26px;padding:0 7px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-state-error-primary);font:inherit;font-size:12px;cursor:pointer}.lm2-x:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}.lm2-btn:focus-visible,.lm2-btnd:focus-visible,.lm2-pill:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}.lm2-btn:disabled,.lm2-btnd:disabled,.lm2-pill:disabled,.lm2-x:disabled{opacity:.4;cursor:default}.lm2-cards{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.lm2-row{display:flex;align-items:center;gap:6px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:6px 9px;min-width:0}.lm2-name{flex:1;min-width:60px;border:none;background:transparent;padding:0;font:inherit;font-size:12px;line-height:16px;font-weight:500;color:var(--dsw-alias-label-primary);outline:none}.lm2-name:focus{color:var(--dsw-alias-brand-primary)}.lm2-tag{flex:none;padding:0 5px;height:18px;display:inline-flex;align-items:center;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;font-size:10px;line-height:14px;color:var(--dsw-alias-label-secondary);white-space:nowrap}.lm2-tagp{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.lm2-subrow{display:flex;align-items:center;gap:6px;padding-left:24px;margin-top:5px}.lm2-setup{border-radius:10px;background:var(--dsw-alias-bg-module-platform);padding:10px 12px;display:flex;flex-direction:column;gap:8px}.lm2-empty{padding:14px;border:1px dashed var(--dsw-alias-border-l3);border-radius:8px;text-align:center;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}.lm2-centerwrap{min-height:52vh;display:flex;align-items:center;justify-content:center}.lm2-gate{width:min(460px,92%);border-radius:12px;background:var(--dsw-alias-bg-module-platform);padding:14px 16px;display:flex;flex-direction:column;gap:10px;text-align:left}.lm2-actions{display:flex;justify-content:flex-end;gap:8px}.lm2-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.38);backdrop-filter:blur(3px)}.lm2-dialog{position:relative;width:min(440px,94vw);border-radius:12px;background:var(--dsw-alias-bg-module-platform);padding:14px 16px;display:flex;flex-direction:column;gap:12px}.lm2-dhd{display:flex;align-items:baseline;gap:8px}.lm2-dt{font-size:13px;line-height:20px;font-weight:500;color:var(--dsw-alias-label-primary)}.lm2-dr{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.lm2-lbl{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}.lmpill{display:flex;align-items:center;gap:6px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);padding:1px 2px;user-select:none}.lmpill b{font-weight:500}.lmpill-live b{color:var(--dsw-alias-state-success-primary)}';
function apply(ctx) {
  var slots = ctx.get("slots");
  if (slots === void 0 || typeof slots.inject !== "function") return;
  var connection = ctx.get("connection");
  var api = connection && connection.api;
  if (!api || !api.localModels) {
    console.warn("[dsh-local-models] localModels remote unavailable; settings UI disabled");
    return;
  }
  async function call(method, args) {
    var res = await api.localModels[method](args === void 0 ? {} : args);
    var r = res && res.result;
    if (!r || !r.ok) {
      var msg = !r || !r.error ? "localModels \u8C03\u7528\u5931\u8D25" : r.error && r.error.message || String(r.error);
      throw new Error(msg);
    }
    return r.value;
  }
  for (var stale of Array.from(document.querySelectorAll("style[data-lm2-css]"))) stale.remove();
  var styleEl = document.createElement("style");
  styleEl.dataset.lm2Css = "true";
  styleEl.textContent = CSS_TEXT;
  document.head.appendChild(styleEl);
  ctx.effect(function() {
    return function() {
      try {
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
      } catch (_e) {
      }
    };
  }, "dsh-local-models: client styles");
  var CTX_OPTS = [[0, "\u81EA\u52A8"], [2048, "2K"], [4096, "4K"], [8192, "8K"], [16384, "16K"], [32768, "32K"], [65536, "64K"], [131072, "128K"], [262144, "256K"]];
  function baseName(p) {
    return String(p).split(/[\\/]/).pop().replace(/\.(gguf|safetensors|bin)$/i, "");
  }
  function fmtSize(n) {
    if (!n || n < 0) return "?";
    if (n >= 1073741824) return (n / 1073741824).toFixed(1) + "G";
    return Math.round(n / 1048576) + "M";
  }
  function statusLine(run) {
    if (run.phase === "starting") return ["\u6B63\u5728\u62C9\u8D77\u300C" + (run.modelName || "") + "\u300D\u2026", true];
    if (run.running) {
      var idle = typeof run.idleSec === "number" ? Math.max(0, 300 - run.idleSec) : null;
      return ["\u300C" + (run.modelName || "") + "\u300D\u670D\u52A1\u4E2D :" + run.port + " \xB7 ctx=" + run.contextSize + " \xB7 KV=" + run.cacheTypeK + "/" + run.cacheTypeV + (idle !== null ? " \xB7 " + Math.ceil(idle / 60) + " \u5206\u949F\u540E\u81EA\u52A8\u5378\u8F7D" : ""), true];
    }
    if (run.lastError) return ["\u4E0A\u6B21\u672C\u5730\u8C03\u7528\u5931\u8D25\uFF1A" + run.lastError, false];
    if (run.lastExit) {
      var why = run.lastExit.swapped ? "\u5DF2\u70ED\u5207\u6362" : run.lastExit.idle ? "\u7A7A\u95F2\u81EA\u52A8\u5378\u8F7D" : "\u9000\u51FA\uFF08\u7801 " + run.lastExit.exitCode + "\uFF09";
      return ["\u300C" + (run.lastExit.name || "") + "\u300D" + why + " \xB7 \u53D1\u9001\u6D88\u606F\u65F6\u81EA\u52A8\u62C9\u8D77", false];
    }
    return ['\u672C\u5730\u6A21\u578B\u5F85\u547D \xB7 \u53D1\u9001\u6D88\u606F\u65F6\u81EA\u52A8\u62C9\u8D77\uFF08\u9009\u62E9\u5668\u4E2D\u7684"\u672C\u5730\u6A21\u578B"\u5206\u7EC4\uFF09', false];
  }
  function StatusPill(props) {
    var call2 = props.call;
    var _a = import_react.default.useState({ phase: "idle" }), run = _a[0], sRun = _a[1];
    import_react.default.useEffect(function() {
      var alive = true;
      function refresh() {
        call2("status").then(function(r) {
          if (alive) sRun(r);
        }).catch(function() {
        });
      }
      refresh();
      var stop = setInterval(refresh, 4e3);
      return function() {
        alive = false;
        clearInterval(stop);
      };
    }, []);
    var p = statusLine(run);
    return import_react.default.createElement(
      "div",
      { className: "lmpill" + (p[1] ? " lmpill-live" : ""), title: "\u672C\u5730\u6A21\u578B\u540E\u53F0\u72B6\u6001\uFF08\u8BBE\u7F6E \u2192 \u672C\u5730\u6A21\u578B \u53EF\u914D\u7F6E\uFF09" },
      import_react.default.createElement("b", null, p[0])
    );
  }
  function Modal(props) {
    return import_react.default.createElement(
      "div",
      { className: "lm2-overlay", onClick: props.onClose },
      import_react.default.createElement(
        "div",
        { className: "lm2-dialog", onClick: function(e) {
          e.stopPropagation();
        }, role: "dialog", "aria-label": props.title },
        import_react.default.createElement(
          "div",
          { className: "lm2-dhd" },
          import_react.default.createElement("span", { className: "lm2-dt" }, props.title),
          props.route ? import_react.default.createElement("span", { className: "lm2-dr" }, props.route) : null
        ),
        props.children,
        import_react.default.createElement(
          "div",
          { className: "lm2-actions" },
          import_react.default.createElement("button", { className: "lm2-btnd", onClick: props.onClose }, "\u53D6\u6D88"),
          props.onConfirm ? import_react.default.createElement("button", { className: "lm2-btn", disabled: props.confirmDisabled, onClick: props.onConfirm }, props.confirmLabel || "\u786E\u5B9A") : null
        )
      )
    );
  }
  function LocalModelsPage(props) {
    var call2 = props.call;
    var _a = import_react.default.useState(true), ld = _a[0], sLd = _a[1];
    var _b = import_react.default.useState({ dir: "", primary: "", backend: "", port: 8080, reserveVRAMGB: 0, reserveRAMGB: 0, models: [] }), data = _b[0], sData = _b[1];
    var _c = import_react.default.useState(null), st = _c[0], sSt = _c[1];
    var _e = import_react.default.useState(false), addOpen = _e[0], sAddOpen = _e[1];
    var _f = import_react.default.useState(false), dirEdit = _f[0], sDirEdit = _f[1];
    var _g = import_react.default.useState(""), dirDraft = _g[0], sDirDraft = _g[1];
    var _h = import_react.default.useState(false), scanning = _h[0], sScanning = _h[1];
    var _i = import_react.default.useState(""), q = _i[0], sQ = _i[1];
    var _k = import_react.default.useState({ phase: "idle" }), run = _k[0], sRun = _k[1];
    var _l = import_react.default.useState(""), launching = _l[0], sLaunching = _l[1];
    var _m = import_react.default.useState(""), addP = _m[0], sAddP = _m[1];
    var _n = import_react.default.useState({}), drafts = _n[0], sDrafts = _n[1];
    var _p = import_react.default.useState(null), draftOpen = _p[0], sDraftOpen = _p[1];
    function refreshRun() {
      call2("status").then(function(r) {
        sRun(r);
      }).catch(function() {
      });
    }
    function fetchDrafts(modelPath) {
      if (!modelPath) return;
      call2("drafts", { model: modelPath }).then(function(r) {
        sDrafts(function(prev) {
          var next = Object.assign({}, prev);
          next[modelPath] = r.ok ? { loading: false, items: r.models, skipped: r.skipped || 0 } : { loading: false, items: [], error: r.error };
          return next;
        });
      }).catch(function(e) {
        sDrafts(function(prev) {
          var next = Object.assign({}, prev);
          next[modelPath] = { loading: false, items: [], error: String(e) };
          return next;
        });
      });
    }
    import_react.default.useEffect(function() {
      var alive = true;
      call2("state").then(function(r) {
        if (!alive) return;
        var nd = r.data || { dir: "", primary: "", backend: "", port: 8080, reserveVRAMGB: 0, reserveRAMGB: 0, models: [] };
        sData(nd);
        sLd(false);
        refreshRun();
      }).catch(function(e) {
        if (alive) {
          sSt({ t: "err", m: String(e) });
          sLd(false);
        }
      });
      var stop = setInterval(refreshRun, 5e3);
      return function() {
        alive = false;
        clearInterval(stop);
      };
    }, []);
    function persist(next) {
      sData(next);
      call2("saveAll", { data: next }).catch(function(e) {
        console.error("save failed", e);
      });
    }
    function patchFields(patch) {
      persist(Object.assign({}, data, patch));
    }
    function num(v, dflt) {
      var n = Number(v);
      return isNaN(n) || n < 0 ? dflt : n;
    }
    function newCard(f) {
      return {
        path: f.path,
        shortName: f.name.replace(/\.(gguf|safetensors|bin)$/i, ""),
        size: f.size,
        contextSize: 0,
        spec: { mode: "none", count: 2, draftPath: "" }
      };
    }
    function doScan(dirOverride, base) {
      var src = base || data;
      var dir = (dirOverride !== void 0 ? dirOverride : src.dir).trim();
      if (!dir) return Promise.resolve(false);
      sScanning(true);
      return call2("scan", { dir }).then(function(r) {
        sScanning(false);
        if (!r.ok) {
          sSt({ t: "err", m: r.error });
          return false;
        }
        var existing = {};
        src.models.forEach(function(m) {
          existing[m.path] = m;
        });
        var merged = r.models.map(function(f) {
          return existing[f.path] || newCard(f);
        });
        persist(Object.assign({}, src, { dir, models: merged }));
        sSt(r.models.length > 0 ? { t: "ok", m: "\u5DF2\u626B\u63CF " + r.models.length + " \u4E2A\u4E3B\u6A21\u578B\uFF0C\u5E76\u540C\u6B65\u8FDB\u8F93\u5165\u6846\u9009\u62E9\u5668" } : { t: "warn", m: "\u8BE5\u76EE\u5F55\u5185\u6CA1\u6709\u5927\u4E8E 1.2GB \u7684\u6A21\u578B\u6587\u4EF6" });
        return r.models.length > 0;
      }).catch(function(e) {
        sScanning(false);
        sSt({ t: "err", m: String(e) });
        return false;
      });
    }
    function commitDir() {
      var dir = dirDraft.trim();
      if (!dir) return;
      doScan(dir, data).then(function(found) {
        if (found) {
          sDirEdit(false);
          sDirDraft("");
        }
      });
    }
    function relaunch(modelPath) {
      call2("relaunch", { model: modelPath }).then(function(r) {
        refreshRun();
        sSt(r.ok ? { t: "ok", m: "\u5DF2\u6309\u65B0\u4E0A\u4E0B\u6587\u91CD\u65B0\u4F18\u5316\uFF1Actx=" + r.contextSize + " \xB7 KV=" + r.cacheTypeK + "/" + r.cacheTypeV + " \xB7 MoE \u5916\u6EA2 " + r.moeOffloadPct + "%" } : { t: "err", m: r.error });
      }).catch(function(e) {
        sSt({ t: "err", m: String(e) });
      });
    }
    function changeCtx(i, val) {
      var c = Number(val);
      var m = data.models[i];
      patchModel(i, { contextSize: c });
      if (run.running && run.model === m.path) {
        sSt({ t: "ok", m: "\u4E0A\u4E0B\u6587\u5DF2\u6539\u4E3A " + (c > 0 ? c : "\u81EA\u52A8") + "\uFF0C\u91CD\u65B0\u4F18\u5316\u5E76\u70ED\u5207\u6362\u2026" });
        relaunch(m.path);
      } else {
        sSt({ t: "ok", m: "\u4E0A\u4E0B\u6587\u5DF2\u6539\u4E3A " + (c > 0 ? c : "\u81EA\u52A8") + "\uFF0C\u4E0B\u6B21\u542F\u52A8\u6309\u6700\u9AD8\u901F\u5EA6\u4F18\u5316" });
      }
    }
    function launchNow(modelPath) {
      var target = modelPath || data.primary || data.models[0] && data.models[0].path || "";
      if (!target) {
        sSt({ t: "warn", m: "\u6CA1\u6709\u53EF\u542F\u52A8\u7684\u6A21\u578B" });
        return Promise.resolve();
      }
      sLaunching(target);
      return call2("ensure", { model: target }).then(function(r) {
        sLaunching("");
        if (!r.ok) {
          sSt({ t: "err", m: r.error });
          refreshRun();
          return;
        }
        var ramNote = r.ramNeedMB ? " \xB7 \u5185\u5B58\u7EA6" + Math.round(r.ramNeedMB / 1024 * 10) / 10 + "G" : "";
        var moeNote = r.moeOffloadPct > 0 ? " \xB7 MoE \u5916\u6EA2 " + r.moeOffloadPct + "%" : "";
        sSt({ t: "ok", m: "\u5DF2\u5C31\u7EEA\uFF1Actx=" + r.contextSize + " \xB7 KV=" + r.cacheTypeK + "/" + r.cacheTypeV + " \xB7 VRAM\u7EA6" + r.vramMB + "MB\uFF08" + r.vramUsage + "%\uFF09" + ramNote + moeNote });
        refreshRun();
      }).catch(function(e) {
        sLaunching("");
        sSt({ t: "err", m: String(e) });
      });
    }
    function removeAt(i) {
      var victim = data.models[i];
      var next = Object.assign({}, data, { models: data.models.filter(function(_, j) {
        return j !== i;
      }) });
      if (data.primary === victim.path) next.primary = "";
      persist(next);
    }
    function addByPath(path) {
      if (data.models.some(function(m) {
        return m.path === path;
      })) {
        sSt({ t: "err", m: "\u8BE5\u8DEF\u5F84\u5DF2\u5B58\u5728" });
        return false;
      }
      persist(Object.assign({}, data, { models: data.models.concat([newCard({ path, shortName: baseName(path), size: -1 })]) }));
      sSt(null);
      return true;
    }
    if (ld) return import_react.default.createElement("p", { className: "lm2-i" }, "\u52A0\u8F7D\u4E2D\u2026");
    if (!data.dir || dirEdit) {
      return import_react.default.createElement(
        "div",
        { className: "lm2" },
        import_react.default.createElement(
          "div",
          { className: "lm2-centerwrap" },
          import_react.default.createElement(
            "div",
            { className: "lm2-gate" },
            import_react.default.createElement("h2", { className: "lm2-t" }, data.dir ? "\u66F4\u6539\u6A21\u578B\u76EE\u5F55" : "\u9996\u6B21\u4F7F\u7528\uFF0C\u8BF7\u5148\u9009\u62E9\u6A21\u578B\u4E3B\u8DEF\u5F84"),
            import_react.default.createElement("p", { className: "lm2-i" }, "\u586B\u5199\u5B58\u653E\u6A21\u578B\u6587\u4EF6\u7684\u76EE\u5F55\u3002\u9012\u5F52\u626B\u63CF\u6700\u591A 3 \u5C42\uFF0C\u4EC5\u52A0\u8F7D\u5927\u4E8E 1.2GB \u7684\u4E3B\u6A21\u578B\uFF1B\u7ED3\u679C\u76F4\u63A5\u51FA\u73B0\u5728\u8F93\u5165\u6846\u7684\u6A21\u578B\u9009\u62E9\u5668\u91CC\uFF0C\u53D1\u9001\u6D88\u606F\u65F6\u540E\u53F0\u81EA\u52A8\u62C9\u8D77\u670D\u52A1\u3002"),
            import_react.default.createElement("input", { className: "lm2-input", value: dirDraft, placeholder: "G:\\modes", autoFocus: true, onChange: function(e) {
              sDirDraft(e.target.value);
            }, onKeyDown: function(e) {
              if (e.key === "Enter" && dirDraft.trim()) commitDir();
            } }),
            st ? import_react.default.createElement("p", { className: "lm2-note lm2-" + st.t }, st.m) : null,
            import_react.default.createElement(
              "div",
              { className: "lm2-actions" },
              data.dir ? import_react.default.createElement("button", { className: "lm2-btnd", onClick: function() {
                sDirEdit(false);
                sDirDraft("");
                sSt(null);
              } }, "\u53D6\u6D88") : null,
              import_react.default.createElement("button", { className: "lm2-btn", disabled: !dirDraft.trim() || scanning, onClick: commitDir }, scanning ? "\u626B\u63CF\u4E2D\u2026" : data.dir ? "\u66F4\u65B0\u5E76\u626B\u63CF" : "\u5F00\u59CB\u4F7F\u7528")
            )
          )
        )
      );
    }
    var visible = data.models.filter(function(m) {
      if (!q.trim()) return true;
      var n = q.trim().toLowerCase();
      return m.shortName.toLowerCase().indexOf(n) >= 0 || m.path.toLowerCase().indexOf(n) >= 0;
    });
    var totalBytes = 0;
    data.models.forEach(function(m) {
      if (m.size > 0) totalBytes += m.size;
    });
    function patchModel(i, patch) {
      persist(Object.assign({}, data, { models: data.models.map(function(x, j) {
        return j === i ? Object.assign({}, x, patch) : x;
      }) }));
    }
    function patchSpec(i, patch) {
      persist(Object.assign({}, data, { models: data.models.map(function(x, j) {
        return j === i ? Object.assign({}, x, { spec: Object.assign({}, x.spec, patch) }) : x;
      }) }));
    }
    function starStyle(on) {
      return { boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", border: "none", borderRadius: "6px", background: "transparent", color: on ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-label-tertiary)", cursor: "pointer", fontSize: "14px", flex: "none", padding: 0 };
    }
    function draftPicker(m, i, dinfo) {
      if (dinfo.loading) return import_react.default.createElement("span", { className: "lm2-lbl" }, "\u626B\u63CF\u6587\u4EF6\u5939\u4E2D\u2026");
      if (dinfo.items.length > 0) {
        return import_react.default.createElement(
          "select",
          {
            className: "lm2-select lm2-sel lm2-draft",
            value: m.spec.draftPath || "",
            autoFocus: true,
            title: "\u4ECE\u6A21\u578B\u6240\u5728\u6587\u4EF6\u5939\u9009\u62E9\u8349\u7A3F\u6A21\u578B\uFF08\u5DF2\u6392\u9664\u89C6\u89C9\u6A21\u578B\uFF09\uFF0C\u9009\u4E2D\u540E\u81EA\u52A8\u6536\u8D77",
            onChange: function(e) {
              patchSpec(i, { draftPath: e.target.value });
              sDraftOpen(null);
            }
          },
          import_react.default.createElement("option", { value: "" }, "\u81EA\u52A8\uFF08\u540C\u76EE\u5F55\u627E *mtp*.gguf\uFF09"),
          dinfo.items.map(function(f) {
            return import_react.default.createElement("option", { key: f.path, value: f.path }, f.name + " \xB7 " + fmtSize(f.size));
          })
        );
      }
      if ((dinfo.skipped || 0) > 0) return import_react.default.createElement("span", { className: "lm2-lbl" }, "\u6587\u4EF6\u5939\u91CC\u53EA\u6709\u89C6\u89C9/\u6295\u5F71\u6A21\u578B\uFF08\u5DF2\u9690\u85CF " + dinfo.skipped + " \u4E2A\uFF09\u2014\u2014\u7559\u7A7A\u81EA\u52A8\u5339\u914D\u6216\u624B\u52A8\u8F93\u5165\u8DEF\u5F84");
      return import_react.default.createElement("input", { className: "lm2-input", style: { flex: 1 }, value: m.spec.draftPath, placeholder: "\u6587\u4EF6\u5939\u91CC\u6CA1\u6709\u5176\u4ED6\u8BED\u8A00\u6A21\u578B\u6587\u4EF6\u2014\u2014\u624B\u52A8\u8F93\u5165\u8DEF\u5F84\uFF0C\u56DE\u8F66\u6536\u8D77", onChange: function(e) {
        patchSpec(i, { draftPath: e.target.value });
      }, onKeyDown: function(e) {
        if (e.key === "Enter") sDraftOpen(null);
      } });
    }
    var rows = visible.map(function(m) {
      var i = data.models.indexOf(m);
      var isPrimary = data.primary === m.path;
      var isRunning = run.running && run.model === m.path;
      var dinfo = drafts[m.path] || { loading: false, items: [] };
      return import_react.default.createElement(
        "li",
        { key: m.path, style: { display: "flex", flexDirection: "column" } },
        import_react.default.createElement(
          "div",
          { className: "lm2-row" },
          import_react.default.createElement("button", { style: starStyle(isPrimary), title: isPrimary ? "\u4E3B\u6A21\u578B\uFF08\u542F\u52A8\u4F18\u5148\uFF09" : "\u8BBE\u4E3A\u4E3B\u6A21\u578B", onClick: function() {
            patchFields({ primary: isPrimary ? "" : m.path });
          } }, isPrimary ? "\u2605" : "\u2606"),
          import_react.default.createElement("input", { className: "lm2-name", value: m.shortName, title: m.path, onChange: function(e) {
            patchModel(i, { shortName: e.target.value });
          } }),
          import_react.default.createElement("span", { className: "lm2-tag" + (isRunning ? " lm2-tagp" : "") }, isRunning ? "\u8FD0\u884C\u4E2D" : fmtSize(m.size)),
          import_react.default.createElement(
            "select",
            { className: "lm2-select lm2-sel lm2-ctx", value: String(m.contextSize || 0), title: "\u4E0A\u4E0B\u6587\uFF08\u81EA\u52A8=\u6309\u663E\u5B58\u4F18\u5316\u5230\u6700\u9AD8\u901F\u5EA6\uFF1B\u6539\u4E0A\u4E0B\u6587\u7ACB\u5373\u91CD\u65B0\u4F18\u5316\uFF09", onChange: function(e) {
              changeCtx(i, e.target.value);
            } },
            CTX_OPTS.map(function(o) {
              return import_react.default.createElement("option", { key: o[0], value: String(o[0]) }, o[1]);
            })
          ),
          import_react.default.createElement("button", { key: "none", className: "lm2-pill" + (m.spec.mode === "none" ? " on" : ""), title: "\u5173\u95ED\u6295\u673A\u89E3\u7801", onClick: function() {
            patchSpec(i, { mode: "none" });
            sDraftOpen(null);
          } }, "\u65E0"),
          import_react.default.createElement("button", { key: "mtp", className: "lm2-pill" + (m.spec.mode === "mtp" ? " on" : ""), title: "MTP \u81EA\u63A8\u6D4B\uFF08\u6A21\u578B\u5185\u7F6E\u5934\uFF09", onClick: function() {
            patchSpec(i, { mode: "mtp" });
            sDraftOpen(null);
          } }, "MTP"),
          import_react.default.createElement("button", { key: "draft", className: "lm2-pill" + (m.spec.mode === "draft" ? " on" : ""), title: "\u9009\u62E9\u5916\u90E8\u8349\u7A3F\u6A21\u578B\uFF08\u70B9\u51FB\u5C55\u5F00\u4E0B\u62C9\uFF0C\u9009\u4E2D\u540E\u6536\u8D77\uFF09", onClick: function() {
            if (draftOpen === m.path) {
              sDraftOpen(null);
            } else {
              patchSpec(i, { mode: "draft" });
              sDraftOpen(m.path);
              fetchDrafts(m.path);
            }
          } }, "MTP\u6A21\u578B"),
          m.spec.mode !== "none" ? import_react.default.createElement("input", { className: "lm2-input lm2-num", type: "number", min: 1, max: 8, title: "\u6BCF\u6B21\u63A8\u6D4B\u6570\u91CF", value: String(m.spec.count), onChange: function(e) {
            patchSpec(i, { count: Math.min(8, Math.max(1, Number(e.target.value) || 2)) });
          } }) : null,
          import_react.default.createElement("button", { className: "lm2-btn", disabled: launching === m.path, title: run.running && !isRunning ? "\u70B9\u51FB\u7ACB\u5373\u70ED\u5207\u6362\u5230\u8BE5\u6A21\u578B" : "\u7ACB\u5373\u542F\u52A8", onClick: function() {
            launchNow(m.path);
          } }, launching === m.path ? "\u2026" : "\u25B6"),
          import_react.default.createElement("button", { className: "lm2-x", title: "\u79FB\u9664", onClick: function() {
            removeAt(i);
          } }, "\u2715")
        ),
        m.spec.mode === "draft" && draftOpen === m.path ? import_react.default.createElement(
          "div",
          { className: "lm2-subrow" },
          import_react.default.createElement("span", { className: "lm2-lbl" }, "\u8349\u7A3F"),
          draftPicker(m, i, dinfo),
          (dinfo.skipped || 0) > 0 && dinfo.items.length > 0 ? import_react.default.createElement("span", { className: "lm2-tag", title: "\u89C6\u89C9/\u6295\u5F71\u6A21\u578B\u4E0D\u80FD\u5F53\u8349\u7A3F\uFF0C\u5DF2\u9690\u85CF" }, "\u5DF2\u9690\u85CF " + dinfo.skipped) : null,
          import_react.default.createElement("button", { className: "lm2-btnd", title: "\u91CD\u65B0\u626B\u63CF\u8BE5\u6A21\u578B\u6240\u5728\u6587\u4EF6\u5939", onClick: function() {
            fetchDrafts(m.path);
          } }, "\u27F3")
        ) : null
      );
    });
    return import_react.default.createElement(
      "div",
      { className: "lm2" },
      import_react.default.createElement(
        "div",
        { className: "lm2-setup" },
        import_react.default.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "6px" } },
          import_react.default.createElement("span", { style: { flex: 1, fontSize: "13px", fontWeight: 500 } }, "\u540E\u7AEF\u4E0E\u542F\u52A8\uFF08TurboQuant \xB7 llama-server\uFF09"),
          run.running ? import_react.default.createElement("button", { className: "lm2-btnd", onClick: function() {
            call2("stop").then(refreshRun).catch(function() {
            });
          } }, "\u25A0 \u5378\u8F7D") : import_react.default.createElement("button", { className: "lm2-btn", disabled: data.models.length === 0 || launching !== "", onClick: function() {
            launchNow(null);
          } }, "\u25B6 \u542F\u52A8\u4E3B\u6A21\u578B")
        ),
        import_react.default.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "6px" } },
          import_react.default.createElement("input", { className: "lm2-input", style: { flex: 1 }, value: data.backend, placeholder: "\u540E\u7AEF\u76EE\u5F55\uFF08\u542B llama-server.exe\uFF09", onChange: function(e) {
            patchFields({ backend: e.target.value });
          } }),
          import_react.default.createElement("input", { className: "lm2-input lm2-port", type: "number", value: String(data.port || 8080), title: "\u7AEF\u53E3", onChange: function(e) {
            patchFields({ port: Number(e.target.value) || 8080 });
          } }),
          import_react.default.createElement("button", { className: "lm2-btnd", disabled: !data.backend.trim(), title: "\u68C0\u6D4B GPU \u4E0E\u5185\u5B58", onClick: function() {
            call2("gpu", { backend: data.backend }).then(function(r) {
              sSt(r.ok ? { t: "ok", m: "GPU \u5171 " + r.totalMB + "MB / \u7A7A\u95F2 " + r.freeMB + "MB \xB7 \u5185\u5B58\u7A7A\u95F2 " + (r.ramFreeMB || 0) + "MB" } : { t: "err", m: r.error });
            }).catch(function(e) {
              sSt({ t: "err", m: String(e) });
            });
          } }, "\u{1F3AE}")
        ),
        import_react.default.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } },
          import_react.default.createElement("span", { className: "lm2-lbl", title: "\u4F18\u5316\u5668\u628A\u8FD9\u90E8\u5206\u663E\u5B58\u89C6\u4E3A\u4E0D\u53EF\u7528\u2014\u2014\u4E0A\u4E0B\u6587\u4F1A\u76F8\u5E94\u7F29\u77ED\u3001KV \u6863\u4F4D\u53EF\u80FD\u964D\u7EA7\uFF0C\u7ED9\u684C\u9762/\u6E38\u620F\u7559\u4F59\u91CF" }, "\u4FDD\u7559\u663E\u5B58"),
          import_react.default.createElement("input", { className: "lm2-input lm2-res", type: "number", min: 0, step: "0.5", value: String(num(data.reserveVRAMGB, 0)), onChange: function(e) {
            patchFields({ reserveVRAMGB: Math.min(64, num(e.target.value, 0)) });
          } }),
          import_react.default.createElement("span", { className: "lm2-lbl" }, "GB"),
          import_react.default.createElement("span", { className: "lm2-lbl", title: "\u542F\u52A8\u524D\u68C0\u67E5\uFF1A\u653E\u4E0D\u8FDB\u663E\u5B58\u7684\u90E8\u5206\u8981\u843D\u7CFB\u7EDF\u5185\u5B58\uFF0C\u82E5\u4F4E\u4E8E\u8BE5\u9884\u7559\u91CF\u5C06\u62D2\u7EDD\u542F\u52A8\u5E76\u63D0\u793A" }, "\u4FDD\u7559\u5185\u5B58"),
          import_react.default.createElement("input", { className: "lm2-input lm2-res", type: "number", min: 0, step: "0.5", value: String(num(data.reserveRAMGB, 0)), onChange: function(e) {
            patchFields({ reserveRAMGB: Math.min(64, num(e.target.value, 0)) });
          } }),
          import_react.default.createElement("span", { className: "lm2-lbl" }, "GB")
        ),
        import_react.default.createElement(StatusPill, { call: call2 })
      ),
      import_react.default.createElement(
        "div",
        { className: "lm2-toolbar" },
        import_react.default.createElement("input", { className: "lm2-input lm2-search", value: q, placeholder: "\u641C\u7D22\u2026", onChange: function(e) {
          sQ(e.target.value);
        } }),
        import_react.default.createElement("span", { className: "lm2-spacer" }),
        import_react.default.createElement("button", { className: "lm2-btnd", disabled: scanning, onClick: function() {
          doScan();
        } }, scanning ? "\u626B\u63CF\u4E2D\u2026" : "\u27F3 \u626B\u63CF"),
        import_react.default.createElement("button", { className: "lm2-btnd", onClick: function() {
          sDirDraft(data.dir);
          sDirEdit(true);
          sSt(null);
        } }, "\u76EE\u5F55"),
        import_react.default.createElement("button", { className: "lm2-btn", onClick: function() {
          sAddOpen(true);
        } }, "\uFF0B \u6587\u4EF6")
      ),
      import_react.default.createElement("p", { className: "lm2-dirline" }, "\u{1F4C1} " + data.dir + " \xB7 " + data.models.length + " \u4E2A \xB7 " + (totalBytes > 0 ? (totalBytes / 1073741824).toFixed(1) + " GB \xB7 " : "") + "\u5DF2\u540C\u6B65\u81F3\u8F93\u5165\u6846\u9009\u62E9\u5668\u300C\u672C\u5730\u6A21\u578B\u300D"),
      st ? import_react.default.createElement("p", { className: "lm2-note lm2-" + st.t }, st.m) : null,
      data.models.length === 0 ? import_react.default.createElement("div", { className: "lm2-empty" }, "\u6CA1\u6709\u5927\u4E8E 1.2GB \u7684\u6A21\u578B\u6587\u4EF6\u2014\u2014\u6362\u76EE\u5F55\u626B\u63CF\u6216\u624B\u52A8\u6DFB\u52A0\u6587\u4EF6\u3002") : visible.length === 0 ? import_react.default.createElement("div", { className: "lm2-empty" }, "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u578B\u3002") : import_react.default.createElement("ul", { className: "lm2-cards" }, rows),
      addOpen ? import_react.default.createElement(
        Modal,
        {
          title: "\u6DFB\u52A0\u5355\u4E2A\u6A21\u578B\u6587\u4EF6",
          route: "\u4E0D\u53D7 1.2GB \u8FC7\u6EE4\u9650\u5236",
          onClose: function() {
            sAddOpen(false);
          },
          confirmDisabled: !addP.trim(),
          onConfirm: function() {
            if (addByPath(addP.trim())) sAddOpen(false);
          }
        },
        import_react.default.createElement("input", { className: "lm2-input", value: addP, placeholder: "G:\\modes\\xxx.gguf", autoFocus: true, onChange: function(e) {
          sAddP(e.target.value);
        }, onKeyDown: function(e) {
          if (e.key === "Enter" && addP.trim() && addByPath(addP.trim())) sAddOpen(false);
        } })
      ) : null
    );
  }
  slots.inject("settings.section", function() {
    return slots.register(
      { name: "settings.section", id: "local-models", order: 11, label: "\u672C\u5730\u6A21\u578B", inject: function() {
        return { call };
      } },
      LocalModelsPage
    );
  });
  slots.inject("conversation.composer.dock", function() {
    return slots.register(
      { name: "conversation.composer.dock", id: "local-turbo-status", order: 90, label: "\u672C\u5730\u6A21\u578B\u72B6\u6001", inject: function() {
        return { call };
      } },
      StatusPill
    );
  });
}
    return module.exports;
  }
});
