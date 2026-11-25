/* Shared lightweight runtime for NyaLLM subdirectory pages */
(() => {
  "use strict";

  const htmlEl = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const toastEl = document.getElementById("toast");
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

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", next);
    try { localStorage.setItem("nyallm-site-theme", next); } catch {}
    if (metaTheme) {
      const isClaudeLight = next === "light" && htmlEl.getAttribute("data-preset") === "claude";
      metaTheme.setAttribute("content", next === "dark" ? "#15181D" : isClaudeLight ? "#FAF7F0" : "#FFFFFF");
    }
  }

  try {
    const savedTheme = localStorage.getItem("nyallm-site-theme");
    if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);
    const savedPreset = localStorage.getItem("nyallm-site-preset");
    if (savedPreset && ["nya", "chatgpt", "gemini", "claude"].includes(savedPreset)) {
      htmlEl.setAttribute("data-preset", savedPreset);
    }
  } catch {}

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = (htmlEl.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark";
      applyTheme(next);
      showToast(next === "dark" ? "已切换至 NyaStyle 深色模式" : "已切换至 NyaStyle 浅色模式");
    });
  }

  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener("click", () => {
      const open = !mobileNav.hidden;
      mobileNav.hidden = open;
      mobileBtn.setAttribute("aria-expanded", String(!open));
    });
  }

  document.querySelectorAll("[data-copy-text]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-copy-text") || "";
      try {
        await navigator.clipboard.writeText(val);
        showToast(val.startsWith("http") ? "已复制链接" : "已复制 SHA-256 校验值");
      } catch {
        showToast("复制失败，请手动选中复制");
      }
    });
  });
})();
