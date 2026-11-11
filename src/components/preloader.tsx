"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("campusstay:loaded");
    const wait = seen ? 120 : 1250;
    const timer = window.setTimeout(() => {
      setDone(true);
      sessionStorage.setItem("campusstay:loaded", "1");
    }, wait);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="preloader" data-done={done} role="status" aria-live="polite">
      <svg
        className="preloader-mark"
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
      >
        <path className="roof" d="M7 30 L32 9 L57 30" />
        <path className="walls" d="M12 27 V55 H52 V27" />
        <path className="door" d="M26 55 V40 H38 V55" />
        <path className="window" d="M18 33 H23 V38 H18 Z" />
      </svg>
      <p className="preloader-word">CampusStay</p>
      <p className="preloader-hint">Loading hostels around UCC</p>
      <div className="preloader-bar" aria-hidden="true">
        <i />
      </div>
      <span className="sr-only">Loading hostels</span>
    </div>
  );
}
