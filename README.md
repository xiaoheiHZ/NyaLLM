# NyaLLM 官方网站与发布页

**白纸浅粉，纯原生安卓多窗 AI 工作台** — Android 8.0+，零 WebView，最新版 **v1.0.2**（7.87 MB APK）。

- 🌐 **在线官网**：[https://xiaoheihz.github.io/NyaLLM/](https://xiaoheihz.github.io/NyaLLM/)
- 📦 **APK 下载**：[GitHub Releases v1.0.2](https://github.com/xiaoheiHZ/NyaLLM/releases/tag/v1.0.2) · [直接下载 NyaLLM-1.0.2.apk](https://github.com/xiaoheiHZ/NyaLLM/releases/download/v1.0.2/NyaLLM-1.0.2.apk)
- ⚡ **爱发电支持作者**：[https://ifdian.net/a/NyaLLM](https://ifdian.net/a/NyaLLM)（小黑子打篮球hz · 正在创作 NyaLLM 客户端）

## NyaLLM 1.0.2 核心亮点

- **本地 Linux 容器（完整 RootFS + `exec` 权限）**：支持 Alpine 3.21 / Ubuntu 24.04.5 / Debian 12 / Arch ARM、多架构（`aarch64` / `x86_64` / `armv7l`）与可选桌面环境（CLI / XFCE4 / LXQt / Openbox + VNC/noVNC），完整还原 POSIX 符号链接与可执行位。
- **工作极简模式与按需加载工具**：首轮仅发送命令行（`nya_linux_exec`）与按需加载器（`nya_load_tools`），任务中途按需挂载隐私浏览器、搜索、图表与文件工具，大幅节省输入 Token。
- **内置隐私 Agent 浏览器**：嵌于 `MainActivity` 视图层，系统最近任务无痕；支持桌面/移动 UA 切换、`nya_browser` DOM 自动化桥接与右下角不挡字紧凑恢复胶囊 `[ ▢ 浏览器 × ]`。
- **7 档思考强度与统一每步时间线**：支持自动 / 低 / 中 / 高 / 极高 / Max / Ultra（Ultra 挂载独立子 Agent）、粉白双色滑块与动态指针、简洁/完整双预览时间线、单行上下文占用统计及无上限工具步数。
- **对话内交互图表、对话项目与用量热力图**：原生折线/柱状/面积/饼图/数据表切换、侧栏项目与 5 套双模提示词、AI 记忆摘要、每日/每月/每年 Token 热力图及 DeepSeek / Kimi / OpenRouter 实时余额查询。
- **高对比度 `NyaStyle` 1.0 与全屏轻高斯模糊**：Android 12+ 顶/底 6.5–7.5dp 渐进轻高斯模糊、逐字模糊聚焦流式、四套官方主题配色预设与手势防冲突精修。

## SHA-256 校验（v1.0.2）

```text
58896bea41ea8e1cb8c9b5fdab0ffdca917bef33f60b896af7cb4a63177df013  NyaLLM-1.0.2.apk
```
