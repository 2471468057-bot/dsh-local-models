# dsh-local-models（本地模型 · llama-server/TurboQuant 插件）

DeepSeek Harness 的动态 Cordis 插件：在聊天里直接调用本地 GGUF 模型（llama-server / TurboQuant），自动按显存优化启动参数，带**多场景随机可爱加载提示**与完整设置页、状态胶囊。

## 功能

- **发送消息自动拉起本地模型**，按场景给出提示：首次唤醒 / 空闲自动卸载后重唤醒 / 切换模型 / 就绪收尾，每类 3 款可爱文案随机挑选，不单调
- **按显存自动优化**启动参数：KV 缓存 `turbo4+turbo3`（压缩加速）、上下文自动计算（MoE 模型：dense+激活专家+KV 预算推导，含 `--n-cpu-moe` 精确外溢百分比）、`batch 2048/512`
- **5 分钟空闲自动卸载**（GC 定时器）；状态胶囊实时显示「N 分钟后自动卸载」倒计时；卸载后下次唤醒会说明「刚被自动卸载」
- 支持 **MTP 自推测 / 外部草稿模型**（同目录自动找 `*mtp*.gguf`，自动排除视觉/投影模型）
- 设置页：目录递归扫描（>1.2GB 主模型）、后端目录/端口、主模型★、每模型上下文、投机解码模式、保留显存/内存预留
- 配置数据存 credentials：`LOCAL_MODELS_DATA`（DSH 重启不丢）

## 安装

1. 准备含 `llama-server.exe` 的后端目录（如 TurboQuant）与 GGUF 模型文件（建议 ≥1.2GB）。
2. 在 DSH Web 会话里用 `cordis_define` 定义插件：
   - `plugin`：`{"kind":"new","idPrefix":"lmcm"}`
   - `code.host` ← 本仓库 [`src/host.js`](src/host.js) 内容
   - `code.client` ← 本仓库 [`src/client.js`](src/client.js) 内容
3. `cordis_run` 激活（首次需在 GUI 批准）。
4. 打开 **设置 → 本地模型**：填模型目录 → 扫描 → 设主模型（可选改后端、端口、上下文、MTP/草稿）。

聊天输入框模型选择器会出现「本地模型」分组；发送消息时后台自动拉起服务。

## 提示文案示例

| 场景 | 示例 |
|---|---|
| 唤醒 | 喵～ 正在唤醒「xx」，马上就来~ ／ 呜～ 正在把「xx」叫醒，等一下下~ |
| 重唤醒（闲置卸载后） | 刚才空闲被自动卸载啦，正在重新唤醒「xx」… ／ 模型闲置被卸载了，我这就把它叫回来~ |
| 切换模型 | 正在热切换：从「旧」换到「新」~ ／ 换模型啦～ 正在拉起「新」，稍等~ |
| 就绪 | 好了！我马上接着回答你~ ／ 就绪啦，继续回答咯~ |

## 说明与注意

- 动态插件定义存于内存：**DSH 重启后需重新 `cordis_define` + `cordis_run`**（凭据 `LOCAL_MODELS_DATA` 在盘上，不丢；重启后插件 ID 会重新分配如 lmcm-1 → lmcm-2）。
- **host-only 定义会丢掉设置页/状态胶囊**（Cordis 整包切换语义），修改 host 时务必保留 client。
- 若 `cordis_define` 反复报 `"plugin" must match exactly one oneOf branch (matched 0)`：这是上游模型把 `plugin` 裸对象参数双编码成了 JSON 字符串。给 `packages/extensions/tool-cordis/src/index.ts` 加一句防御（plugin schema 增加 `{type:'string'}` 分支，`execute()` 里 `JSON.parse` 还原）并重启后即可修复。
- LlmAdapter 注意：普通对象适配器必须自带 `prepareCall(provider, model, signal)` → `{model, stream}`；`finish` 块 reason 须为 `{kind:'stop'}` 对象。
- 12GB 显存环境下 Qwen3 35B 约 30 tok/s，65k 上下文与高速不可兼得，属正常权衡。