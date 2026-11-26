/* ==========================================================================
   NyaLLM 1.0.2 Official Website — Interactive 1.0.2 Workbench & Micro-Motion
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------------------
     1. Toast & Clipboard Helpers
     ------------------------------------------------------------------------ */
  const toastEl = $("#toast");
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2400);
  }

  async function copyText(text, label) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast(label || `已复制：${text}`);
    } catch {
      showToast("复制失败，请手动选中复制");
    }
  }

  $$("[data-copy-text]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.copyText || "";
      copyText(val, val.startsWith("http") ? "已复制爱发电链接 ⚡" : "已复制 SHA-256 校验值");
    });
  });

  $$("[data-copy-hex]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hex = btn.dataset.copyHex || "";
      copyText(hex, `已复制色值 ${hex}`);
    });
  });

  /* ------------------------------------------------------------------------
     2. Theme Toggle & 1.0.2 Live Official Color Presets
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const metaTheme = $('meta[name="theme-color"]');

  const presetChips = $$("[data-set-preset]");
  const PRESET_LABELS = {
    nya: "NyaLLM · 白纸浅粉",
    chatgpt: "ChatGPT · 清雅翡翠",
    gemini: "Gemini · 晴蓝星紫",
    claude: "Claude · 暖羊皮纸"
  };

  function syncMetaTheme() {
    if (!metaTheme) return;
    const isDark = htmlEl.getAttribute("data-theme") === "dark";
    const isClaude = htmlEl.getAttribute("data-preset") === "claude";
    metaTheme.setAttribute("content", isDark ? "#0D0F14" : isClaude ? "#F8F3E8" : "#FFFFFF");
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", next);
    try { localStorage.setItem("nyallm-site-theme", next); } catch {}
    syncMetaTheme();
  }

  function applyPreset(preset, announce = false) {
    const key = PRESET_LABELS[preset] ? preset : "nya";
    htmlEl.setAttribute("data-preset", key);
    presetChips.forEach((b) => b.classList.toggle("is-active", b.dataset.setPreset === key));
    try { localStorage.setItem("nyallm-site-preset", key); } catch {}
    syncMetaTheme();
    if (announce) showToast(`已切换 1.0.2 配色：${PRESET_LABELS[key]}`);
  }

  try {
    const savedTheme = localStorage.getItem("nyallm-site-theme");
    if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);
    const savedPreset = localStorage.getItem("nyallm-site-preset");
    if (savedPreset && PRESET_LABELS[savedPreset]) applyPreset(savedPreset, false);
  } catch {}

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = (htmlEl.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark";
      applyTheme(next);
      showToast(next === "dark" ? "已切换至 NyaStyle 深色模式" : "已切换至 NyaStyle 浅色模式");
    });
  }

  presetChips.forEach((chip) => {
    chip.addEventListener("click", () => applyPreset(chip.dataset.setPreset, true));
  });

  /* ------------------------------------------------------------------------
     3. Mobile Navigation & Mascot Boop
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = $("#mobile-menu-btn");
  const mobileNav = $("#mobile-nav");
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const open = !mobileNav.hidden;
      mobileNav.hidden = open;
      mobileMenuBtn.setAttribute("aria-expanded", String(!open));
    });
    $$("a", mobileNav).forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const boopBtn = $("#mascot-boop");
  const boopBubble = $("#boop-bubble");
  const boopLines = [
    "(=ↀωↀ=) 喵！欢迎来到 NyaLLM 1.0.2",
    "Alpine 3.21 RootFS 与 exec 权限已就绪 ✦",
    "工作极简模式按需加载工具，超省 Token！",
    "喜欢的话欢迎去爱发电给作者充点电 ⚡"
  ];
  let boopIdx = 0;
  let boopTimer = null;

  if (boopBtn && boopBubble) {
    boopBtn.addEventListener("click", () => {
      boopBubble.textContent = boopLines[boopIdx % boopLines.length];
      boopIdx += 1;
      boopBubble.classList.add("is-visible");
      clearTimeout(boopTimer);
      boopTimer = setTimeout(() => boopBubble.classList.remove("is-visible"), 2600);
    });
  }

  /* ------------------------------------------------------------------------
     4. 7-Level Effort Slider + Dynamic Rotating Gauge Pointer (Synced!)
     ------------------------------------------------------------------------ */
  const EFFORT_LEVELS = [
    { name: "自动", route: "按任务自动路由", desc: "由模型按问题复杂度自动决定推理深度。" },
    { name: "低", route: "轻量快速响应", desc: "极速首帧直出，适合日常问答与简短命令。" },
    { name: "中", route: "均衡模式", desc: "兼顾速度与步骤严谨性，日常工作推荐。" },
    { name: "高", route: "深度推理 · 高对比度时间线", desc: "展开多步深度思考，适合代码排查与 Linux 容器脚本。" },
    { name: "极高", route: "多轮深度推理", desc: "大幅拉高思考预算，复杂架构与长文档分析首选。" },
    { name: "Max", route: "单模型最高推理档", desc: "路由至服务商最高思考预算（DeepSeek max / Gemini 24k）。" },
    { name: "Ultra", route: "Ultra + 独立子 Agent 交叉核验", desc: "开启最高推理档并挂载 nya_subagent 独立交叉核验关键结论。" }
  ];

  const phoneRange = $("#phone-effort-range");
  const bentoRange = $("#bento-effort-range");
  const overlayEffortName = $("#overlay-effort-name");
  const overlayEffortDesc = $("#overlay-effort-desc");
  const bentoEffortLabel = $("#bento-effort-label");
  const bentoEffortRoute = $("#bento-effort-route");
  const gaugeNeedle = $("#demo-gauge-needle");

  function setEffortLevel(idx, announce = false) {
    const levelIdx = Math.max(0, Math.min(6, Number(idx) || 0));
    const info = EFFORT_LEVELS[levelIdx];
    const pct = `${(levelIdx / 6) * 100}%`;
    const angle = -68 + (levelIdx / 6) * 136;

    [phoneRange, bentoRange].forEach((r) => {
      if (!r) return;
      r.value = String(levelIdx);
      r.style.setProperty("--pct", pct);
    });
    if (overlayEffortName) overlayEffortName.textContent = info.name;
    if (overlayEffortDesc) overlayEffortDesc.textContent = info.desc;
    if (bentoEffortLabel) bentoEffortLabel.textContent = info.name;
    if (bentoEffortRoute) bentoEffortRoute.textContent = info.route;
    if (gaugeNeedle) gaugeNeedle.style.transform = `rotate(${angle}deg)`;
    if (announce) showToast(`思考强度：${info.name}（${info.route}）`);
  }

  setEffortLevel(3, false);
  if (phoneRange) phoneRange.addEventListener("input", (e) => setEffortLevel(e.target.value, false));
  if (bentoRange) bentoRange.addEventListener("input", (e) => setEffortLevel(e.target.value, false));

  /* ------------------------------------------------------------------------
     5. Hero Interactive NyaLLM 1.0.2 Workbench
     ------------------------------------------------------------------------ */
  const demoClock = $("#demo-clock");
  const welcomeGreetingEl = $("#welcome-greeting");

  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const hh = String(h).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    if (demoClock) demoClock.textContent = `${hh}:${mm}`;
    let greet = "你好";
    if (h < 5 || h >= 23) greet = "夜深了";
    else if (h < 11) greet = "早上好";
    else if (h < 14) greet = "中午好";
    else if (h < 18) greet = "下午好";
    else greet = "晚上好";
    if (welcomeGreetingEl) welcomeGreetingEl.textContent = greet;
  }
  updateClock();
  setInterval(updateClock, 30000);

  const sceneHome = $("#scene-home");
  const sceneChat = $("#scene-chat");
  const modeSeg = $("#demo-mode-seg");
  const lockedTitle = $("#demo-locked-title");
  const topRightHome = $("#topbar-right-home");
  const topRightChat = $("#topbar-right-chat");
  const paneMessages = $("#pane-primary-messages");
  const demoInput = $("#demo-input");
  const demoSendBtn = $("#demo-send-btn");
  const browserPillWrap = $("#browser-pill-wrap");
  const browserOverlay = $("#browser-overlay");
  const effortOverlay = $("#effort-overlay");
  const plusPop = $("#popover-plus");
  const homeWorkPills = $("#home-work-pills");

  const sceneBtns = {
    work: $("#btn-scene-work"),
    home: $("#btn-scene-home"),
    chart: $("#btn-scene-chart")
  };

  let currentAppMode = "work";
  let minimalModeOn = true;
  let fullTimelinePreview = false;
  let streamTimer = null;

  function setTopbarForScene(isHome) {
    if (sceneHome) sceneHome.hidden = !isHome;
    if (sceneChat) sceneChat.hidden = isHome;
    if (modeSeg) modeSeg.hidden = !isHome;
    if (lockedTitle) {
      lockedTitle.hidden = isHome;
      lockedTitle.textContent = currentAppMode === "work" ? "工作" : "聊天";
    }
    if (topRightHome) topRightHome.hidden = !isHome;
    if (topRightChat) topRightChat.hidden = isHome;
    if (browserPillWrap) browserPillWrap.hidden = isHome;
  }

  function highlightStageBtn(key) {
    Object.entries(sceneBtns).forEach(([k, btn]) => {
      if (btn) btn.classList.toggle("is-active", k === key);
    });
  }

  function renderWorkTimelineScene() {
    clearInterval(streamTimer);
    currentAppMode = "work";
    setTopbarForScene(false);
    highlightStageBtn("work");
    if (!paneMessages) return;

    paneMessages.innerHTML = "";

    const userMsg = document.createElement("div");
    userMsg.className = "msg-user";
    userMsg.textContent = "巡检 Alpine 3.21 RootFS 符号链接与 exec 权限。";
    paneMessages.appendChild(userMsg);

    const wrap = document.createElement("div");
    wrap.className = "msg-ai-wrap";

    wrap.innerHTML = `
      <div class="ai-brand-row">
        <span class="ai-brand-left"><span class="brand-dot">D</span>DeepSeek R1</span>
      </div>
      <div class="timeline-head-row">
        <span>执行步骤 · 3</span>
        <button type="button" class="preview-mode-pill" id="toggle-timeline-mode">${fullTimelinePreview ? "简洁预览" : "完整预览"}</button>
      </div>
      <div class="step-list" id="demo-step-list">
        <div class="step-item">
          <button type="button" class="step-row-btn" data-step-toggle="0">
            <span class="step-row-left"><span>思考了 1.5 秒</span></span>
            <svg class="ic ic-xs"><use href="#g-right" /></svg>
          </button>
          <div class="step-detail-box" data-step-box="0" hidden>
            工作极简模式已开启：首轮仅携带 nya_linux_exec 与 nya_load_tools，直接用命令行检查 /bin/sh 符号链接与 busybox。
          </div>
        </div>
        <div class="step-item">
          <button type="button" class="step-row-btn" data-step-toggle="1">
            <span class="step-row-left">
              <svg class="ic ic-xs"><use href="#g-terminal" /></svg>
              <span>执行命令: busybox --help | head -1</span>
            </span>
            <span class="exit-badge">exit 0</span>
          </button>
          <div class="step-detail-box is-code" data-step-box="1" ${fullTimelinePreview ? "" : "hidden"}>
            BusyBox v1.37.0 (Alpine 3.21.3 aarch64)<br/>185 files/dirs · 335 symlinks restored · exec granted
          </div>
        </div>
        <div class="step-item">
          <button type="button" class="step-row-btn" data-step-toggle="2">
            <span class="step-row-left"><span>思考了 2.8 秒</span></span>
            <svg class="ic ic-xs"><use href="#g-down" /></svg>
          </button>
          <div class="step-detail-box" data-step-box="2">
            第二轮最新思考：BusyBox 与 apk 均正常返回 exit 0，无需触发多余联网检索，可直接汇总结果！
          </div>
        </div>
      </div>
      <div class="msg-ai-bubble">
        所有容器权限、符号链接和 <code>apk</code> 工具链已全部就绪（还原 185 项文件与 335 条 POSIX 符号链接，<code>targetSdkVersion 28</code> 已在 Android 15 正常开启 <code>exec</code>）。
      </div>
      <div class="ai-action-row">
        <button type="button" class="ai-act-btn" data-act-toast="已复制回复 ✓"><svg class="ic"><use href="#g-copy" /></svg></button>
        <button type="button" class="ai-act-btn" data-act-toast="原生 TTS 语音朗读中…"><svg class="ic"><use href="#g-volume" /></svg></button>
        <button type="button" class="ai-act-btn" data-act-toast="系统分享卡片已就绪"><svg class="ic"><use href="#g-share" /></svg></button>
        <button type="button" class="ai-act-btn" data-act-toast="支持分支新窗口 / 导出 Markdown"><svg class="ic"><use href="#g-dots" /></svg></button>
      </div>
      <div class="msg-metrics-102">输入 14404 · 输出 1211 · 上下文 11% (14.4k/128k) · 242.2 tok/s</div>
    `;

    paneMessages.appendChild(wrap);
    bindWorkTimelineEvents(wrap);
    paneMessages.scrollTop = 0;
  }

  function bindWorkTimelineEvents(root) {
    const modeBtn = $("#toggle-timeline-mode", root);
    if (modeBtn) {
      modeBtn.addEventListener("click", () => {
        fullTimelinePreview = !fullTimelinePreview;
        modeBtn.textContent = fullTimelinePreview ? "简洁预览" : "完整预览";
        $$("[data-step-box]", root).forEach((box, idx) => {
          box.hidden = !fullTimelinePreview && idx !== 2;
        });
        showToast(fullTimelinePreview ? "已切换为完整纵向时间线预览" : "已切换为简洁步骤预览");
      });
    }
    $$("[data-step-toggle]", root).forEach((btn) => {
      btn.addEventListener("click", () => {
        const box = $(`[data-step-box="${btn.dataset.stepToggle}"]`, root);
        if (box) box.hidden = !box.hidden;
      });
    });
    $$("[data-act-toast]", root).forEach((btn) => {
      btn.addEventListener("click", () => showToast(btn.dataset.actToast));
    });
  }

  function renderChartScene() {
    clearInterval(streamTimer);
    currentAppMode = "work";
    setTopbarForScene(false);
    highlightStageBtn("chart");
    if (!paneMessages) return;

    paneMessages.innerHTML = "";
    const userMsg = document.createElement("div");
    userMsg.className = "msg-user";
    userMsg.textContent = "用对话内交互图表对比一下极简模式开启前后的首轮输入 Token 开销。";
    paneMessages.appendChild(userMsg);

    const wrap = document.createElement("div");
    wrap.className = "msg-ai-wrap";
    wrap.innerHTML = `
      <div class="ai-brand-row">
        <span class="ai-brand-left"><span class="brand-dot">G</span>Google Gemini</span>
      </div>
      <div class="msg-ai-bubble">
        已通过 <code>nya_interactive_chart</code> 在气泡内生成原生交互图表，可实时切换视图或一键复制 CSV：
        <div class="inchat-chart" id="demo-inchat-chart">
          <div class="inchat-chart-head">
            <span class="inchat-chart-title">首轮工具 Schema Token 对比</span>
            <div class="chart-type-tabs">
              <button type="button" class="ct-btn is-active" data-ctype="bar">柱状</button>
              <button type="button" class="ct-btn" data-ctype="table">数据表</button>
            </div>
          </div>
          <div class="chart-bars-stage" id="chart-view-bar">
            <div class="cb-col"><span class="cb-val">4.8k</span><div class="cb-bar" style="height:86%"></div><span class="cb-lbl">全量工具</span></div>
            <div class="cb-col"><span class="cb-val">1.1k</span><div class="cb-bar" style="height:26%"></div><span class="cb-lbl">极简模式</span></div>
            <div class="cb-col"><span class="cb-val">1.7k</span><div class="cb-bar" style="height:38%"></div><span class="cb-lbl">按需+搜索</span></div>
            <div class="cb-col"><span class="cb-val">2.1k</span><div class="cb-bar" style="height:46%"></div><span class="cb-lbl">按需+图表</span></div>
          </div>
          <table class="chart-table" id="chart-view-table" hidden>
            <thead><tr><th>模式</th><th>首轮 Token</th><th>节省比例</th></tr></thead>
            <tbody>
              <tr><td>全量加载工具</td><td>4,820</td><td>基准</td></tr>
              <tr><td>1.0.2 极简模式</td><td>1,140</td><td>-76%</td></tr>
              <tr><td>按需挂载 + 图表</td><td>2,080</td><td>-57%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="msg-metrics-102">输入 1140 · 输出 386 · 上下文 1% (1.5k/128k) · 184.5 tok/s</div>
    `;
    paneMessages.appendChild(wrap);

    const barView = $("#chart-view-bar", wrap);
    const tblView = $("#chart-view-table", wrap);
    $$(".ct-btn", wrap).forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".ct-btn", wrap).forEach((x) => x.classList.toggle("is-active", x === btn));
        const isTbl = btn.dataset.ctype === "table";
        if (barView) barView.hidden = isTbl;
        if (tblView) tblView.hidden = !isTbl;
      });
    });
    paneMessages.scrollTop = paneMessages.scrollHeight;
  }

  function renderHomeScene() {
    clearInterval(streamTimer);
    setTopbarForScene(true);
    highlightStageBtn("home");
    updateClock();
  }

  function runStreamReply(promptText) {
    clearInterval(streamTimer);
    if (sceneHome && !sceneHome.hidden) {
      setTopbarForScene(false);
      highlightStageBtn("work");
      if (paneMessages && !paneMessages.children.length) renderWorkTimelineScene();
    }
    if (!paneMessages) return;

    const userEl = document.createElement("div");
    userEl.className = "msg-user";
    userEl.textContent = promptText;
    paneMessages.appendChild(userEl);

    const wrap = document.createElement("div");
    wrap.className = "msg-ai-wrap";
    const level = EFFORT_LEVELS[Number(phoneRange ? phoneRange.value : 3)];
    wrap.innerHTML = `
      <div class="ai-brand-row"><span class="ai-brand-left"><span class="brand-dot">N</span>NyaLLM · ${level.name}</span></div>
      <div class="timeline-head-row"><span>思考了 0.9 秒 · 工具按需模式</span></div>
      <div class="msg-ai-bubble"><span class="msg-ai-text"></span></div>
      <div class="msg-metrics-102">连接首帧…</div>
    `;
    paneMessages.appendChild(wrap);

    const textNode = $(".msg-ai-text", wrap);
    const metricsNode = $(".msg-metrics-102", wrap);
    const full = `收到！「${promptText.slice(0, 18)}${promptText.length > 18 ? "…" : ""}」已在 1.0.2 工作极简模式下开始流式输出（当前思考档位：${level.name}）。日常问候不会误触发联网检索；需要终端、隐私浏览器或交互图表时，模型会通过 nya_load_tools 按需挂载。`;
    let pos = 0;
    const t0 = performance.now();

    streamTimer = setInterval(() => {
      pos = Math.min(full.length, pos + 2);
      textNode.textContent = full.slice(0, pos);
      if (pos < full.length) {
        const cur = document.createElement("span");
        cur.className = "stream-cursor";
        textNode.appendChild(cur);
      }
      const sec = Math.max(0.15, (performance.now() - t0) / 1000);
      const outTok = Math.max(1, Math.round(pos * 0.72));
      const speed = (outTok / sec).toFixed(1);
      metricsNode.textContent = `输入 1180 · 输出 ${outTok} · 上下文 2% (2.4k/128k) · ${speed} tok/s`;
      paneMessages.scrollTop = paneMessages.scrollHeight;
      if (pos >= full.length) clearInterval(streamTimer);
    }, 32);
  }

  renderWorkTimelineScene();

  if (sceneBtns.work) sceneBtns.work.addEventListener("click", renderWorkTimelineScene);
  if (sceneBtns.home) sceneBtns.home.addEventListener("click", renderHomeScene);
  if (sceneBtns.chart) sceneBtns.chart.addEventListener("click", renderChartScene);

  /* Home Mode Segment ([ 聊天 | 工作 ]) */
  $$("[data-app-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentAppMode = btn.dataset.appMode;
      $$("[data-app-mode]").forEach((b) => b.classList.toggle("is-active", b === btn));
      if (homeWorkPills) homeWorkPills.hidden = currentAppMode !== "work";
      if (demoInput) {
        demoInput.placeholder = currentAppMode === "work" ? "输入工作任务（极简）…" : "给 NyaLLM 发消息…";
      }
      showToast(currentAppMode === "work" ? "已切换至工作模式（Linux 容器 + 极简省 Token）" : "已切换至纯粹聊天模式");
    });
  });

  const minimalToggle = $("#demo-minimal-toggle");
  const minimalText = $("#demo-minimal-text");
  if (minimalToggle && minimalText) {
    minimalToggle.addEventListener("click", () => {
      minimalModeOn = !minimalModeOn;
      minimalToggle.setAttribute("aria-pressed", String(minimalModeOn));
      minimalText.textContent = minimalModeOn
        ? "极简模式 · 仅命令行 + 按需加载省 Token"
        : "全量工具模式 · 首轮即挂载全部工具";
      showToast(minimalModeOn ? "工作极简模式已开启" : "已切换为全量工具模式");
    });
  }

  $$("[data-launch-scene]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = btn.dataset.launchScene;
      if (s === "work") renderWorkTimelineScene();
      else if (s === "chart") renderChartScene();
      else if (s === "browser") {
        renderWorkTimelineScene();
        if (browserOverlay) browserOverlay.hidden = false;
      } else {
        renderWorkTimelineScene();
        runStreamReply("在 Alpine 容器里跑一段巡检脚本并总结结果");
      }
    });
  });

  const newChatBtn = $("#demo-new-chat");
  if (newChatBtn) newChatBtn.addEventListener("click", renderHomeScene);

  const tempBtn = $("#demo-temp-btn");
  if (tempBtn) tempBtn.addEventListener("click", () => showToast("临时对话模式：不落盘、不进历史，自动屏蔽本机记忆"));

  const moreHomeBtn = $("#demo-more-home-btn");
  const moreChatBtn = $("#demo-more-chat-btn");
  [moreHomeBtn, moreChatBtn].forEach((b) => {
    if (b) b.addEventListener("click", () => showToast("支持单行历史预览、移入项目、双窗分屏与导出 Markdown"));
  });

  /* Composer, + Popover, Effort Overlay & Privacy Browser Overlay */
  if (demoSendBtn && demoInput) {
    const submit = () => {
      const val = demoInput.value.trim() || "帮我检查一下今天容器与 Token 占用情况";
      demoInput.value = "";
      if (plusPop) plusPop.hidden = true;
      runStreamReply(val);
    };
    demoSendBtn.addEventListener("click", submit);
    demoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });
  }

  const plusBtn = $("#demo-plus-btn");
  if (plusBtn && plusPop) {
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      plusPop.hidden = !plusPop.hidden;
    });
    $$("[data-plus-action]", plusPop).forEach((row) => {
      row.addEventListener("click", () => {
        const act = row.dataset.plusAction;
        plusPop.hidden = true;
        if (act === "browser" && browserOverlay) browserOverlay.hidden = false;
        else if (act === "chart") renderChartScene();
        else if (act === "minimal") showToast("极简模式：首轮仅暴露命令行 + nya_load_tools，省 76% 工具 Token");
        else showToast("按需联网搜索：日常问候与终端命令不再无故触发检索");
      });
    });
  }

  const effortOpenBtn = $("#btn-effort-open");
  const gaugeBtn = $("#demo-gauge-btn");
  const effortClose = $("#effort-overlay-close");
  [effortOpenBtn, gaugeBtn].forEach((b) => {
    if (b && effortOverlay) b.addEventListener("click", () => { effortOverlay.hidden = false; });
  });
  if (effortClose && effortOverlay) effortClose.addEventListener("click", () => { effortOverlay.hidden = true; });
  if (effortOverlay) {
    effortOverlay.addEventListener("click", (e) => { if (e.target === effortOverlay) effortOverlay.hidden = true; });
  }

  const browserOpenBtn = $("#demo-browser-open");
  const browserCloseBtn = $("#demo-browser-close");
  const pbHideBtn = $("#pb-hide-btn");
  const pbUaToggle = $("#pb-ua-toggle");
  if (browserOpenBtn && browserOverlay) {
    browserOpenBtn.addEventListener("click", () => { browserOverlay.hidden = false; });
  }
  if (browserCloseBtn && browserPillWrap) {
    browserCloseBtn.addEventListener("click", () => {
      browserPillWrap.hidden = true;
      showToast("已关闭浏览器恢复胶囊 · 可从左下角「+」重新打开");
    });
  }
  if (pbHideBtn && browserOverlay) {
    pbHideBtn.addEventListener("click", () => {
      browserOverlay.hidden = true;
      if (browserPillWrap) browserPillWrap.hidden = false;
      showToast("隐私浏览器已收起为右下角不挡字胶囊 [ ▢ 浏览器 × ]");
    });
  }
  if (browserOverlay) {
    browserOverlay.addEventListener("click", (e) => { if (e.target === browserOverlay) browserOverlay.hidden = true; });
  }
  if (pbUaToggle) {
    pbUaToggle.addEventListener("click", () => {
      const next = pbUaToggle.textContent === "桌面 UA" ? "移动 UA" : "桌面 UA";
      pbUaToggle.textContent = next;
      showToast(`隐私浏览器已切换至 ${next}`);
    });
  }

  /* Sidebar Drawer */
  const drawerBtn = $("#demo-drawer-btn");
  const drawerEl = $("#demo-drawer");
  const drawerClose = $("#demo-drawer-close");
  if (drawerBtn && drawerEl) {
    drawerBtn.addEventListener("click", () => { drawerEl.hidden = false; });
    if (drawerClose) drawerClose.addEventListener("click", () => { drawerEl.hidden = true; });
    drawerEl.addEventListener("click", (e) => { if (e.target === drawerEl) drawerEl.hidden = true; });
    $$("[data-drawer-scene]", drawerEl).forEach((row) => {
      row.addEventListener("click", () => {
        const sc = row.dataset.drawerScene;
        drawerEl.hidden = true;
        if (sc === "home") renderHomeScene();
        else if (sc === "chart") renderChartScene();
        else if (sc === "browser") { renderWorkTimelineScene(); if (browserOverlay) browserOverlay.hidden = false; }
        else renderWorkTimelineScene();
      });
    });
  }

  document.addEventListener("click", (e) => {
    if (plusPop && !plusPop.hidden && !e.target.closest("#popover-plus") && !e.target.closest("#demo-plus-btn")) {
      plusPop.hidden = true;
    }
  });

  /* ------------------------------------------------------------------------
     6. Bento Micro-Demos (MCP Confirm & Token Heatmap)
     ------------------------------------------------------------------------ */
  const mcpAllow = $("#mcp-allow-btn");
  const mcpDeny = $("#mcp-deny-btn");
  const mcpNote = $("#mcp-status-note");
  if (mcpAllow && mcpDeny && mcpNote) {
    mcpAllow.addEventListener("click", () => {
      mcpNote.textContent = "✓ 已在无痕浏览器中打开并回传 DOM";
      mcpNote.style.color = "var(--green)";
    });
    mcpDeny.addEventListener("click", () => {
      mcpNote.textContent = "✕ 已拒绝，未执行外部调用";
      mcpNote.style.color = "var(--danger)";
    });
  }

  const heatmapEl = $("#heatmap-preview");
  if (heatmapEl) {
    const pattern = [
      0,1,2,1,3,4,2,1,0,2,3,2,4,3,1,2,
      1,2,0,3,4,3,2,2,1,3,4,4,3,2,2,3,
      0,1,3,2,2,4,3,1,2,2,3,4,4,3,4,2
    ];
    heatmapEl.innerHTML = pattern
      .map((lv, i) => `<span class="hm-cell" data-lv="${lv}" title="第 ${i + 1} 日用量强度 ${lv}/4"></span>`)
      .join("");
  }

  /* ------------------------------------------------------------------------
     7. 8 Model Providers Interactive Matrix
     ------------------------------------------------------------------------ */
  const PROVIDERS = {
    openai: {
      badge: "官方矢量标 · 预算余量追踪",
      name: "OpenAI",
      model: "gpt-5.4-mini",
      url: "https://api.openai.com/v1",
      note: "支持 Responses API 官方思考概括与 7 档思考路由（Ultra 自动映射 xhigh）；支持拉取模型、自定义请求头与月度预算余量追踪。",
      caps: ["流式 SSE", "Responses 思考概括", "7 档思考路由", "月度预算余量"]
    },
    gemini: {
      badge: "官方四色矢量标 · 图文混合",
      name: "Google Gemini",
      model: "gemini-4-hydrogen",
      url: "https://generativelanguage.googleapis.com/v1beta/openai",
      note: "内置 OpenAI 兼容入口与四色矢量品牌图标，支持思考概括（Ultra 路由高思考预算）、PDF ≤ 8 页转图与对话内交互图表。",
      caps: ["官方四色矢量标", "思考概括", "图文混合产物", "PDF ≤ 8 页转图"]
    },
    deepseek: {
      badge: "实时接口余额查询 · 双搜索",
      name: "DeepSeek",
      model: "deepseek-flash",
      url: "https://api.deepseek.com",
      note: "内置官方蓝鲸矢量图标，支持在「使用情况与计费」实时查询账户余额；官方思考链无缝汇入每步时间线，并支持与 Tavily 并存的联网搜索。",
      caps: ["实时余额查询", "官方蓝鲸矢量标", "每步思考时间线", "DeepSeek / Tavily 搜索"]
    },
    kimi: {
      badge: "实时接口余额查询 · 长上下文",
      name: "Kimi · 月之暗面",
      model: "kimi-k3.1-pro",
      url: "https://api.moonshot.cn/v1",
      note: "深浅色自适应官方图标，支持在计费看板实时拉取 Kimi 账户余额；配合对话项目、本机记忆摘要与工作极简模式，大幅降低长上下文消耗。",
      caps: ["实时余额查询", "深浅色双版图标", "对话项目融合", "极简模式省 Token"]
    },
    qwen: {
      badge: "可编辑百炼 / Coding 端点",
      name: "Qwen · 阿里百炼",
      model: "qwen-plus / qwen4-max / qwen3.8-flash",
      url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      note: "采用官方紫蓝渐变矢量图标，自动识别阿里云百炼兼容模式与 Coding 专属端点，Ultra 自动映射高思考预算。",
      caps: ["可编辑兼容地址", "文档预设目录", "Ultra 高思考预算", "工具与 MCP 兼容"]
    },
    glm: {
      badge: "智谱开放平台预设",
      name: "GLM · 智谱",
      model: "glm-4.7 / glm-4.7-flashx",
      url: "https://open.bigmodel.cn/api/paas/v4",
      note: "内置智谱星团官方矢量图标与主力模型目录，保存后即可在对话底栏模型菜单中一键切换，支持鉴权/连接错误就地提示。",
      caps: ["智谱星团矢量标", "文档预设目录", "自定义显示名", "上下文占比统计"]
    },
    ollama: {
      badge: "零 Key 局域网 / 本机自动发现",
      name: "Ollama · 本地",
      model: "自动拉取 /api/tags 本地模型",
      url: "http://127.0.0.1:11434",
      note: "无需 API Key，支持本机回环或局域网设备 IP + 端口；先在目标设备启动 Ollama 并拉取模型，点「拉取模型」即通过 /api/tags 自动发现。",
      caps: ["无需 API Key", "/api/tags 自动发现", "支持局域网 IP", "隐私完全离线"]
    },
    custom: {
      badge: "任意 OpenAI 兼容网关 / OpenRouter",
      name: "自定义接口",
      model: "自由填写模型 ID 与显示名称",
      url: "https://your-gateway.example/v1",
      note: "支持 OpenRouter（含实时余额查询）、vLLM、llama.cpp 或任意中转网关；更换自定义地址时自动隔离旧凭据与请求头。",
      caps: ["OpenRouter 实时余额", "切址隔离凭据", "自定义请求头", "输出上限与流式开关"]
    }
  };

  const provTabs = $$(".prov-pill");
  const provBadge = $("#prov-badge");
  const provName = $("#prov-name");
  const provModel = $("#prov-model");
  const provUrl = $("#prov-url");
  const provNote = $("#prov-note");
  const provCaps = $("#prov-caps");

  function renderProvider(key) {
    const p = PROVIDERS[key];
    if (!p) return;
    provTabs.forEach((b) => {
      const active = b.dataset.prov === key;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
    if (provBadge) provBadge.textContent = p.badge;
    if (provName) provName.textContent = p.name;
    if (provModel) provModel.textContent = p.model;
    if (provUrl) provUrl.textContent = p.url;
    if (provNote) provNote.textContent = p.note;
    if (provCaps) provCaps.innerHTML = p.caps.map((c) => `<span>${c}</span>`).join("");
  }

  provTabs.forEach((btn) => btn.addEventListener("click", () => renderProvider(btn.dataset.prov)));

  /* ------------------------------------------------------------------------
     8. Aifadian Playful Spark Counter & Particle Burst
     ------------------------------------------------------------------------ */
  const sparkBtn = $("#spark-btn");
  const sparkCountEl = $("#spark-count");
  const sparkMsgEl = $("#spark-msg");
  const sparkQuotes = [
    "(=ↀωↀ=)✧ 收到电波！",
    "喵呜！电量 +1%，1.0 时代继续严肃 vibe！",
    "⚡ 电力满满，Linux 容器跑得更欢啦！",
    "(=^･ω･^=) 谢谢投喂！也欢迎去爱发电主页看看～",
    "✦ 原生手感 +10，WebView 退散！"
  ];

  let sparks = 0;
  try { sparks = parseInt(localStorage.getItem("nyallm-sparks") || "0", 10) || 0; } catch { sparks = 0; }
  if (sparkCountEl) sparkCountEl.textContent = String(sparks);

  function burstSparks(x, y) {
    const glyphs = ["⚡", "✦", "♥", "★"];
    for (let i = 0; i < 7; i++) {
      const el = document.createElement("span");
      el.className = "spark-particle";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.9;
      const dist = 42 + Math.random() * 54;
      el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }
  }

  if (sparkBtn) {
    sparkBtn.addEventListener("click", (e) => {
      sparks += 1;
      if (sparkCountEl) sparkCountEl.textContent = String(sparks);
      if (sparkMsgEl) sparkMsgEl.textContent = sparkQuotes[sparks % sparkQuotes.length];
      try { localStorage.setItem("nyallm-sparks", String(sparks)); } catch {}
      const rect = sparkBtn.getBoundingClientRect();
      burstSparks(e.clientX || rect.left + rect.width / 2, e.clientY || rect.top + rect.height / 2);
    });
  }

  /* ------------------------------------------------------------------------
     9. Scroll Reveal & Active Nav Link Observer
     ------------------------------------------------------------------------ */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  const navLinks = $$(".nav-links a");
  const sections = navLinks
    .map((a) => a.getAttribute("href") || "")
    .filter((href) => href.startsWith("#") && href.length > 1)
    .map((href) => $(href))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => navIo.observe(s));
  }

  /* ------------------------------------------------------------------------
     10. Subtle Ambient Sakura-Paper Particle Canvas
     ------------------------------------------------------------------------ */
  const canvas = $("#ambient-canvas");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pointer = { x: -999, y: -999 };
    let rafId = null;

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random(), y: Math.random(), r: 2.2 + Math.random() * 4.2,
      vx: (Math.random() - 0.5) * 0.00018, vy: 0.00008 + Math.random() * 0.00022,
      phase: Math.random() * Math.PI * 2, kind: Math.random() > 0.35 ? "accent" : "iris"
    }));

    const PRESET_RGB = {
      nya: [212, 91, 150],
      chatgpt: [16, 163, 127],
      gemini: [78, 124, 246],
      claude: [201, 100, 66]
    };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

    function tick(time) {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlEl.getAttribute("data-theme") === "dark";
      const preset = htmlEl.getAttribute("data-preset") || "nya";
      const [r, g, b] = PRESET_RGB[preset] || PRESET_RGB.nya;

      const g1 = ctx.createRadialGradient(width * 0.82, height * 0.14, 10, width * 0.82, height * 0.14, Math.max(width, height) * 0.45);
      g1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${isDark ? 0.13 : 0.17})`);
      g1.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.12, height * 0.24, 10, width * 0.12, height * 0.24, Math.max(width, height) * 0.35);
      g2.addColorStop(0, isDark ? "rgba(78, 124, 246, 0.08)" : "rgba(78, 124, 246, 0.09)");
      g2.addColorStop(1, "rgba(78, 124, 246, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin(time * 0.0005 + p.phase) * 0.00009;
        p.y += p.vy;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        let px = p.x * width, py = p.y * height;
        const dx = px - pointer.x, dy = py - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 1) {
          const push = (1 - dist / 130) * 14;
          px += (dx / dist) * push;
          py += (dy / dist) * push;
        }

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(time * 0.0004 + p.phase);
        ctx.fillStyle =
          p.kind === "accent"
            ? `rgba(${r}, ${g}, ${b}, ${isDark ? 0.20 : 0.22})`
            : isDark ? "rgba(138, 181, 255, 0.16)" : "rgba(78, 124, 246, 0.18)";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = null; }
      else if (!document.hidden && !rafId) { rafId = requestAnimationFrame(tick); }
    });
  }
})();
