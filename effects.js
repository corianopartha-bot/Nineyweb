/* ============================================================
   Niney · 蒲钰娇 个人名片网站 · 交互效果
   1) 首屏超现实背景：漂浮的虹彩光球 + 跟随鼠标
   2) About 视频：随滚动「从无到有」浮现 + 「侧面→正面」联动
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 1. 首屏虹彩光球 ---------- */
  const canvas = document.getElementById("aurora");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    const colors = ["#7c5cff", "#38d0ff", "#ff6ec7"];
    const orbs = [];
    const mouse = { x: 0.5, y: 0.4 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function makeOrbs() {
      orbs.length = 0;
      const count = window.innerWidth < 760 ? 5 : 8;
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random(),
          y: Math.random(),
          r: (Math.random() * 0.18 + 0.12) * Math.min(w, h),
          dx: (Math.random() - 0.5) * 0.00018,
          dy: (Math.random() - 0.5) * 0.00018,
          color: colors[i % colors.length],
          depth: Math.random() * 0.6 + 0.4,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const o of orbs) {
        o.x += o.dx;
        o.y += o.dy;
        if (o.x < -0.2 || o.x > 1.2) o.dx *= -1;
        if (o.y < -0.2 || o.y > 1.2) o.dy *= -1;

        const px = (o.x + (mouse.x - 0.5) * 0.06 * o.depth) * w;
        const py = (o.y + (mouse.y - 0.5) * 0.06 * o.depth) * h;

        const g = ctx.createRadialGradient(px, py, 0, px, py, o.r);
        g.addColorStop(0, o.color + "55");
        g.addColorStop(1, o.color + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, o.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(draw);
    }

    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = e.clientY / window.innerHeight;
      },
      { passive: true }
    );
    window.addEventListener("resize", () => {
      resize();
      makeOrbs();
    });

    resize();
    makeOrbs();
    if (!prefersReduced) {
      draw();
    } else {
      // 静态画一帧即可
      draw === draw; // noop
      (function still() {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (const o of orbs) {
          const px = o.x * w;
          const py = o.y * h;
          const g = ctx.createRadialGradient(px, py, 0, px, py, o.r);
          g.addColorStop(0, o.color + "55");
          g.addColorStop(1, o.color + "00");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, o.r, 0, Math.PI * 2);
          ctx.fill();
        }
      })();
    }
  }

  /* ---------- 2. About 视频：滚动联动 ---------- */
  const aboutSection = document.getElementById("about");
  const video = document.getElementById("about-video");

  if (aboutSection && video) {
    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let ready = false;
    let ticking = false;

    video.addEventListener("loadedmetadata", () => {
      duration = video.duration || 0;
      ready = true;
      // 先停在第一帧
      try {
        video.currentTime = 0.001;
      } catch (e) {}
      updateProgress();
    });

    // 计算 About 在视口里的滚动进度 [0,1]
    function progress() {
      const rect = aboutSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // 板块顶部从「刚进入视口底部」到「升到视口顶部」，记为 0 → 1
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      return Math.min(1, Math.max(0, scrolled / total));
    }

    function updateProgress() {
      const p = progress();
      // 从无到有：浮现集中在前半程，后半程保持显形
      const opacity = Math.min(1, p / 0.55);
      video.style.opacity = opacity.toFixed(3);

      if (ready && duration) {
        // 侧面→正面：把滚动进度映射到视频时间轴
        targetTime = Math.min(duration - 0.05, p * duration);
        requestSmooth();
      }
    }

    // 平滑地把视频帧推向目标时间，避免生硬跳帧
    function requestSmooth() {
      if (ticking) return;
      ticking = true;
      const step = () => {
        currentTime += (targetTime - currentTime) * 0.18;
        if (Math.abs(targetTime - currentTime) < 0.01) {
          currentTime = targetTime;
          ticking = false;
        }
        if (video.readyState >= 2) {
          try {
            video.currentTime = currentTime;
          } catch (e) {}
        }
        if (ticking) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    let scrollPending = false;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => {
          updateProgress();
          scrollPending = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateProgress, { passive: true });

    // 用户点击 About 区域也轻推一下进度（呼应「点击 + 滚动」）
    aboutSection.addEventListener("click", () => {
      if (ready && duration) {
        targetTime = Math.min(duration - 0.05, targetTime + duration * 0.12);
        requestSmooth();
      }
    });

    updateProgress();
  }

  /* ---------- 页脚年份 ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
