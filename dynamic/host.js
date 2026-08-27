return {
  inject: ['llm', 'timer'],
  apply(ctx) {
    var creds = ctx.get('credentials')
    var sp = ctx.get('subprocess')
    var fsvc = ctx.get('fs')
    var REF_DATA = 'LOCAL_MODELS_DATA'
    var MIN_SIZE = 1258291200
    var IDLE_MS = 5 * 60 * 1000
    var ROUTE = 'local-turbo'
    var VIS_RE = /mmproj|projector|vision|visual|clip|ocr|image|vit[-_. 0-9]|[-_. ]vl[-_. 0-9]|internvl|minicpm-v/i
    var lastError = null

    function res(ref) {
      if (!creds) return Promise.resolve('')
      return creds.resolve(ref).then(function(h) { return h ? String(h.value) : '' }).catch(function() { return '' })
    }
    function put(ref, value) {
      if (!creds) return Promise.resolve(false)
      if (value === undefined || value === null || value === '') {
        return creds.unset(ref).then(function() { return true }).catch(function() { return false })
      }
      return creds.set(ref, value).then(function() { return true }).catch(function() { return false })
    }
    function clampGB(v) {
      var n = Number(v)
      if (isNaN(n) || n < 0) return 0
      return Math.min(64, n)
    }
    function normalize(data) {
      var d = data && typeof data === 'object' ? data : {}
      var models = Array.isArray(d.models) ? d.models : []
      return {
        dir: typeof d.dir === 'string' ? d.dir : '',
        primary: typeof d.primary === 'string' ? d.primary : '',
        backend: typeof d.backend === 'string' && d.backend ? d.backend : 'G:\\modes\\turboquant-plus-tqp-v0.3.0-windows-x64-cuda12.4',
        port: Number(d.port) > 0 ? Math.floor(Number(d.port)) : 8080,
        reserveVRAMGB: clampGB(d.reserveVRAMGB),
        reserveRAMGB: clampGB(d.reserveRAMGB),
        models: models.map(function(m) {
          return {
            path: String(m.path || ''),
            shortName: String(m.shortName || '').trim() || String(m.path || '').split(/[\\/]/).pop().replace(/\.(gguf|safetensors|bin)$/i, ''),
            size: Number(m.size) >= 0 ? Number(m.size) : -1,
            contextSize: [0, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144].indexOf(Number(m.contextSize)) >= 0 ? Number(m.contextSize) : 0,
            spec: {
              mode: m.spec && m.spec.mode === 'mtp' ? 'mtp' : m.spec && m.spec.mode === 'draft' ? 'draft' : 'none',
              count: Math.min(8, Math.max(1, Number(m.spec && m.spec.count) || 2)),
              draftPath: String(m.spec && m.spec.draftPath || ''),
            },
          }
        }).filter(function(m) { return m.path }),
      }
    }
    function readData() {
      return res(REF_DATA).then(function(raw) {
        var parsed = {}
        try { parsed = JSON.parse(raw || '{}') } catch (_e) {}
        return normalize(parsed)
      })
    }

    harness.handle('local-models.state', async () => ({ ok: true, data: await readData() }))
    harness.handle('local-models.saveAll', async function(args) {
      var data = normalize(args.data)
      var ok = await put(REF_DATA, data.dir || data.models.length > 0 || data.backend ? JSON.stringify(data) : '')
      return ok ? { ok: true } : { ok: false, error: '写入存储失败' }
    })

    var SKIP_DIR = /^(node_modules|\.git|\.hg|\.svn|\$recycle\.bin|system volume information|lost\+found)$/i
    harness.handle('local-models.scan', async function(args) {
      if (!fsvc || typeof fsvc.listDir !== 'function') return { ok: false, error: '宿主 fs 服务不可用' }
      var dirPath = String(args.dir || '').trim()
      if (!dirPath) return { ok: false, error: '未填写目录路径' }
      var out = []
      var dirsWalked = 0
      async function walk(target, depth) {
        if (depth > 3 || out.length >= 200 || dirsWalked > 400) return
        dirsWalked++
        var entries
        try { entries = await fsvc.listDir(target) } catch (_err) { return }
        for (var i = 0; i < entries.length; i++) {
          if (out.length >= 200) return
          var e = entries[i]
          if (!e) continue
          var name = String(e.name)
          if (e.type === 'directory') {
            if (SKIP_DIR.test(name)) continue
            await walk(e.target, depth + 1)
            continue
          }
          if (e.type !== 'file' && e.type !== 'symlink') continue
          if (!/\.(gguf|safetensors|bin)$/i.test(name)) continue
          var size = typeof e.size === 'number' ? e.size : undefined
          if (size === undefined) {
            try { var si = await fsvc.stat(e.target); size = si && si.type === 'file' ? si.size : undefined } catch (_e2) {}
          }
          if (typeof size !== 'number' || size <= MIN_SIZE) continue
          out.push({ path: String(e.target.displayPath), name: name, size: size })
        }
      }
      try {
        var t = await fsvc.resolve(dirPath)
        var info = await fsvc.stat(t)
        if (!info) return { ok: false, error: '目录不存在：' + dirPath }
        if (info.type !== 'directory') return { ok: false, error: '该路径不是目录：' + dirPath }
        await walk(t, 0)
        out.sort(function(a, b) { return b.size - a.size })
        return { ok: true, scanned: dirsWalked, models: out }
      } catch (err) {
        return { ok: false, error: '扫描失败：' + String(err && err.code ? '[' + err.code + '] ' : '') + String(err && err.message || err) }
      }
    })

    harness.handle('local-models.drafts', async function(args) {
      if (!fsvc || typeof fsvc.listDir !== 'function') return { ok: false, error: '宿主 fs 服务不可用' }
      var modelPath = String(args.model || '')
      var cutAt = Math.max(modelPath.lastIndexOf('\\'), modelPath.lastIndexOf('/'))
      if (cutAt <= 0) return { ok: false, error: '无法确定模型所在文件夹' }
      var dirPath = modelPath.slice(0, cutAt)
      var exclude = {}
      exclude[modelPath] = true
      ;(Array.isArray(args.exclude) ? args.exclude : []).forEach(function(p) { exclude[String(p)] = true })
      var out = []
      var skipped = 0
      async function walk(target, depth) {
        if (depth > 1 || out.length >= 60) return
        var entries
        try { entries = await fsvc.listDir(target) } catch (_err) { return }
        for (var i = 0; i < entries.length; i++) {
          if (out.length >= 60) return
          var e = entries[i]
          if (!e) continue
          var name = String(e.name)
          if (e.type === 'directory' && depth === 0 && !SKIP_DIR.test(name)) {
            await walk(e.target, depth + 1)
            continue
          }
          if (e.type !== 'file' && e.type !== 'symlink') continue
          if (!/\.(gguf|safetensors|bin)$/i.test(name)) continue
          var p = String(e.target.displayPath)
          if (exclude[p]) continue
          if (VIS_RE.test(name.toLowerCase())) { skipped++; continue }
          var size = typeof e.size === 'number' ? e.size : undefined
          if (size === undefined) {
            try { var si = await fsvc.stat(e.target); size = si && si.type === 'file' ? si.size : undefined } catch (_e2) {}
          }
          if (typeof size !== 'number' || size < 8388608) continue
          out.push({ path: p, name: name, size: size })
        }
      }
      try {
        var t = await fsvc.resolve(dirPath)
        var info = await fsvc.stat(t)
        if (!info || info.type !== 'directory') return { ok: false, error: '模型文件夹不存在：' + dirPath }
        await walk(t, 0)
        out.sort(function(a, b) { return a.size - b.size })
        return { ok: true, dir: dirPath, models: out, skipped: skipped }
      } catch (err) {
        return { ok: false, error: '读取文件夹失败：' + String(err && err.message || err) }
      }
    })

    var hwCache = { at: 0, gpu: null, ram: null }
    async function detectRam(cwd) {
      if (hwCache.ram && Date.now() - hwCache.at < 60000) return hwCache.ram
      var out = { totalMB: 0, freeMB: 0 }
      try {
        var h = sp.spawn({ argv: ['powershell', '-NoProfile', '-Command', '$o=Get-CimInstance Win32_OperatingSystem; "$($o.TotalVisibleMemorySize),$($o.FreePhysicalMemory)"'], cwd: cwd || 'C:\\', stdio: { stdin: 'ignore', stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } }, graceMs: 8000 })
        await h.done.catch(function() {})
        var text = h.collected && h.collected.stdout ? h.collected.stdout.readFrom(0).text : ''
        var parts = (text.trim().split(/\r?\n/)[0] || '').split(',')
        out = { totalMB: Math.round((parseInt(parts[0], 10) || 0) / 1024), freeMB: Math.round((parseInt(parts[1], 10) || 0) / 1024) }
      } catch (_e) {}
      hwCache.ram = out
      return out
    }
    async function detectGpu(cwd) {
      if (hwCache.gpu && Date.now() - hwCache.at < 60000) return hwCache.gpu
      var out = { totalVRAM: 0, freeVRAM: 0, hasNvidia: false }
      try {
        var h = sp.spawn({ argv: ['nvidia-smi', '--query-gpu=memory.total,memory.free', '--format=csv,noheader,nounits'], cwd: cwd || 'C:\\', stdio: { stdin: 'ignore', stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } }, graceMs: 5000 })
        await h.done.catch(function() {})
        var text = h.collected && h.collected.stdout ? h.collected.stdout.readFrom(0).text : ''
        var parts = (text.trim().split(/\r?\n/)[0] || '').split(',').map(function(s) { return s.trim() })
        var total = parseInt(parts[0], 10) || 0
        out = { totalVRAM: total, freeVRAM: parseInt(parts[1], 10) || 0, hasNvidia: total > 0 }
      } catch (_e) {}
      hwCache.gpu = out
      hwCache.at = Date.now()
      return out
    }

    function inferModelInfo(filename, fileSize) {
      var lower = String(filename).toLowerCase()
      var layers = 32, kvHeads = 8, headDim = 128, contextLength = 8192, activeB = 0
      if (/70b/.test(lower)) { layers = 80; kvHeads = 8 }
      else if (/35b|32b/.test(lower)) { layers = 64; kvHeads = 4 }
      else if (/13b/.test(lower)) { layers = 40; kvHeads = 4 }
      else if (/9b|8b/.test(lower)) { layers = 32; kvHeads = 8 }
      else if (/7b/.test(lower)) { layers = 32; kvHeads = 8 }
      else if (/3b|4b/.test(lower)) { layers = 26; kvHeads = 4 }
      else if (/1b/.test(lower)) { layers = 16; kvHeads = 4; headDim = 64 }
      var m = lower.match(/(\d+)k(?![a-z])/)
      if (m) contextLength = parseInt(m[1], 10) * 1024
      var am = lower.match(/(\d+)b[-_ ]?a[-_ ]?(\d+)b/)
      var moe = Boolean(am)
      if (am) activeB = parseInt(am[2], 10)
      return { sizeBytes: fileSize, layers: layers, kvHeads: kvHeads, headDim: headDim, contextLength: contextLength, isMoE: moe, activeB: activeB }
    }
    function optimalContext(freeVRAM, sizeBytes, info) {
      var availKV = (freeVRAM - sizeBytes / 1048576) * 0.85
      if (availKV <= 0) return 2048
      var perTok = (2 * info.layers * info.kvHeads * info.headDim * 2 * 0.4) / 1048576
      var maxTok = Math.floor(availKV / perTok)
      return Math.min(Math.max(Math.floor(maxTok / 2048) * 2048, 2048), info.contextLength, 131072)
    }
    function kvBitsOf(t) {
      if (t === 'f16') return 16
      if (t === 'q8_0') return 8
      if (t === 'turbo4') return 4.25
      if (t === 'turbo3') return 3.5
      if (t === 'turbo2') return 2.5
      return 4
    }
    function optimizeParams(modelPath, sizeBytes, sys, port, ctxOverride, reserveVRAMMB, draftPath) {
      var info = inferModelInfo(modelPath, sizeBytes || 0)
      var freeVRAM = Math.max(0, (sys.hasNvidia ? sys.freeVRAM : 8000) - (reserveVRAMMB || 0))
      if (draftPath) freeVRAM = Math.max(0, freeVRAM - 2048)
      var ck = 'turbo4', cv = 'turbo3'
      var sizeMB = Math.ceil((sizeBytes || 0) / 1048576)
      var moeOffloadPct = 0
      var contextSize, vramMB
      if (info.isMoE && sizeMB > 0) {
        var kvPerTokMB = 2 * info.layers * info.kvHeads * info.headDim * (kvBitsOf(ck) + kvBitsOf(cv)) / 8 / 1048576
        var denseMB = Math.round(sizeMB * 0.15)
        var activeMB = info.activeB > 0 ? Math.round(info.activeB * 550) : Math.round(sizeMB * 0.12)
        var overhead = 512
        var targetCtx = ctxOverride > 0 ? ctxOverride : 65536
        var need = denseMB + activeMB + kvPerTokMB * targetCtx + overhead
        if (need > freeVRAM) {
          var availKV = Math.max(0, freeVRAM - denseMB - activeMB - overhead)
          targetCtx = Math.max(2048, Math.floor(availKV / kvPerTokMB / 2048) * 2048)
        }
        contextSize = Math.min(targetCtx, 131072)
        var kvMB = kvPerTokMB * contextSize
        var resident = denseMB + activeMB + kvMB + overhead
        var expertMB = sizeMB - denseMB
        var leftover = Math.max(0, freeVRAM - resident)
        var residentExpert = Math.min(expertMB, activeMB + leftover)
        var off = expertMB > 0 ? Math.ceil((expertMB - residentExpert) / expertMB * 100) : 0
        moeOffloadPct = off >= 5 ? Math.min(90, off) : 0
        vramMB = Math.ceil(denseMB + (expertMB - (moeOffloadPct > 0 ? Math.floor(expertMB * moeOffloadPct / 100) : 0)) + kvMB)
      } else {
        contextSize = ctxOverride > 0 ? ctxOverride : optimalContext(freeVRAM, sizeBytes || 0, info)
        vramMB = Math.ceil((sizeMB + 2 * info.layers * info.kvHeads * info.headDim * contextSize * 2 * 0.4) / 1048576)
      }
      var b = 2048, ub = 512
      if (freeVRAM > 0 && vramMB / freeVRAM > 0.9) { b = 1024; ub = 256 }
      var args = ['-m', modelPath, '-ngl', '999', '-c', String(contextSize), '-b', String(b), '-ub', String(ub), '-ctk', ck, '-ctv', cv, '-fa', 'on', '--context-shift', '--host', '127.0.0.1', '--port', String(port), '--no-webui']
      if (moeOffloadPct > 0) args.push('--n-cpu-moe', String(moeOffloadPct))
      else if (!info.isMoE && freeVRAM > 12000) args.push('--mlock')
      return { args: args, contextSize: contextSize, batchSize: b, ubatchSize: ub, cacheTypeK: ck, cacheTypeV: cv, vramMB: vramMB, vramUsage: freeVRAM > 0 ? Math.min(100, Math.round(vramMB / freeVRAM * 100)) : 0, isMoE: info.isMoE, moeOffloadPct: moeOffloadPct }
    }

    var current = null
    var lastExit = null
    function touch() { if (current) current.lastUsed = Date.now() }
    function idleMs() { return current ? Date.now() - (current.lastUsed || Date.now()) : 0 }
    function gc() {
      if (current && idleMs() >= IDLE_MS) {
        lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, idle: true }
        current.meta.retired = true
        current.handle.terminate()
        current = null
      }
    }
    ctx.interval(function() {
      try { gc() } catch (err) { console.error('idle gc failed', err) }
    }, 30000)

    async function ensure(modelPath, data, force) {
      gc()
      if (!sp || typeof sp.spawn !== 'function') throw new Error('宿主 subprocess 服务不可用')
      if (!fsvc) throw new Error('宿主 fs 服务不可用')
      var backend = data.backend
      var card = data.models.find(function(m) { return m.path === modelPath })
      if (!card) throw new Error('未知本地模型：' + modelPath)
      var userCtx = card.contextSize || 0
      if (current && current.meta.model === modelPath && !force && current.meta.userCtx === userCtx) {
        touch()
        return current.lastResult
      }
      try {
        var exeT = await fsvc.resolve(backend + '\\llama-server.exe')
        var ei = await fsvc.stat(exeT)
        if (!ei || ei.type !== 'file') throw new Error('x')
      } catch (_e) {
        throw new Error('后端目录下没有 llama-server.exe：' + backend)
      }
      var reserveVRAMMB = Math.round(clampGB(data.reserveVRAMGB) * 1024)
      var reserveRAMMB = Math.round(clampGB(data.reserveRAMGB) * 1024)
      var sys = await detectGpu(backend)
      var opt = optimizeParams(card.path, card.size > 0 ? card.size : 0, sys, data.port, card.contextSize || 0, reserveVRAMMB, card.spec.mode === 'draft' ? card.spec.draftPath : '')
      if (card.spec.mode === 'mtp' || card.spec.mode === 'draft') {
        opt.args.push('--spec-type', 'draft-mtp', '--spec-draft-n-max', String(card.spec.count))
        if (card.spec.mode === 'draft' && card.spec.draftPath) opt.args.push('--spec-draft-model', card.spec.draftPath)
      }
      var sizeMB = card.size > 0 ? Math.ceil(card.size / 1048576) : 0
      var effFreeVRAM = Math.max(0, (sys.hasNvidia ? sys.freeVRAM : 0) - reserveVRAMMB)
      var ramNeedMB = sizeMB > 0 ? Math.max(opt.isMoE && opt.moeOffloadPct > 0 ? Math.ceil(sizeMB * opt.moeOffloadPct / 100) : (opt.vramMB > effFreeVRAM ? opt.vramMB - effFreeVRAM : 256), 256) : 0
      var ram = await detectRam(backend)
      sys.ramFreeMB = ram.freeMB
      sys.ramTotalMB = ram.totalMB
      if (ramNeedMB > 0 && sys.ramFreeMB > 0 && ramNeedMB + reserveRAMMB > sys.ramFreeMB) {
        throw new Error('系统内存不足：预计需 ' + ramNeedMB + 'MB + 预留 ' + reserveRAMMB + 'MB，当前空闲仅 ' + sys.ramFreeMB + 'MB')
      }
      if (current) {
        lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, swapped: true }
        current.meta.retired = true
        current.handle.terminate()
        current = null
      }
      var handle = sp.spawn({ argv: [backend + '\\llama-server.exe'].concat(opt.args), cwd: backend, stdio: { stdin: 'ignore', stdout: 'inherit', stderr: 'inherit' }, graceMs: 3000 })
      var entry = { handle: handle, lastUsed: Date.now(), lastResult: null, meta: { pid: handle.pid, port: data.port, model: modelPath, name: card.shortName, userCtx: userCtx } }
      handle.done.then(function(oc) {
        if (!entry.meta.retired) lastExit = { exitCode: oc.exitCode === null ? -1 : oc.exitCode, model: modelPath, name: card.shortName }
        if (current === entry) current = null
      }).catch(function() { if (current === entry) current = null })
      current = entry
      var result = { pid: handle.pid, port: data.port, contextSize: opt.contextSize, batchSize: opt.batchSize, ubatchSize: opt.ubatchSize, cacheTypeK: opt.cacheTypeK, cacheTypeV: opt.cacheTypeV, vramMB: opt.vramMB, vramUsage: opt.vramUsage, ramNeedMB: ramNeedMB, effFreeVRAM: effFreeVRAM, moeOffloadPct: opt.moeOffloadPct }
      entry.lastResult = result
      return result
    }

    harness.handle('local-models.ensure', async function(args) {
      try {
        var data = await readData()
        var target = String(args.model || data.primary || (data.models[0] && data.models[0].path) || '')
        if (!target) return { ok: false, error: '没有可启动的模型' }
        var r = await ensure(target, data, false)
        return Object.assign({ ok: true }, r)
      } catch (err) {
        lastError = String(err && err.message || err)
        return { ok: false, error: lastError }
      }
    })
    harness.handle('local-models.relaunch', async function(args) {
      try {
        var data = await readData()
        var target = String(args.model || data.primary || (data.models[0] && data.models[0].path) || '')
        if (!target) return { ok: false, error: '没有可启动的模型' }
        var r = await ensure(target, data, true)
        return Object.assign({ ok: true }, r)
      } catch (err) {
        lastError = String(err && err.message || err)
        return { ok: false, error: lastError }
      }
    })
    harness.handle('local-models.stop', async () => {
      if (!current) return { ok: true, stopped: false }
      lastExit = { exitCode: 0, model: current.meta.model, name: current.meta.name, manual: true }
      current.meta.retired = true
      current.handle.terminate()
      current = null
      return { ok: true, stopped: true }
    })
    harness.handle('local-models.status', async () => {
      gc()
      var out = { phase: current ? 'running' : 'idle', running: Boolean(current) }
      if (current) {
        out.pid = current.meta.pid
        out.port = current.meta.port
        out.model = current.meta.model
        out.modelName = current.meta.name
        out.idleSec = Math.floor(idleMs() / 1000)
        if (current.lastResult) {
          out.contextSize = current.lastResult.contextSize
          out.cacheTypeK = current.lastResult.cacheTypeK
          out.cacheTypeV = current.lastResult.cacheTypeV
        }
      }
      if (lastError) out.lastError = lastError
      if (lastExit) out.lastExit = { exitCode: lastExit.exitCode, name: lastExit.name, swapped: Boolean(lastExit.swapped), idle: Boolean(lastExit.idle) }
      return out
    })
    harness.handle('local-models.gpu', async function(args) {
      try {
        var g = await detectGpu(String(args.backend || ''))
        var ram = await detectRam(String(args.backend || ''))
        if (!g.hasNvidia && ram.totalMB === 0) return { ok: false, error: '未检测到 NVIDIA GPU，也无法读取内存信息' }
        return { ok: true, totalMB: g.totalVRAM, freeMB: g.freeVRAM, ramTotalMB: ram.totalMB, ramFreeMB: ram.freeMB }
      } catch (err) {
        return { ok: false, error: '硬件检测失败：' + String(err && err.message || err) }
      }
    })

    function toOpenAiMessages(options) {
      var msgs = []
      if (options.system) msgs.push({ role: 'system', content: String(options.system) })
      var list = Array.isArray(options.messages) ? options.messages : []
      for (var i = 0; i < list.length; i++) {
        var m = list[i]
        var content = m.content
        var text = ''
        if (typeof content === 'string') text = content
        else if (Array.isArray(content)) {
          for (var j = 0; j < content.length; j++) {
            var b = content[j]
            if (b && b.type === 'text' && b.text) text += (text ? '\n' : '') + b.text
          }
        }
        msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: text })
      }
      return msgs
    }

    var WAKE_HINTS = [
      '喵～ 正在唤醒「{m}」，马上就来~',
      '呜～ 正在把「{m}」叫醒，等一下下~',
      '哈喽～ 「{m}」正在后台加载，稍等片刻~',
    ]
    var REWAKE_HINTS = [
      '刚才空闲被自动卸载啦，正在重新唤醒「{m}」…',
      '模型闲置被卸载了，我这就把它叫回来~',
      '刚自动卸载过，正在重新拉起「{m}」，马上好~',
    ]
    var SWITCH_HINTS = [
      '正在热切换：从「{o}」换到「{m}」~',
      '换模型啦～ 正在拉起「{m}」，稍等~',
      '切换中… 马上切到「{m}」，请稍等一下下~',
    ]
    var READY_HINTS = [
      '好了！我马上接着回答你~',
      '就绪啦，继续回答咯~',
      '来啦来啦～ 马上接着回答~',
    ]
    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    var adapter = {
      providerInfo: function() { return { id: ROUTE, name: '本地模型' } },
      providerRetryPolicy: function() { return undefined },
      listModels: async function() {
        var data = await readData()
        return data.models.map(function(m) {
          return { provider: ROUTE, id: m.path, name: m.shortName, description: m.size > 0 ? (m.size / 1073741824).toFixed(1) + ' GB' : undefined }
        })
      },
      resolveModel: async function(_provider, model) {
        var data = await readData()
        var card = data.models.find(function(m) { return m.path === model })
        var info = inferModelInfo(model, card && card.size > 0 ? card.size : 0)
        var freeVRAM = 8000
        try {
          var g = await detectGpu(data.backend)
          if (g.hasNvidia) freeVRAM = Math.max(0, g.freeVRAM - Math.round(clampGB(data.reserveVRAMGB) * 1024))
        } catch (_e) {}
        var ctxSize = card && card.contextSize > 0 ? card.contextSize : optimalContext(freeVRAM, card && card.size > 0 ? card.size : 0, info)
        return {
          provider: ROUTE, id: model, name: card ? card.shortName : baseName(model),
          context: { contextWindow: ctxSize },
          reasoning: {
            efforts: [
              { id: 'none', name: '不思考' },
              { id: 'brief', name: '简短思考' },
              { id: 'standard', name: '标准思考' },
              { id: 'deep', name: '深入思考' },
              { id: 'max', name: '极致思考' },
              { id: 'auto', name: '自动' },
            ],
            defaultEffort: 'standard',
          },
        }
      },
      prepareCall: async function(provider, model, signal) {
        var self = this
        return { model: await self.resolveModel(provider, model, signal), stream: function(options) { return self.stream(options) } }
      },
      stream: async function*(options) {
        var data, card, handle
        var hintIndex = 0, realIndex = 1
        var hinted = false
        var realStarted = false
        var assembledReal = ''
        var assembledHint = ''
        var started = false
        var queue = []
        var wake = null
        var sseBuf = ''
        try {
          data = await readData()
          card = data.models.find(function(m) { return m.path === options.model })
          var modelLabel = card ? card.shortName : baseName(options.model)
          if (current === null) {
            hinted = true
            var first = pick(lastExit && lastExit.idle ? REWAKE_HINTS : WAKE_HINTS).replace(/\{m\}/g, modelLabel)
            assembledHint = first
            yield { type: 'block-start', index: hintIndex, blockType: 'text' }
            yield { type: 'text-delta', index: hintIndex, text: first }
          } else if (current.meta.model !== options.model) {
            hinted = true
            var first2 = pick(SWITCH_HINTS).replace(/\{m\}/g, modelLabel).replace(/\{o\}/g, current.meta.name || '旧模型')
            assembledHint = first2
            yield { type: 'block-start', index: hintIndex, blockType: 'text' }
            yield { type: 'text-delta', index: hintIndex, text: first2 }
          }
          await ensure(options.model, data, false)
          if (hinted) {
            var msg = '\n\n' + pick(READY_HINTS)
            assembledHint += msg
            yield { type: 'text-delta', index: hintIndex, text: msg }
          }
          touch()
          var body = JSON.stringify({ model: card ? card.shortName : baseName(options.model), stream: true, messages: toOpenAiMessages(options) })
          if (!sp || typeof sp.spawn !== 'function') throw new Error('宿主 subprocess 服务不可用')
          handle = sp.spawn({
            argv: ['curl', '-sS', '-N', '--retry', '180', '--retry-delay', '1', '--retry-connrefused', '-X', 'POST', 'http://127.0.0.1:' + data.port + '/v1/chat/completions', '-H', 'Content-Type: application/json', '--data', '@-'],
            cwd: data.backend,
            stdio: { stdin: { data: body }, stdout: 'pipe', stderr: 'ignore' },
            graceMs: 2000,
          })
          function push(v) { queue.push(v); if (wake) { var w = wake; wake = null; w() } }
          function feedLine(line) {
            if (line.indexOf('data:') !== 0) return
            var payload = line.slice(5).trim()
            if (payload === '[DONE]') { push({ done: true }); return }
            var obj
            try { obj = JSON.parse(payload) } catch (_e) { return }
            if (obj && obj.error) { push({ err: new Error(String(obj.error.message || '本地模型返回错误')) }); return }
            var delta = obj && obj.choices && obj.choices[0] && obj.choices[0].delta
            var piece = delta && delta.content
            if (piece) {
              if (hinted && !realStarted) {
                push({ chunk: { type: 'block-end', index: hintIndex, block: { type: 'text', text: assembledHint } } })
                push({ chunk: { type: 'block-start', index: realIndex, blockType: 'text' } })
                realStarted = true
              }
              assembledReal += piece
              push({ chunk: { type: 'text-delta', index: realStarted ? realIndex : hintIndex, text: piece } })
            }
          }
          handle.stdout.on('data', function(chunk) {
            sseBuf += chunk.toString('utf8')
            var nl
            while ((nl = sseBuf.indexOf('\n')) >= 0) {
              var line = sseBuf.slice(0, nl).replace(/\r$/, '')
              sseBuf = sseBuf.slice(nl + 1)
              feedLine(line)
            }
          })
          handle.stdout.on('end', function() {
            if (sseBuf.trim()) feedLine(sseBuf.replace(/[\r\n]+$/, ''))
            sseBuf = ''
            push(started || hinted ? { done: true } : { err: new Error('本地模型服务无响应（端口 ' + data.port + '）：后端可能在加载中或启动失败，请看状态胶囊/设置页') })
          })
          handle.stdout.on('error', function(e) { push({ err: e instanceof Error ? e : new Error(String(e)) }) })
          handle.done.then(function() { push(started || hinted ? { done: true } : { err: new Error('本地模型服务连接中断') }) }).catch(function() {})
          while (true) {
            if (queue.length === 0) {
              await new Promise(function(r) { wake = r })
              continue
            }
            var item = queue.shift()
            if (item.err) throw item.err
            if (item.done) break
            if (item.chunk && item.chunk.type === 'text-delta') started = true
            touch()
            yield item.chunk
          }
          if (hinted) yield { type: 'block-end', index: hintIndex, block: { type: 'text', text: assembledHint } }
          if (realStarted) yield { type: 'block-end', index: realIndex, block: { type: 'text', text: assembledReal } }
          yield { type: 'finish', reason: { kind: 'stop' } }
        } catch (e) {
          lastError = e instanceof Error ? e.message : String(e)
          throw e
        } finally {
          if (handle) { try { handle.terminate() } catch (_e2) {} }
        }
      },
    }

    ctx.effect(function() {
      return ctx.llm.registerAdapter([ROUTE], adapter)
    }, 'lmcm: local-turbo adapter')
  },
}
