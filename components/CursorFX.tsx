"use client";

import { useEffect, useRef } from "react";

/**
 * CursorFX — custom cursor (acid dot + trailing ring).
 * Adds a `.big` class when hovering interactive elements.
 * Hidden on touch devices via CSS in globals.css.
 */
export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) {
      document.body.classList.add("no-cursor");
      return;
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let tx = mx;
    let ty = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top = my + "px";
      }
    };

    const loop = () => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      if (trailRef.current) {
        trailRef.current.style.left = tx + "px";
        trailRef.current.style.top = ty + "px";
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el || !dotRef.current) return;
      const interactive =
        el.closest("a, button, [data-cursor='big'], .pj-row, .wr-row, .tl-row, .belief, .chip, .contact-email");
      dotRef.current.classList.toggle("big", !!interactive);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={trailRef} className="cursor-trail" aria-hidden />
    </>
  );
}
