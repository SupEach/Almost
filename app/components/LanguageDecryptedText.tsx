"use client";

import { useEffect, useState } from "react";

const sloganCharacterPools: Record<string, string> = {
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  "zh-CN": "山川峰岭岳云雾岩壑天地风雪远近高低深浅",
  ja: "山川峰雲霧空風雪道もうすぐたどり着くあいうえおかきくけこ",
  fr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÇÉÈÊËÎÏÔÙÛÜŸàâçéèêëîïôùûüÿ",
  es: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚÜÑáéíóúüñ",
  ru: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
};

function createRevealOrder(indices: number[]) {
  const order: number[] = [];
  let left = Math.floor((indices.length - 1) / 2);
  let right = left + 1;

  while (left >= 0 || right < indices.length) {
    if (left >= 0) order.push(indices[left--]);
    if (right < indices.length) order.push(indices[right++]);
  }

  return order;
}

export default function LanguageDecryptedText({ text, lang }: { text: string; lang: string }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const originalCharacters = Array.from(text);
    const pool = Array.from(sloganCharacterPools[lang] ?? sloganCharacterPools.en);
    const eligibleIndices = originalCharacters
      .map((character, index) => (/^[\p{L}\p{N}]$/u.test(character) ? index : -1))
      .filter(index => index >= 0);

    if (reduceMotion || eligibleIndices.length === 0) {
      return;
    }

    const revealOrder = createRevealOrder(eligibleIndices);
    const revealed = new Set<number>();
    const charactersPerStep = Math.max(1, Math.ceil(eligibleIndices.length / 12));

    const renderFrame = () => {
      setDisplayText(originalCharacters.map((character, index) => {
        if (!eligibleIndices.includes(index) || revealed.has(index)) return character;
        return pool[Math.floor(Math.random() * pool.length)];
      }).join(""));
    };

    const animationFrame = window.requestAnimationFrame(renderFrame);
    const interval = window.setInterval(() => {
      for (let step = 0; step < charactersPerStep && revealOrder.length; step += 1) {
        const nextIndex = revealOrder.shift();
        if (nextIndex !== undefined) revealed.add(nextIndex);
      }

      if (revealOrder.length === 0) {
        window.clearInterval(interval);
        setDisplayText(text);
        return;
      }

      renderFrame();
    }, 50);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(interval);
    };
  }, [lang, text]);

  return <span className="hero-slogan-decrypted" aria-hidden="true">{displayText}</span>;
}

