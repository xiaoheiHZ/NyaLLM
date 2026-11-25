/* ==========================================================================
   NyaLLM 0.9.0 Official Website — Interactive Workbench & Micro-Motion
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
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2400);
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
     2. Theme Toggle & 0.9.0 Live Color Presets (Nya / ChatGPT / Gemini / Claude)
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const metaTheme = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", next);
    try {
      localStorage.setItem("nyallm-site-theme", next);
    } catch {}
    if (metaTheme) {
      const isClaudeLight = next === "light" && htmlEl.getAttribute("data-preset") === "claude";
      metaTheme.setAttribute("content", next === "dark" ? "#15181D" : isClaudeLight ? "#FAF7F0" : "#FFFFFF");
    }
  }

  const presetChips = $$("[data-set-preset]");
  const PRESET_LABELS = {
    nya: "NyaLLM · 白纸浅粉",
    chatgpt: "ChatGPT · 清雅翡翠",
    gemini: "Gemini · 雾蓝晴紫",
    claude: "Claude · 暖羊皮纸"
  };

  function applyPreset(preset, announce = false) {
    const key = PRESET_LABELS[preset] ? preset : "nya";
    htmlEl.setAttribute("data-preset", key);
    presetChips.forEach((b) => b.classList.toggle("is-active", b.dataset.setPreset === key));
    try {
      localStorage.setItem("nyallm-site-preset", key);
    } catch {}
    if (metaTheme && htmlEl.getAttribute("data-theme") !== "dark") {
      metaTheme.setAttribute("content", key === "claude" ? "#FAF7F0" : "#FFFFFF");
    }
    if (announce) showToast(`已切换 0.9.0 配色：${PRESET_LABELS[key]}`);
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
    "(=ↀωↀ=) 喵！NyaLLM 0.9.0 已上线",
    "试试下方的四套官方配色实时换肤哦 ✦",
    "后台窗口、时区问候和绘图产物全都有啦",
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
     4. Hero Live Interactive NyaLLM 0.9.0 Workbench
     ------------------------------------------------------------------------ */
  const demoClock = $("#demo-clock");
  const welcomeGreetingEl = $("#welcome-greeting");
  const welcomeTzEl = $("#welcome-tz");
  const welcomeTzDetailEl = $("#welcome-tz-detail");

  function updateClockAndGreeting() {
    const now = new Date();
    const h = now.getHours();
    const hh = String(h).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    if (demoClock) demoClock.textContent = `${hh}:${mm}`;
    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const offH = Math.floor(Math.abs(offsetMin) / 60);
    const tzLabel = offH === 0 ? "GMT" : `GMT${sign}${offH}`;
    let greet = "你好";
    if (h < 5 || h >= 23) greet = "夜深了";
    else if (h < 11) greet = "早上好";
    else if (h < 14) greet = "中午好";
    else if (h < 18) greet = "下午好";
    else greet = "晚上好";
    if (welcomeGreetingEl) welcomeGreetingEl.textContent = greet;
    if (welcomeTzEl) welcomeTzEl.textContent = `${hh}:${mm} · ${tzLabel}`;
  }
  updateClockAndGreeting();
  setInterval(updateClockAndGreeting, 30000);

  if (welcomeTzEl && welcomeTzDetailEl) {
    welcomeTzEl.addEventListener("click", () => {
      welcomeTzDetailEl.hidden = !welcomeTzDetailEl.hidden;
    });
  }

  const WORKBENCH_CHATS = {
    artifact: {
      title: "雨天书店路线",
      model: "DeepSeek",
      messages: [
        {
          role: "user",
          text: "下雨天想去两间独立书店，帮我排一条少走路的路线并生成一份耗时对比图。"
        },
        {
          role: "ai",
          model: "DeepSeek · 本地工具与产物",
          activities: [
            ["已加载 5 个 MCP 工具", "Streamable HTTP"],
            ["已创建文档", "plan.md"],
            ["已更新路线表格", "28 字节"],
            ["已生成 PNG 图表", "步行时间.png"]
          ],
          thinking: "先比较两站与地铁口的雨天步行距离，再调用绘图工具输出清晰对比图表。",
          text: "先把行程留出余量：上午从地铁口直达第一间书店，午后雨势转小后步行约十八分钟前往第二间。完整路线与图表产物已保存在本机。",
          artifact: { name: "步行时间.png", meta: "PNG 图表产物 · 可预览或保存" },
          stats: "输入 134 · 输出 88 token · 50.2 token/秒"
        }
      ]
    },
    stream: {
      title: "并行分析",
      model: "Gemini",
      messages: [
        {
          role: "user",
          text: "总结 NyaLLM 0.9.0 新增的窗口管理与外观自定义特性。"
        },
        {
          role: "ai",
          model: "Google Gemini · 子 Agent",
          pill: "子 Agent · 独立只读分析完成",
          thinking: "核对 0.9.0 的后台窗口管理、横向循环布局、四套主题配色与自定义背景图。",
          text: "0.9.0 顶栏右侧新增叠窗入口「后台窗口」，可集中切换或一键清理后台任务；同时支持多任务/横向循环双布局、四套官方配色预设、自定义 #RRGGBB 与设备背景图。",
          stats: "输入 152 · 输出 96 token · 54.1 token/秒"
        }
      ]
    },
    phone: {
      title: "手机助手",
      model: "OpenAI",
      messages: [
        {
          role: "user",
          text: "帮我打开 Android 设置查看无障碍状态，遇到敏感操作先弹窗让我确认。"
        },
        {
          role: "ai",
          model: "OpenAI · 手机助手模式",
          pill: "安全护栏已启用 · 密码自动脱敏",
          thinking: "读取前台节点并定位系统设置入口，属于敏感操作范围，等待浮层确认。",
          text: "已识别系统设置入口。按照硬安全护栏，系统设置、权限授权、支付与密码框绝不静默执行，点击浮层「允许这一步」后才会继续。",
          stats: "输入 108 · 输出 74 token · 45.6 token/秒"
        }
      ]
    },
    search: {
      title: "双源检索",
      model: "DeepSeek",
      messages: [
        {
          role: "user",
          text: "用 Tavily 深入搜索看看 Ollama 局域网模型发现怎么配合 NyaLLM 使用。"
        },
        {
          role: "ai",
          model: "DeepSeek · Tavily 深入搜索",
          pill: "Tavily · 深入搜索 · 5 篇来源",
          thinking: "已向 Tavily 发起深入搜索并整理 Ollama /api/tags 无 Key 发现流程。",
          text: "在电脑或同局域网设备启动 Ollama 并下载模型后，在 NyaLLM 0.9.0 的 Ollama 配置页填入局域网 IP 与端口，无需 API Key 即可通过 /api/tags 直接拉取模型列表开始对话。",
          stats: "输入 118 · 输出 89 token · 51.3 token/秒"
        }
      ]
    }
  };

  let activeChatId = "artifact";
  let currentModel = "DeepSeek";
  let welcomeVisible = false;
  let streamTimer = null;

  const topbarTitle = $("#topbar-chat-title");
  const panePrimary = $("#pane-primary");
  const paneMessages = $("#pane-primary-messages");
  const welcomeStage = $("#welcome-stage");
  const welcomeDemoBtn = $("#btn-welcome-demo");
  const railCards = $$(".rail-card");
  const nyaBody = $(".nya-body");
  const paneSecondary = $("#pane-secondary");
  const splitDivider = $("#split-divider");
  const splitToggleBtn = $("#btn-split-toggle");
  const closeSplitBtn = $("#close-split-btn");
  const modelChip = $("#demo-model-chip");
  const demoInput = $("#demo-input");
  const demoSendBtn = $("#demo-send-btn");
  const demoSearchToggle = $("#demo-search-toggle");

  function closeAllPopovers() {
    $$(".nya-popover").forEach((p) => (p.hidden = true));
  }

  function showWelcome(on) {
    welcomeVisible = on;
    if (welcomeStage) welcomeStage.hidden = !on;
    if (paneMessages) paneMessages.hidden = on;
    if (welcomeDemoBtn) welcomeDemoBtn.setAttribute("aria-pressed", String(on));
    if (on) {
      updateClockAndGreeting();
      if (topbarTitle) topbarTitle.textContent = "新对话";
    } else {
      const chat = WORKBENCH_CHATS[activeChatId];
      if (topbarTitle && chat) topbarTitle.textContent = chat.title;
    }
  }

  function createAiMessageEl(m, openThinking = false) {
    const wrap = document.createElement("div");
    wrap.className = "msg-ai-wrap";

    const head = document.createElement("div");
    head.className = "msg-ai-head";
    head.textContent = m.model || currentModel;
    wrap.appendChild(head);

    if (m.activities && m.activities.length) {
      const aBtn = document.createElement("button");
      aBtn.type = "button";
      aBtn.className = "activity-toggle";
      aBtn.textContent = `活动 · ${m.activities.length} 步 ▾`;

      const aBox = document.createElement("div");
      aBox.className = "activity-box";
      aBox.hidden = true;
      aBox.innerHTML = m.activities
        .map(([label, detail]) => `<div class="activity-step"><span>${label}</span><code>${detail}</code></div>`)
        .join("");

      aBtn.addEventListener("click", () => {
        const open = aBox.hidden;
        aBox.hidden = !open;
        aBtn.textContent = `活动 · ${m.activities.length} 步 ${open ? "▴" : "▾"}`;
      });

      wrap.appendChild(aBtn);
      wrap.appendChild(aBox);
    }

    if (m.thinking) {
      const tBtn = document.createElement("button");
      tBtn.type = "button";
      tBtn.className = "think-toggle";
      tBtn.textContent = openThinking ? "思考链 收起" : "思考链 展开";

      const tBox = document.createElement("div");
      tBox.className = "think-box";
      tBox.hidden = !openThinking;
      tBox.textContent = m.thinking;

      tBtn.addEventListener("click", () => {
        const willOpen = tBox.hidden;
        tBox.hidden = !willOpen;
        tBtn.textContent = willOpen ? "思考链 收起" : "思考链 展开";
      });

      wrap.appendChild(tBtn);
      wrap.appendChild(tBox);
    }

    const bubble = document.createElement("div");
    bubble.className = "msg-ai-bubble";
    if (m.pill) {
      const pill = document.createElement("div");
      pill.className = "msg-card-pill";
      pill.textContent = m.pill;
      bubble.appendChild(pill);
    }
    const textSpan = document.createElement("div");
    textSpan.className = "msg-ai-text";
    textSpan.textContent = m.text;
    bubble.appendChild(textSpan);

    if (m.artifact) {
      const art = document.createElement("div");
      art.className = "artifact-chip";
      art.innerHTML = `
        <div class="artifact-chip-info">
          <strong>${m.artifact.name}</strong>
          <span>${m.artifact.meta}</span>
        </div>
        <div class="artifact-bars" aria-hidden="true">
          <i style="height:10px"></i><i style="height:18px"></i><i style="height:14px"></i><i style="height:22px"></i>
        </div>
      `;
      bubble.appendChild(art);
    }
    wrap.appendChild(bubble);

    if (m.stats) {
      const stats = document.createElement("div");
      stats.className = "msg-stats";
      stats.textContent = m.stats;
      wrap.appendChild(stats);
    }

    return wrap;
  }

  function renderChat(chatId, animate = true) {
    const data = WORKBENCH_CHATS[chatId];
    if (!data || !paneMessages) return;
    clearInterval(streamTimer);
    activeChatId = chatId;
    showWelcome(false);

    railCards.forEach((c) => c.classList.toggle("is-active", c.dataset.chatId === chatId));
    if (topbarTitle) topbarTitle.textContent = data.title;

    if (animate && panePrimary) {
      panePrimary.classList.add("is-switching");
      setTimeout(() => panePrimary.classList.remove("is-switching"), 150);
    }

    paneMessages.innerHTML = "";
    data.messages.forEach((m, idx) => {
      if (m.role === "user") {
        const el = document.createElement("div");
        el.className = "msg-user";
        el.textContent = m.text;
        paneMessages.appendChild(el);
      } else {
        paneMessages.appendChild(createAiMessageEl(m, idx === data.messages.length - 1 && !m.activities));
      }
    });
    paneMessages.scrollTop = paneMessages.scrollHeight;
  }

  renderChat("artifact", false);

  railCards.forEach((card) => {
    card.addEventListener("click", () => {
      closeAllPopovers();
      renderChat(card.dataset.chatId, true);
    });
  });

  if (welcomeDemoBtn) {
    welcomeDemoBtn.addEventListener("click", () => {
      closeAllPopovers();
      showWelcome(!welcomeVisible);
    });
  }

  /* Live SSE Streaming Simulator */
  function runStreamReply(userPrompt) {
    clearInterval(streamTimer);
    closeAllPopovers();
    if (welcomeVisible) showWelcome(false);
    const chat = WORKBENCH_CHATS[activeChatId];
    if (!chat) return;

    const searchOn = demoSearchToggle && demoSearchToggle.getAttribute("aria-pressed") === "true";
    const promptText = userPrompt.trim();
    chat.messages.push({ role: "user", text: promptText });

    const userEl = document.createElement("div");
    userEl.className = "msg-user";
    userEl.textContent = promptText;
    paneMessages.appendChild(userEl);

    const replies = [
      `收到！「${promptText.slice(0, 18)}${promptText.length > 18 ? "…" : ""}」已通过 ${currentModel} 进入 0.9.0 实时分字流式输出。你可以点右上角叠窗图标查看后台窗口，或点击下方「活动」查看工具步骤。`,
      `正在使用 ${currentModel} 原生通道处理你的问题。NyaLLM 0.9.0 支持自动总结首轮标题、单条消息分支到新窗口，并且所有凭据与本机记忆只保存在你的手机中。`,
      `已整理完成！想切换视觉风格的话，向下滑到 NyaStyle 卡片可以直接体验 0.9.0 内置的 NyaLLM / ChatGPT / Gemini / Claude 四套主题配色哦。`
    ];
    const replyFull = replies[Math.floor(Math.random() * replies.length)];
    const thinkingText = searchOn
      ? `已启用双源联网搜索（DeepSeek / Tavily），结合 ${currentModel} 整理实时回复并自动测算输出速率…`
      : `0.9.0 思考显示已默认自动开启，正在通过原生 SSE 接收 ${currentModel} 实时回复…`;

    const aiData = {
      role: "ai",
      model: `${currentModel} · 0.9.0 实时流式`,
      pill: searchOn ? "Tavily + DeepSeek · 检索完成" : "原生 SSE · 流式输出中",
      thinking: thinkingText,
      text: "",
      stats: "连接首帧…"
    };

    const aiEl = createAiMessageEl(aiData, true);
    paneMessages.appendChild(aiEl);
    const textNode = $(".msg-ai-text", aiEl);
    const statsNode = $(".msg-stats", aiEl);
    const pillNode = $(".msg-card-pill", aiEl);
    paneMessages.scrollTop = paneMessages.scrollHeight;

    let pos = 0;
    const started = performance.now();
    const inputTokens = 32 + promptText.length * 2;

    streamTimer = setInterval(() => {
      pos = Math.min(replyFull.length, pos + 2);
      const slice = replyFull.slice(0, pos);
      textNode.innerHTML = "";
      textNode.appendChild(document.createTextNode(slice));
      if (pos < replyFull.length) {
        const cur = document.createElement("span");
        cur.className = "stream-cursor";
        textNode.appendChild(cur);
      }

      const elapsed = Math.max(0.15, (performance.now() - started) / 1000);
      const outTokens = Math.max(1, Math.round(pos * 0.72));
      const speed = (outTokens / elapsed).toFixed(1);
      statsNode.textContent = `输入 ${inputTokens} · 输出 ${outTokens} token · ${speed} token/秒`;
      paneMessages.scrollTop = paneMessages.scrollHeight;

      if (pos >= replyFull.length) {
        clearInterval(streamTimer);
        if (pillNode) pillNode.textContent = searchOn ? "双源搜索 · 已完成" : "原生 SSE · 流式完成";
        aiData.text = replyFull;
        aiData.stats = statsNode.textContent;
        chat.messages.push(aiData);
      }
    }, 34);
  }

  if (demoSendBtn && demoInput) {
    demoInput.addEventListener("input", () => {
      if (welcomeVisible && demoInput.value.trim().length > 0) {
        showWelcome(false);
      }
    });
    const submitDemo = () => {
      const val = demoInput.value.trim();
      if (!val) {
        runStreamReply("介绍一下 NyaLLM 0.9.0 最亮眼的新功能");
        return;
      }
      demoInput.value = "";
      runStreamReply(val);
    };
    demoSendBtn.addEventListener("click", submitDemo);
    demoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitDemo();
      }
    });
  }

  const streamDemoBtn = $("#btn-stream-demo");
  if (streamDemoBtn) {
    streamDemoBtn.addEventListener("click", () => {
      runStreamReply("给我演示一下 NyaLLM 0.9.0 的实时分字流式与思考链");
    });
  }

  /* Split-Screen Toggle & Draggable Splitter */
  let isSplit = false;
  function setSplit(next) {
    isSplit = next;
    if (paneSecondary) paneSecondary.hidden = !next;
    if (splitDivider) splitDivider.hidden = !next;
    if (splitToggleBtn) splitToggleBtn.setAttribute("aria-pressed", String(next));
    if (panePrimary && paneSecondary) {
      panePrimary.style.flexBasis = next ? "56%" : "100%";
      paneSecondary.style.flexBasis = "44%";
    }
  }

  if (splitToggleBtn) {
    splitToggleBtn.addEventListener("click", () => {
      setSplit(!isSplit);
      showToast(isSplit ? "已开启双窗分屏 · 可上下拖动中间分隔条" : "已切回单窗视图");
    });
  }
  if (closeSplitBtn) {
    closeSplitBtn.addEventListener("click", () => setSplit(false));
  }

  const nyaStage = $("#nya-stage");
  if (splitDivider && nyaStage && panePrimary && paneSecondary) {
    let dragging = false;
    const onMove = (clientY) => {
      const rect = nyaStage.getBoundingClientRect();
      if (rect.height <= 0) return;
      const pct = Math.min(72, Math.max(28, ((clientY - rect.top) / rect.height) * 100));
      panePrimary.style.flexBasis = `${pct}%`;
      paneSecondary.style.flexBasis = `${100 - pct}%`;
    };
    splitDivider.addEventListener("pointerdown", (e) => {
      dragging = true;
      splitDivider.classList.add("is-dragging");
      splitDivider.setPointerCapture(e.pointerId);
    });
    splitDivider.addEventListener("pointermove", (e) => {
      if (dragging) onMove(e.clientY);
    });
    const endDrag = () => {
      dragging = false;
      splitDivider.classList.remove("is-dragging");
    };
    splitDivider.addEventListener("pointerup", endDrag);
    splitDivider.addEventListener("pointercancel", endDrag);
  }

  /* Anchored Popover Menus & 0.9.0 Background Windows Sheet */
  const winMenuBtn = $("#demo-window-menu-btn");
  const winPop = $("#popover-window");
  if (winMenuBtn && winPop) {
    winMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = winPop.hidden;
      closeAllPopovers();
      winPop.hidden = !willOpen;
    });
  }

  const bgBtn = $("#demo-bg-windows-btn");
  const bgSheet = $("#demo-bg-sheet");
  const bgClose = $("#demo-bg-close");
  const bgClear = $("#demo-bg-clear");
  if (bgBtn && bgSheet) {
    bgBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopovers();
      bgSheet.hidden = false;
    });
    if (bgClose) bgClose.addEventListener("click", () => (bgSheet.hidden = true));
    $$("[data-bg-jump]", bgSheet).forEach((row) => {
      row.addEventListener("click", () => {
        renderChat(row.dataset.bgJump, true);
        bgSheet.hidden = true;
      });
    });
    if (bgClear) {
      bgClear.addEventListener("click", () => {
        bgSheet.hidden = true;
        showToast("已清除后台窗口 · 对话记录与草稿均已安全保存");
      });
    }
  }

  $$("[data-pop]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pop = $(`#popover-${btn.dataset.pop}`);
      if (!pop) return;
      const willOpen = pop.hidden;
      closeAllPopovers();
      pop.hidden = !willOpen;
    });
  });

  $$("[data-win-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.winAction;
      closeAllPopovers();
      if (action === "new-win" || action === "split") {
        setSplit(!isSplit);
      } else if (action === "focus" && nyaBody) {
        const focused = nyaBody.classList.toggle("is-focus");
        showToast(focused ? "独占全屏：已收起左侧任务栏" : "已恢复左侧斜切任务栏");
      } else if (action === "min") {
        if (bgSheet) bgSheet.hidden = false;
        showToast("已收起到后台窗口 · 可随时一键恢复");
      } else if (action === "close") {
        setSplit(false);
        renderChat("stream", true);
        showToast("已关闭当前窗并切回并行窗口");
      }
    });
  });

  $$("[data-tool-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeAllPopovers();
      showToast(btn.dataset.toolPick);
    });
  });

  $$("[data-model-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentModel = btn.dataset.modelPick;
      if (modelChip) modelChip.textContent = `模型 · ${currentModel}`;
      $$("[data-model-pick]").forEach((row) => row.classList.toggle("is-selected", row === btn));
      closeAllPopovers();
      showToast(`已切换当前窗口模型为 ${currentModel}`);
    });
  });

  if (demoSearchToggle) {
    demoSearchToggle.addEventListener("click", () => {
      const next = demoSearchToggle.getAttribute("aria-pressed") !== "true";
      demoSearchToggle.setAttribute("aria-pressed", String(next));
      showToast(next ? "已开启联网搜索（DeepSeek / Tavily）" : "已关闭联网搜索");
    });
  }

  const newChatBtn = $("#demo-new-chat");
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      closeAllPopovers();
      showWelcome(true);
      showToast("已展示 0.9.0 时区问候页 · 输入文字自动淡出");
    });
  }

  /* Slide-Over History Drawer inside Mockup */
  const drawerBtn = $("#demo-drawer-btn");
  const drawerEl = $("#demo-drawer");
  const drawerClose = $("#demo-drawer-close");
  if (drawerBtn && drawerEl) {
    drawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllPopovers();
      drawerEl.hidden = false;
    });
    if (drawerClose) drawerClose.addEventListener("click", () => (drawerEl.hidden = true));
    drawerEl.addEventListener("click", (e) => {
      if (e.target === drawerEl) drawerEl.hidden = true;
    });
    $$("[data-drawer-jump]", drawerEl).forEach((row) => {
      row.addEventListener("click", () => {
        renderChat(row.dataset.drawerJump, true);
        drawerEl.hidden = true;
      });
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nya-popover") && !e.target.closest("[data-pop]") && !e.target.closest("#demo-window-menu-btn")) {
      closeAllPopovers();
    }
  });

  /* ------------------------------------------------------------------------
     5. Bento Micro-Demos (MCP Confirm & Reasoning Effort)
     ------------------------------------------------------------------------ */
  const mcpAllow = $("#mcp-allow-btn");
  const mcpDeny = $("#mcp-deny-btn");
  const mcpNote = $("#mcp-status-note");

  if (mcpAllow && mcpDeny && mcpNote) {
    mcpAllow.addEventListener("click", () => {
      mcpNote.textContent = "✓ 已放行并生成 步行时间.png 产物";
      mcpNote.style.color = "var(--green)";
    });
    mcpDeny.addEventListener("click", () => {
      mcpNote.textContent = "✕ 已拒绝，未向服务器发送请求";
      mcpNote.style.color = "var(--danger)";
    });
  }

  const effortPills = $$(".effort-pill");
  const effortCaption = $("#effort-caption");
  effortPills.forEach((p) => {
    p.addEventListener("click", () => {
      effortPills.forEach((x) => x.classList.toggle("is-active", x === p));
      if (effortCaption) effortCaption.textContent = p.dataset.effort || "";
    });
  });

  /* ------------------------------------------------------------------------
     6. 8 Model Providers Interactive Matrix (Exact 0.9.0 ProviderPreset.java)
     ------------------------------------------------------------------------ */
  const PROVIDERS = {
    openai: {
      badge: "云端旗舰预设",
      name: "OpenAI",
      model: "gpt-5.4-mini",
      url: "https://api.openai.com/v1",
      note: "支持通过 Responses API 请求官方思考概括；「拉取模型」支持多种嵌套列表响应，并可自由配置请求头、上下文预算与输出 Token 上限。",
      caps: ["流式 SSE", "Responses 思考概括", "PDF 原生文件", "拉取模型列表"]
    },
    gemini: {
      badge: "Google 多模态预设",
      name: "Google Gemini",
      model: "gemini-4-hydrogen",
      url: "https://generativelanguage.googleapis.com/v1beta/openai",
      note: "内置 OpenAI 兼容入口，支持思考概括、图文混合响应展示与 PDF 转图输入，生成的图像产物可直接预览或保存到相册。",
      caps: ["流式 SSE", "思考概括", "图文混合产物", "PDF ≤ 8 页转图"]
    },
    deepseek: {
      badge: "推理 + 联网搜索双搭档",
      name: "DeepSeek",
      model: "deepseek-flash",
      url: "https://api.deepseek.com",
      note: "默认自动展示官方思考链；「联网搜索」可在 DeepSeek 与 Tavily 之间自由选择，各自独立保存 Key 与检索条数（1–10 条）。",
      caps: ["官方思考链", "DeepSeek / Tavily 双搜索", "PDF 转图", "高性价比长文"]
    },
    kimi: {
      badge: "国产长上下文预设",
      name: "Kimi · 月之暗面",
      model: "kimi-k3.1-pro",
      url: "https://api.moonshot.cn/v1",
      note: "开箱即用的月之暗面接口预设，配合 0.9.0 本机记忆、历史摘录上下文与自动摘要裁剪，轻松应对超长文档与代码问答。",
      caps: ["流式 SSE", "本机记忆融合", "拉取模型列表", "独立 Key 存储"]
    },
    qwen: {
      badge: "可编辑百炼 / Coding 端点",
      name: "Qwen · 阿里百炼",
      model: "qwen-plus / qwen4-max / qwen3.8-flash",
      url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      note: "自动识别阿里云百炼兼容模式与 Coding 专属端点，无列表接口时可从标注为文档预设的目录直接选取模型。",
      caps: ["可编辑兼容地址", "文档预设目录", "流式 SSE", "工具与 MCP 兼容"]
    },
    glm: {
      badge: "智谱开放平台预设",
      name: "GLM · 智谱",
      model: "glm-4.7 / glm-4.7-flashx",
      url: "https://open.bigmodel.cn/api/paas/v4",
      note: "预置智谱开放平台 v4 地址与主力模型目录，保存后即可在对话底栏模型菜单中一键切换，支持鉴权/连接错误就地提示。",
      caps: ["流式 SSE", "文档预设目录", "自定义显示名", "Token 测速统计"]
    },
    ollama: {
      badge: "0.9.0 无 Key 局域网自动发现",
      name: "Ollama · 本地",
      model: "自动拉取 /api/tags 本地模型",
      url: "http://127.0.0.1:11434",
      note: "无需 API Key，支持本机回环或局域网设备 IP + 端口；先在该设备启动 Ollama 并安装模型，点「拉取模型」即通过 /api/tags 自动发现全部已装模型。",
      caps: ["无需 API Key", "/api/tags 自动发现", "支持局域网 IP", "隐私完全离线"]
    },
    custom: {
      badge: "任意 OpenAI 兼容网关",
      name: "自定义接口",
      model: "自由填写模型 ID 与显示名称",
      url: "https://your-gateway.example/v1",
      note: "支持任意中转站、vLLM、llama.cpp 或自建网关；更换自定义地址时自动隔离旧凭据与请求头，避免把密钥误发到新端点。",
      caps: ["自定义请求头", "切址隔离凭据", "可选思考链展示", "输出上限与流式开关"]
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
     7. Aifadian Playful Spark Counter & Particle Burst
     ------------------------------------------------------------------------ */
  const sparkBtn = $("#spark-btn");
  const sparkCountEl = $("#spark-count");
  const sparkMsgEl = $("#spark-msg");
  const sparkQuotes = [
    "(=ↀωↀ=)✧ 收到电波！",
    "喵呜！电量 +1%，继续严肃 vibe！",
    "⚡ 电力满满，0.9.0 之后继续冲！",
    "(=^･ω･^=) 谢谢投喂！也欢迎去爱发电主页看看～",
    "✦ 原生手感 +10，WebView 退散！"
  ];

  let sparks = 0;
  try {
    sparks = parseInt(localStorage.getItem("nyallm-sparks") || "0", 10) || 0;
  } catch {
    sparks = 0;
  }
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
      try {
        localStorage.setItem("nyallm-sparks", String(sparks));
      } catch {}
      const rect = sparkBtn.getBoundingClientRect();
      burstSparks(e.clientX || rect.left + rect.width / 2, e.clientY || rect.top + rect.height / 2);
    });
  }

  /* ------------------------------------------------------------------------
     8. Scroll Reveal & Active Nav Link Observer
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
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);

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
     9. Subtle Ambient Sakura-Paper Particle Canvas
     ------------------------------------------------------------------------ */
  const canvas = $("#ambient-canvas");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pointer = { x: -999, y: -999 };
    let rafId = null;

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 2.2 + Math.random() * 4.2,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: 0.00008 + Math.random() * 0.00022,
      phase: Math.random() * Math.PI * 2,
      kind: Math.random() > 0.35 ? "accent" : "iris"
    }));

    const PRESET_RGB = {
      nya: [220, 140, 175],
      chatgpt: [82, 151, 130],
      gemini: [118, 127, 205],
      claude: [183, 119, 96]
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
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });

    function tick(time) {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlEl.getAttribute("data-theme") === "dark";
      const preset = htmlEl.getAttribute("data-preset") || "nya";
      const [r, g, b] = PRESET_RGB[preset] || PRESET_RGB.nya;

      const g1 = ctx.createRadialGradient(width * 0.82, height * 0.14, 10, width * 0.82, height * 0.14, Math.max(width, height) * 0.45);
      g1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${isDark ? 0.14 : 0.22})`);
      g1.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.12, height * 0.24, 10, width * 0.12, height * 0.24, Math.max(width, height) * 0.35);
      g2.addColorStop(0, isDark ? "rgba(108, 151, 195, 0.08)" : "rgba(108, 151, 195, 0.11)");
      g2.addColorStop(1, "rgba(108, 151, 195, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin(time * 0.0005 + p.phase) * 0.00009;
        p.y += p.vy;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        let px = p.x * width;
        let py = p.y * height;
        const dx = px - pointer.x;
        const dy = py - pointer.y;
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
            ? `rgba(${r}, ${g}, ${b}, ${isDark ? 0.22 : 0.26})`
            : isDark ? "rgba(138, 181, 224, 0.18)" : "rgba(108, 151, 195, 0.22)";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    });
  }
})();
