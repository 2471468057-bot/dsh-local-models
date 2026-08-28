# dsh web 无法启动/加载 —— 修复记录（优化版）

- 日期：2026-08-28　|　仓库：`D:\Desktop\deepseek-harness`　|　现象：`pnpm dsh web` 启动后浏览器报 **"Failed to load plugins"**，构建无法重建产物。

## 一、构建链（让 `pnpm run build` 全绿）

| # | 项 | 位置 | 修复 |
|---|---|---|---|
| 1 | BOM 剥离 | `packages/boot/app-boot/src/profile.ts` | manifest 读取时剥离 UTF-8 BOM（`\uFEFF`，Windows 编辑器写入所致）；新增测试覆盖（15/15 通过） |
| 2 | memory 插件冲突 | `.dsh/profiles/web/package.json`（用户数据） | 移除 `dsh-hermes-memory`（与 `meow-memory` 重复注册 `memory_search`） |
| 3 | 测试命名 | `packages/client/ui-attachment/tests/import-intake.spec.ts` | 重命名为 `import-intake.client.spec.ts`（`packages/client` 测试须带 `.client.` 归属 Client 聚合），消除 host tsc 级联 TS6307/TS6142/TS7006 |
| 4 | Fake API 补全 | `connection/tests/fake-api.client.ts` + `runtime/tests/fake-api.client.ts` | `IApiClient` 新增 `localModels` 域后，两个 `FakeApiClient` 补齐 9 方法（返回 `ok({})`），解 TS2345×14 / TS2420 |
| 5 | tsdown 排除 | `tsdown.config.ts` | workspace 改 `{ include, exclude: ['**/meow-memory/**','**/dsh-local-models/**'] }`，跳过 esbuild 自构建本地 bundle（无 `lib/types/*.js` 入口） |
| 6 | 全量重建 | — | `pnpm run build` 通过：3.19s、205 client artifacts、`.dsh-build/client-build-environment.json` 更新、`apps/web/dist` 全新构建 |

## 二、运行时（插件加载 + UI 渲染）

- **7. bundle 注册名** · `packages/extensions/dsh-local-models/build.mjs` — `__ModuleLoader__.load` 的 `id` 必须等于**完整包名 `@deepseek-ai/dsh-local-models`**（加载器按 bundle URL 推导期望；短名不匹配。meow-memory 包名无 scope 恰好不受影响）。
- **8. 计时器清理** · `src/client.ts` — `useEffect` 清理里 `stop()` → `clearInterval(stop)`（`setInterval` 返回的是 interval id，不是函数）。
- **9. 内嵌胶囊 props** · `src/client.ts` — 设置页内 `React.createElement(StatusPill, { call: call })`（原传 `null`，导致 esbuild 重命名后 `props.call` 为 undefined → `call2 is not a function`）。

## 三、验证（http://127.0.0.1:3080/ 运行中）

- ✅ "Failed to load plugins" 彻底消失；首页/侧边栏/新建会话/工作区选择/模型选择（glm-5.3-flash）/创造模式按钮正常。
- ✅ 设置 → 本地模型 完整渲染：5 个模型卡片（Qwen3.6-35B、gemma-4-26B、Qwen3.8-9B、MiniCPM5-1B、LFM2.5-2.6B）、后端/端口/显存与内存预留、上下文档位（自动~256K）、MTP 草稿、扫描/添加文件，全部正常、无 console 报错。
- ✅ 服务器 HTTP 200、进程稳定。

## 涉及文件

- **核心修复**：`packages/boot/app-boot/src/profile.ts`（+tests/profile.spec.ts）、`packages/extensions/dsh-local-models/{build.mjs, src/client.ts}`
- **契约/测试**：`connection/tests/fake-api.client.ts`、`runtime/tests/fake-api.client.ts`、`ui-attachment/tests/import-intake.client.spec.ts`（重命名）、`tsdown.config.ts`
- **用户数据（未跟踪）**：`.dsh/profiles/web/package.json`

## 可选进一步加固（建议）

- `StatusPill` 顶部加兜底：`const call = props.call; if (typeof call !== 'function') return null` —— 防止将来漏传 `call` prop 再崩（当前已显式传，作为防御）。
- `build.mjs` 的 `id` 因仓库包（scoped `@deepseek-ai/dsh-local-models`）与 bundle（无 scope `dsh-local-models`）包名不同，**各自硬编码是对的**，不要强行统一（统一会导致其中一个不匹配加载器推导）。
- 若担心 BOM 在其它读取路径重现，可抽一个 `readTextBomless()` 小工具复用（当前定向修复已足够）。