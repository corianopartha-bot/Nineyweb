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

  /* ---------- 2. About 视频：从无到有 + 侧→正 ----------
     桌面：滚动控制视频画面（滚到哪、画面转到哪）
     手机/触屏：iOS 不支持「跳帧」渲染（会一片黑），改成静音自动循环播放，
               侧→正随播放呈现；封面图(poster)兜底，确保永不黑屏 */
  const aboutSection = document.getElementById("about");
  const video = document.getElementById("about-video");

  if (aboutSection && video) {
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    // About 在视口里的滚动进度 [0,1]
    function progress() {
      const rect = aboutSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      return Math.min(1, Math.max(0, scrolled / total));
    }

    // 「从无到有」：滚动驱动透明度（两端都用，浮现集中在前半程）
    function updateOpacity() {
      video.style.opacity = Math.min(1, progress() / 0.55).toFixed(3);
    }

    function onScroll(fn) {
      let pending = false;
      window.addEventListener(
        "scroll",
        () => {
          if (pending) return;
          pending = true;
          requestAnimationFrame(() => {
            fn();
            pending = false;
          });
        },
        { passive: true }
      );
      window.addEventListener("resize", fn, { passive: true });
    }

    if (isTouch || prefersReduced) {
      // —— 手机/触屏：静音自动循环播放（reduced-motion 则只靠 poster 封面）——
      if (!prefersReduced) {
        video.muted = true;
        video.loop = true;
        const tryPlay = () => {
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
        };
        tryPlay();
        // 兜底：低电量模式等可能拦截自动播放，首次交互再补一次
        const kick = () => tryPlay();
        window.addEventListener("touchstart", kick, { passive: true, once: true });
        window.addEventListener("scroll", kick, { passive: true, once: true });
      }
      onScroll(updateOpacity);
      updateOpacity();
    } else {
      // —— 桌面：滚动控制视频画面（侧→正联动）——
      let duration = 0;
      let targetTime = 0;
      let currentTime = 0;
      let ready = false;
      let ticking = false;

      video.addEventListener("loadedmetadata", () => {
        duration = video.duration || 0;
        ready = true;
        try {
          video.currentTime = 0.001;
        } catch (e) {}
        update();
      });

      function update() {
        updateOpacity();
        if (ready && duration) {
          targetTime = Math.min(duration - 0.05, progress() * duration);
          requestSmooth();
        }
      }

      // 平滑把视频帧推向目标时间，避免生硬跳帧
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

      onScroll(update);
      aboutSection.addEventListener("click", () => {
        if (ready && duration) {
          targetTime = Math.min(duration - 0.05, targetTime + duration * 0.12);
          requestSmooth();
        }
      });
      update();
    }
  }

  /* ---------- 页脚年份 ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
