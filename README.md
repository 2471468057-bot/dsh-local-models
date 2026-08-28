# dsh-local-models

DeepSeek Harness **常驻宿主 bundle**：本地 GGUF 模型（llama-server / TurboQuant）LLM 适配器 + 设置页/状态胶囊 UI。

- 发送消息自动拉起本地模型，按显存自动优化启动参数（KV 缓存 `turbo4+turbo3`、上下文预算、MoE `--n-cpu-moe` 精确外溢、`batch 2048/512`）
- **四场景随机可爱加载提示**：首次唤醒 / 空闲自动卸载后重唤醒 / 切换模型 / 就绪收尾
- 5 分钟空闲自动卸载；支持 MTP 自推测 / 外部草稿模型
- **静态设置页 + 状态胶囊**（设置 → 本地模型；输入框下沿胶囊显示 N 分钟后自动卸载、启动/卸载/热切换、扫描目录、MTP/草稿、保留显存/内存）
- 宿主+客户端静态插件：随 profile 开机自启，**无需每次定义/批准**，重启即常驻

## 安装（bundle 方式）

本仓库是一个标准 dsh bundle（`dsh.bundle.patch` + 自包含 `lib/index.js`，无运行时依赖）。

```sh
# 在 dsh 环境里（profile 目录）：
dsh plugin --profile <名> add dsh-local-models
# 或直接 pnpm add（git 地址）：
pnpm add github:2471468057-bot/dsh-local-models
```

然后确认该 profile 的 `dsh.profile.bundles` 包含 `dsh-local-models`（`dsh plugin` 会自动 reconcile），**重启生效**。

手工安装：

1. 把本包放到 `$DSH_HOME/profiles/node_modules/dsh-local-models/`（或链接）；
2. 在对应 profile 的补丁层（`$DSH_HOME/profiles/<名>/cordis.patch.yml`）加入：

```yaml
- insert:
    - id: local-models
      name: 'dsh-local-models'
```

3. 重启 web/对应 profile。

## 配置

插件读取 `$DSH_HOME/local-models.json`（重启不丢；修改后重启或下次调用生效）：

```json
{
  "dir": "G:\\modes",
  "primary": "",
  "backend": "G:\\modes\\turboquant-plus-tqp-v0.3.0-windows-x64-cuda12.4",
  "port": 8080,
  "reserveVRAMGB": 2,
  "reserveRAMGB": 8,
  "models": [
    {
      "path": "G:\\modes\\qwen\\xxx.gguf",
      "shortName": "模型名",
      "size": 17329854848,
      "contextSize": 65536,
      "spec": { "mode": "draft", "count": 3, "draftPath": "" }
    }
  ]
}
```

`reserveVRAMGB` / `reserveRAMGB` 为优化器视为不可用的预留量。

## 构建

```sh
node build.mjs   # esbuild → lib/index.js（自带 prepare 脚本）
```

## 说明

- 提示文案：`喵～ 正在唤醒「xx」，马上就来~` / `正在热切换：从「旧」换到「新」~` / `刚才空闲被自动卸载啦，正在重新唤醒「xx」…` / `好了！我马上接着回答你~` 等，每场景 3 款随机。
- 本包为纯宿主 adapter bundle，不含客户端 UI（设置页/状态胶囊需另行处理，见上）。本仓库只维护静态宿主版本。