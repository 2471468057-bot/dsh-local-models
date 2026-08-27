return {
  inject: ['timer'],
  apply(ctx) {
    var timer = ctx.timer
    ctx.effect(function() {
      return styles.insert('.lm2{max-width:720px;display:flex;flex-direction:column;gap:10px;color:var(--dsw-alias-label-primary)}.lm2-t{margin:0;font-size:14px;line-height:20px;font-weight:500}.lm2-i{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}.lm2-note{margin:0;font-size:11px;line-height:16px}.lm2-ok{color:var(--dsw-alias-state-success-primary)}.lm2-warn{color:var(--dsw-alias-state-warn-label)}.lm2-err{color:var(--dsw-alias-state-error-primary)}.lm2-toolbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.lm2-spacer{flex:1}.lm2-dirline{margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);word-break:break-all}.lm2-input,.lm2-select{box-sizing:border-box;height:26px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font:inherit;font-size:12px;line-height:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}.lm2-input::placeholder{color:var(--dsw-alias-label-dimmed)}.lm2-input:focus,.lm2-select:focus{outline:none;border-color:var(--dsw-alias-brand-primary)}.lm2-search{width:180px}.lm2-num{width:44px}.lm2-port{width:64px}.lm2-res{width:52px}.lm2-ctx{width:88px}.lm2-sel{appearance:none;padding-right:22px;cursor:pointer;background-image:url(%22data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%2710%27 viewBox=%270 0 12 12%27 fill=%27none%27%3E%3Cpath d=%27M3 4.5L6 7.5L9 4.5%27 stroke=%27%2381858C%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 7px center;background-size:10px 10px}.lm2-btn,.lm2-btnd,.lm2-pill{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:3px;height:26px;padding:0 10px;border-radius:13px;font:inherit;font-size:12px;line-height:16px;cursor:pointer;white-space:nowrap}.lm2-btn{border:none;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground)}.lm2-btn:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.lm2-btnd{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary)}.lm2-btnd:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.lm2-pill{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);padding:0 8px}.lm2-pill:hover{background:var(--dsw-alias-interactive-bg-hover)}.lm2-pill.on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.lm2-x{box-sizing:border-box;display:inline-flex;align-items:center;height:26px;padding:0 7px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-state-error-primary);font:inherit;font-size:12px;cursor:pointer}.lm2-x:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}.lm2-btn:focus-visible,.lm2-btnd:focus-visible,.lm2-pill:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}.lm2-btn:disabled,.lm2-btnd:disabled,.lm2-pill:disabled,.lm2-x:disabled{opacity:.4;cursor:default}.lm2-cards{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.lm2-row{display:flex;align-items:center;gap:6px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:6px 9px;min-width:0}.lm2-name{flex:1;min-width:60px;border:none;background:transparent;padding:0;font:inherit;font-size:12px;line-height:16px;font-weight:500;color:var(--dsw-alias-label-primary);outline:none}.lm2-name:focus{color:var(--dsw-alias-brand-primary)}.lm2-tag{flex:none;padding:0 5px;height:18px;display:inline-flex;align-items:center;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;font-size:10px;line-height:14px;color:var(--dsw-alias-label-secondary);white-space:nowrap}.lm2-tagp{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.lm2-subrow{display:flex;align-items:center;gap:6px;padding-left:24px;margin-top:5px}.lm2-setup{border-radius:10px;background:var(--dsw-alias-bg-module-platform);padding:10px 12px;display:flex;flex-direction:column;gap:8px}.lm2-empty{padding:14px;border:1px dashed var(--dsw-alias-border-l3);border-radius:8px;text-align:center;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}.lm2-centerwrap{min-height:52vh;display:flex;align-items:center;justify-content:center}.lm2-gate{width:min(460px,92%);border-radius:12px;background:var(--dsw-alias-bg-module-platform);padding:14px 16px;display:flex;flex-direction:column;gap:10px;text-align:left}.lm2-actions{display:flex;justify-content:flex-end;gap:8px}.lm2-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.38);backdrop-filter:blur(3px)}.lm2-dialog{position:relative;width:min(440px,94vw);border-radius:12px;background:var(--dsw-alias-bg-module-platform);padding:14px 16px;display:flex;flex-direction:column;gap:12px}.lm2-dhd{display:flex;align-items:baseline;gap:8px}.lm2-dt{font-size:13px;line-height:20px;font-weight:500;color:var(--dsw-alias-label-primary)}.lm2-dr{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.lm2-lbl{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}.lmpill{display:flex;align-items:center;gap:6px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);padding:1px 2px;user-select:none}.lmpill b{font-weight:500}.lmpill-live b{color:var(--dsw-alias-state-success-primary)}')
    }, 'lmcm: styles v16')

    var slots = ctx.get('slots')
    if (slots === undefined) return

    var CTX_OPTS = [[0, '自动'], [2048, '2K'], [4096, '4K'], [8192, '8K'], [16384, '16K'], [32768, '32K'], [65536, '64K'], [131072, '128K'], [262144, '256K']]

    function baseName(p) {
      return String(p).split(/[\\/]/).pop().replace(/\.(gguf|safetensors|bin)$/i, '')
    }
    function fmtSize(n) {
      if (!n || n < 0) return '?'
      if (n >= 1073741824) return (n / 1073741824).toFixed(1) + 'G'
      return Math.round(n / 1048576) + 'M'
    }

    function statusLine(run) {
      if (run.phase === 'starting') return ['正在拉起「' + (run.modelName || '') + '」…', true]
      if (run.running) {
        var idle = typeof run.idleSec === 'number' ? Math.max(0, 300 - run.idleSec) : null
        return ['「' + (run.modelName || '') + '」服务中 :' + run.port + ' · ctx=' + run.contextSize + ' · KV=' + run.cacheTypeK + '/' + run.cacheTypeV + (idle !== null ? ' · ' + Math.ceil(idle / 60) + ' 分钟后自动卸载' : ''), true]
      }
      if (run.lastError) return ['上次本地调用失败：' + run.lastError, false]
      if (run.lastExit) {
        var why = run.lastExit.swapped ? '已热切换' : run.lastExit.idle ? '空闲自动卸载' : '退出（码 ' + run.lastExit.exitCode + '）'
        return ['「' + (run.lastExit.name || '') + '」' + why + ' · 发送消息时自动拉起', false]
      }
      return ['本地模型待命 · 发送消息时自动拉起（选择器中的"本地模型"分组）', false]
    }

    function StatusPill() {
      var _a = React.useState({ phase: 'idle' }), run = _a[0], sRun = _a[1]
      React.useEffect(function() {
        var alive = true
        function refresh() {
          host.call('local-models.status').then(function(r) { if (alive) sRun(r) }).catch(function() {})
        }
        refresh()
        var stop = timer.interval(refresh, 4000)
        return function() { alive = false; stop() }
      }, [])
      var p = statusLine(run)
      return React.createElement('div', { className: 'lmpill' + (p[1] ? ' lmpill-live' : ''), title: '本地模型后台状态（设置 → 本地模型 可配置）' },
        React.createElement('b', null, p[0]),
      )
    }

    function Modal(props) {
      return React.createElement('div', { className: 'lm2-overlay', onClick: props.onClose },
        React.createElement('div', { className: 'lm2-dialog', onClick: function(e) { e.stopPropagation() }, role: 'dialog', 'aria-label': props.title },
          React.createElement('div', { className: 'lm2-dhd' },
            React.createElement('span', { className: 'lm2-dt' }, props.title),
            props.route ? React.createElement('span', { className: 'lm2-dr' }, props.route) : null,
          ),
          props.children,
          React.createElement('div', { className: 'lm2-actions' },
            React.createElement('button', { className: 'lm2-btnd', onClick: props.onClose }, '取消'),
            props.onConfirm ? React.createElement('button', { className: 'lm2-btn', disabled: props.confirmDisabled, onClick: props.onConfirm }, props.confirmLabel || '确定') : null,
          ),
        ),
      )
    }

    function LocalModelsPage() {
      var _a = React.useState(true), ld = _a[0], sLd = _a[1]
      var _b = React.useState({ dir: '', primary: '', backend: '', port: 8080, reserveVRAMGB: 0, reserveRAMGB: 0, models: [] }), data = _b[0], sData = _b[1]
      var _c = React.useState(null), st = _c[0], sSt = _c[1]
      var _e = React.useState(false), addOpen = _e[0], sAddOpen = _e[1]
      var _f = React.useState(false), dirEdit = _f[0], sDirEdit = _f[1]
      var _g = React.useState(''), dirDraft = _g[0], sDirDraft = _g[1]
      var _h = React.useState(false), scanning = _h[0], sScanning = _h[1]
      var _i = React.useState(''), q = _i[0], sQ = _i[1]
      var _k = React.useState({ phase: 'idle' }), run = _k[0], sRun = _k[1]
      var _l = React.useState(''), launching = _l[0], sLaunching = _l[1]
      var _m = React.useState(''), addP = _m[0], sAddP = _m[1]
      var _n = React.useState({}), drafts = _n[0], sDrafts = _n[1]
      var _p = React.useState(null), draftOpen = _p[0], sDraftOpen = _p[1]

      function refreshRun() {
        host.call('local-models.status').then(function(r) { sRun(r) }).catch(function() {})
      }
      function fetchDrafts(modelPath) {
        if (!modelPath) return
        host.call('local-models.drafts', { model: modelPath }).then(function(r) {
          sDrafts(function(prev) {
            var next = Object.assign({}, prev)
            next[modelPath] = r.ok ? { loading: false, items: r.models, skipped: r.skipped || 0 } : { loading: false, items: [], error: r.error }
            return next
          })
        }).catch(function(e) {
          sDrafts(function(prev) {
            var next = Object.assign({}, prev)
            next[modelPath] = { loading: false, items: [], error: String(e) }
            return next
          })
        })
      }
      React.useEffect(function() {
        var alive = true
        host.call('local-models.state').then(function(r) {
          if (!alive) return
          var nd = r.data || { dir: '', primary: '', backend: '', port: 8080, reserveVRAMGB: 0, reserveRAMGB: 0, models: [] }
          sData(nd); sLd(false); refreshRun()
        }).catch(function(e) { if (alive) { sSt({ t: 'err', m: String(e) }); sLd(false) } })
        var stop = timer.interval(refreshRun, 5000)
        return function() { alive = false; stop() }
      }, [])

      function persist(next) {
        sData(next)
        host.call('local-models.saveAll', { data: next }).catch(function(e) { console.error('save failed', e) })
      }
      function patchFields(patch) {
        persist(Object.assign({}, data, patch))
      }
      function num(v, dflt) {
        var n = Number(v)
        return isNaN(n) || n < 0 ? dflt : n
      }
      function newCard(f) {
        return {
          path: f.path, shortName: f.name.replace(/\.(gguf|safetensors|bin)$/i, ''), size: f.size,
          contextSize: 0, spec: { mode: 'none', count: 2, draftPath: '' },
        }
      }
      function doScan(dirOverride, base) {
        var src = base || data
        var dir = (dirOverride !== undefined ? dirOverride : src.dir).trim()
        if (!dir) return Promise.resolve(false)
        sScanning(true)
        return host.call('local-models.scan', { dir: dir }).then(function(r) {
          sScanning(false)
          if (!r.ok) { sSt({ t: 'err', m: r.error }); return false }
          var existing = {}
          src.models.forEach(function(m) { existing[m.path] = m })
          var merged = r.models.map(function(f) { return existing[f.path] || newCard(f) })
          persist(Object.assign({}, src, { dir: dir, models: merged }))
          sSt(r.models.length > 0 ? { t: 'ok', m: '已扫描 ' + r.models.length + ' 个主模型，并同步进输入框选择器' } : { t: 'warn', m: '该目录内没有大于 1.2GB 的模型文件' })
          return r.models.length > 0
        }).catch(function(e) { sScanning(false); sSt({ t: 'err', m: String(e) }); return false })
      }
      function commitDir() {
        var dir = dirDraft.trim()
        if (!dir) return
        doScan(dir, data).then(function(found) { if (found) { sDirEdit(false); sDirDraft('') } })
      }
      function relaunch(modelPath) {
        host.call('local-models.relaunch', { model: modelPath }).then(function(r) {
          refreshRun()
          sSt(r.ok ? { t: 'ok', m: '已按新上下文重新优化：ctx=' + r.contextSize + ' · KV=' + r.cacheTypeK + '/' + r.cacheTypeV + ' · MoE 外溢 ' + r.moeOffloadPct + '%' } : { t: 'err', m: r.error })
        }).catch(function(e) { sSt({ t: 'err', m: String(e) }) })
      }
      function changeCtx(i, val) {
        var c = Number(val)
        var m = data.models[i]
        patchModel(i, { contextSize: c })
        if (run.running && run.model === m.path) {
          sSt({ t: 'ok', m: '上下文已改为 ' + (c > 0 ? c : '自动') + '，重新优化并热切换…' })
          relaunch(m.path)
        } else {
          sSt({ t: 'ok', m: '上下文已改为 ' + (c > 0 ? c : '自动') + '，下次启动按最高速度优化' })
        }
      }
      function launchNow(modelPath) {
        var target = modelPath || data.primary || (data.models[0] && data.models[0].path) || ''
        if (!target) { sSt({ t: 'warn', m: '没有可启动的模型' }); return Promise.resolve() }
        sLaunching(target)
        return host.call('local-models.ensure', { model: target }).then(function(r) {
          sLaunching('')
          if (!r.ok) { sSt({ t: 'err', m: r.error }); refreshRun(); return }
          var ramNote = r.ramNeedMB ? ' · 内存约' + Math.round(r.ramNeedMB / 1024 * 10) / 10 + 'G' : ''
          var moeNote = r.moeOffloadPct > 0 ? ' · MoE 外溢 ' + r.moeOffloadPct + '%' : ''
          sSt({ t: 'ok', m: '已就绪：ctx=' + r.contextSize + ' · KV=' + r.cacheTypeK + '/' + r.cacheTypeV + ' · VRAM约' + r.vramMB + 'MB（' + r.vramUsage + '%）' + ramNote + moeNote })
          refreshRun()
        }).catch(function(e) { sLaunching(''); sSt({ t: 'err', m: String(e) }) })
      }
      function removeAt(i) {
        var victim = data.models[i]
        var next = Object.assign({}, data, { models: data.models.filter(function(_, j) { return j !== i }) })
        if (data.primary === victim.path) next.primary = ''
        persist(next)
      }
      function addByPath(path) {
        if (data.models.some(function(m) { return m.path === path })) { sSt({ t: 'err', m: '该路径已存在' }); return false }
        persist(Object.assign({}, data, { models: data.models.concat([newCard({ path: path, shortName: baseName(path), size: -1 })]) }))
        sSt(null)
        return true
      }

      if (ld) return React.createElement('p', { className: 'lm2-i' }, '加载中…')

      if (!data.dir || dirEdit) {
        return React.createElement('div', { className: 'lm2' },
          React.createElement('div', { className: 'lm2-centerwrap' },
            React.createElement('div', { className: 'lm2-gate' },
              React.createElement('h2', { className: 'lm2-t' }, data.dir ? '更改模型目录' : '首次使用，请先选择模型主路径'),
              React.createElement('p', { className: 'lm2-i' }, '填写存放模型文件的目录。递归扫描最多 3 层，仅加载大于 1.2GB 的主模型；结果直接出现在输入框的模型选择器里，发送消息时后台自动拉起服务。'),
              React.createElement('input', { className: 'lm2-input', value: dirDraft, placeholder: 'G:\\modes', autoFocus: true, onChange: function(e) { sDirDraft(e.target.value) }, onKeyDown: function(e) { if (e.key === 'Enter' && dirDraft.trim()) commitDir() } }),
              st ? React.createElement('p', { className: 'lm2-note lm2-' + st.t }, st.m) : null,
              React.createElement('div', { className: 'lm2-actions' },
                data.dir ? React.createElement('button', { className: 'lm2-btnd', onClick: function() { sDirEdit(false); sDirDraft(''); sSt(null) } }, '取消') : null,
                React.createElement('button', { className: 'lm2-btn', disabled: !dirDraft.trim() || scanning, onClick: commitDir }, scanning ? '扫描中…' : data.dir ? '更新并扫描' : '开始使用'),
              ),
            ),
          ),
        )
      }

      var visible = data.models.filter(function(m) {
        if (!q.trim()) return true
        var n = q.trim().toLowerCase()
        return m.shortName.toLowerCase().indexOf(n) >= 0 || m.path.toLowerCase().indexOf(n) >= 0
      })
      var totalBytes = 0
      data.models.forEach(function(m) { if (m.size > 0) totalBytes += m.size })

      function patchModel(i, patch) {
        persist(Object.assign({}, data, { models: data.models.map(function(x, j) { return j === i ? Object.assign({}, x, patch) : x }) }))
      }
      function patchSpec(i, patch) {
        persist(Object.assign({}, data, { models: data.models.map(function(x, j) { return j === i ? Object.assign({}, x, { spec: Object.assign({}, x.spec, patch) }) : x }) }))
      }
      function starStyle(on) {
        return { boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', border: 'none', borderRadius: '6px', background: 'transparent', color: on ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-tertiary)', cursor: 'pointer', fontSize: '14px', flex: 'none', padding: 0 }
      }
      function draftPicker(m, i, dinfo) {
        if (dinfo.loading) return React.createElement('span', { className: 'lm2-lbl' }, '扫描文件夹中…')
        if (dinfo.items.length > 0) {
          return React.createElement('select', {
            className: 'lm2-select lm2-sel lm2-draft', value: m.spec.draftPath || '',
            autoFocus: true, title: '从模型所在文件夹选择草稿模型（已排除视觉模型），选中后自动收起',
            onChange: function(e) { patchSpec(i, { draftPath: e.target.value }); sDraftOpen(null) },
          },
            React.createElement('option', { value: '' }, '自动（同目录找 *mtp*.gguf）'),
            dinfo.items.map(function(f) { return React.createElement('option', { key: f.path, value: f.path }, f.name + ' · ' + fmtSize(f.size)) }),
          )
        }
        if ((dinfo.skipped || 0) > 0) return React.createElement('span', { className: 'lm2-lbl' }, '文件夹里只有视觉/投影模型（已隐藏 ' + dinfo.skipped + ' 个）——留空自动匹配或手动输入路径')
        return React.createElement('input', { className: 'lm2-input', style: { flex: 1 }, value: m.spec.draftPath, placeholder: '文件夹里没有其他语言模型文件——手动输入路径，回车收起', onChange: function(e) { patchSpec(i, { draftPath: e.target.value }) }, onKeyDown: function(e) { if (e.key === 'Enter') sDraftOpen(null) } })
      }
      var rows = visible.map(function(m) {
        var i = data.models.indexOf(m)
        var isPrimary = data.primary === m.path
        var isRunning = run.running && run.model === m.path
        var dinfo = drafts[m.path] || { loading: false, items: [] }
        return React.createElement('li', { key: m.path, style: { display: 'flex', flexDirection: 'column' } },
          React.createElement('div', { className: 'lm2-row' },
            React.createElement('button', { style: starStyle(isPrimary), title: isPrimary ? '主模型（启动优先）' : '设为主模型', onClick: function() { patchFields({ primary: isPrimary ? '' : m.path }) } }, isPrimary ? '★' : '☆'),
            React.createElement('input', { className: 'lm2-name', value: m.shortName, title: m.path, onChange: function(e) { patchModel(i, { shortName: e.target.value }) } }),
            React.createElement('span', { className: 'lm2-tag' + (isRunning ? ' lm2-tagp' : '') }, isRunning ? '运行中' : fmtSize(m.size)),
            React.createElement('select', { className: 'lm2-select lm2-sel lm2-ctx', value: String(m.contextSize || 0), title: '上下文（自动=按显存优化到最高速度；改上下文立即重新优化）', onChange: function(e) { changeCtx(i, e.target.value) } },
              CTX_OPTS.map(function(o) { return React.createElement('option', { key: o[0], value: String(o[0]) }, o[1]) })),
            React.createElement('button', { key: 'none', className: 'lm2-pill' + (m.spec.mode === 'none' ? ' on' : ''), title: '关闭投机解码', onClick: function() { patchSpec(i, { mode: 'none' }); sDraftOpen(null) } }, '无'),
            React.createElement('button', { key: 'mtp', className: 'lm2-pill' + (m.spec.mode === 'mtp' ? ' on' : ''), title: 'MTP 自推测（模型内置头）', onClick: function() { patchSpec(i, { mode: 'mtp' }); sDraftOpen(null) } }, 'MTP'),
            React.createElement('button', { key: 'draft', className: 'lm2-pill' + (m.spec.mode === 'draft' ? ' on' : ''), title: '选择外部草稿模型（点击展开下拉，选中后收起）', onClick: function() { if (draftOpen === m.path) { sDraftOpen(null) } else { patchSpec(i, { mode: 'draft' }); sDraftOpen(m.path); fetchDrafts(m.path) } } }, 'MTP模型'),
            m.spec.mode !== 'none' ? React.createElement('input', { className: 'lm2-input lm2-num', type: 'number', min: 1, max: 8, title: '每次推测数量', value: String(m.spec.count), onChange: function(e) { patchSpec(i, { count: Math.min(8, Math.max(1, Number(e.target.value) || 2)) }) } }) : null,
            React.createElement('button', { className: 'lm2-btn', disabled: launching === m.path, title: run.running && !isRunning ? '点击立即热切换到该模型' : '立即启动', onClick: function() { launchNow(m.path) } }, launching === m.path ? '…' : '▶'),
            React.createElement('button', { className: 'lm2-x', title: '移除', onClick: function() { removeAt(i) } }, '✕'),
          ),
          m.spec.mode === 'draft' && draftOpen === m.path ? React.createElement('div', { className: 'lm2-subrow' },
            React.createElement('span', { className: 'lm2-lbl' }, '草稿'),
            draftPicker(m, i, dinfo),
            (dinfo.skipped || 0) > 0 && dinfo.items.length > 0 ? React.createElement('span', { className: 'lm2-tag', title: '视觉/投影模型不能当草稿，已隐藏' }, '已隐藏 ' + dinfo.skipped) : null,
            React.createElement('button', { className: 'lm2-btnd', title: '重新扫描该模型所在文件夹', onClick: function() { fetchDrafts(m.path) } }, '⟳'),
          ) : null,
        )
      })

      return React.createElement('div', { className: 'lm2' },
        React.createElement('div', { className: 'lm2-setup' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('span', { style: { flex: 1, fontSize: '13px', fontWeight: 500 } }, '后端与启动（TurboQuant · llama-server）'),
            run.running
              ? React.createElement('button', { className: 'lm2-btnd', onClick: function() { host.call('local-models.stop').then(refreshRun).catch(function() {}) } }, '■ 卸载')
              : React.createElement('button', { className: 'lm2-btn', disabled: data.models.length === 0 || launching !== '', onClick: function() { launchNow(null) } }, '▶ 启动主模型'),
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('input', { className: 'lm2-input', style: { flex: 1 }, value: data.backend, placeholder: '后端目录（含 llama-server.exe）', onChange: function(e) { patchFields({ backend: e.target.value }) } }),
            React.createElement('input', { className: 'lm2-input lm2-port', type: 'number', value: String(data.port || 8080), title: '端口', onChange: function(e) { patchFields({ port: Number(e.target.value) || 8080 }) } }),
            React.createElement('button', { className: 'lm2-btnd', disabled: !data.backend.trim(), title: '检测 GPU 与内存', onClick: function() { host.call('local-models.gpu', { backend: data.backend }).then(function(r) { sSt(r.ok ? { t: 'ok', m: 'GPU 共 ' + r.totalMB + 'MB / 空闲 ' + r.freeMB + 'MB · 内存空闲 ' + (r.ramFreeMB || 0) + 'MB' } : { t: 'err', m: r.error }) }).catch(function(e) { sSt({ t: 'err', m: String(e) }) }) } }, '🎮'),
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
            React.createElement('span', { className: 'lm2-lbl', title: '优化器把这部分显存视为不可用——上下文会相应缩短、KV 档位可能降级，给桌面/游戏留余量' }, '保留显存'),
            React.createElement('input', { className: 'lm2-input lm2-res', type: 'number', min: 0, step: '0.5', value: String(num(data.reserveVRAMGB, 0)), onChange: function(e) { patchFields({ reserveVRAMGB: Math.min(64, num(e.target.value, 0)) }) } }),
            React.createElement('span', { className: 'lm2-lbl' }, 'GB'),
            React.createElement('span', { className: 'lm2-lbl', title: '启动前检查：放不进显存的部分要落系统内存，若低于该预留量将拒绝启动并提示' }, '保留内存'),
            React.createElement('input', { className: 'lm2-input lm2-res', type: 'number', min: 0, step: '0.5', value: String(num(data.reserveRAMGB, 0)), onChange: function(e) { patchFields({ reserveRAMGB: Math.min(64, num(e.target.value, 0)) }) } }),
            React.createElement('span', { className: 'lm2-lbl' }, 'GB'),
          ),
          React.createElement(StatusPill, null),
        ),
        React.createElement('div', { className: 'lm2-toolbar' },
          React.createElement('input', { className: 'lm2-input lm2-search', value: q, placeholder: '搜索…', onChange: function(e) { sQ(e.target.value) } }),
          React.createElement('span', { className: 'lm2-spacer' }),
          React.createElement('button', { className: 'lm2-btnd', disabled: scanning, onClick: function() { doScan() } }, scanning ? '扫描中…' : '⟳ 扫描'),
          React.createElement('button', { className: 'lm2-btnd', onClick: function() { sDirDraft(data.dir); sDirEdit(true); sSt(null) } }, '目录'),
          React.createElement('button', { className: 'lm2-btn', onClick: function() { sAddOpen(true) } }, '＋ 文件'),
        ),
        React.createElement('p', { className: 'lm2-dirline' }, '📁 ' + data.dir + ' · ' + data.models.length + ' 个 · ' + (totalBytes > 0 ? (totalBytes / 1073741824).toFixed(1) + ' GB · ' : '') + '已同步至输入框选择器「本地模型」'),
        st ? React.createElement('p', { className: 'lm2-note lm2-' + st.t }, st.m) : null,
        data.models.length === 0
          ? React.createElement('div', { className: 'lm2-empty' }, '没有大于 1.2GB 的模型文件——换目录扫描或手动添加文件。')
          : visible.length === 0
            ? React.createElement('div', { className: 'lm2-empty' }, '没有匹配的模型。')
            : React.createElement('ul', { className: 'lm2-cards' }, rows),
        addOpen ? React.createElement(Modal, {
          title: '添加单个模型文件', route: '不受 1.2GB 过滤限制',
          onClose: function() { sAddOpen(false) }, confirmDisabled: !addP.trim(),
          onConfirm: function() { if (addByPath(addP.trim())) sAddOpen(false) },
        },
          React.createElement('input', { className: 'lm2-input', value: addP, placeholder: 'G:\\modes\\xxx.gguf', autoFocus: true, onChange: function(e) { sAddP(e.target.value) }, onKeyDown: function(e) { if (e.key === 'Enter' && addP.trim() && addByPath(addP.trim())) sAddOpen(false) } }),
        ) : null,
      )
    }

    slots.inject('settings.section', function() {
      return slots.register(
        { name: 'settings.section', id: 'local-models', order: 11, label: '本地模型' },
        function(props) { return React.createElement(LocalModelsPage, { close: props.close }) },
      )
    })
    slots.inject('conversation.composer.dock', function() {
      return slots.register(
        { name: 'conversation.composer.dock', id: 'local-turbo-status', order: 90, label: '本地模型状态' },
        function() { return React.createElement(StatusPill, null) },
      )
    })
  },
}
