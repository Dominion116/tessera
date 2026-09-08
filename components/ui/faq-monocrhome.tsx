"use client";

import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Reveal from "@/components/landing/reveal";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

const INTRO_STYLE_ID = "faq1-animations";

type Faq = {
  question: string;
  answer: string;
  meta: string;
};

const faqs: Faq[] = [
  {
    question: "What does it cost to create a badge?",
    answer:
      "Only the network fee for the registration transaction. Tessera takes nothing, and there is no fee to mint beyond gas. Writing the artwork onchain is the expensive part of that transaction, which is why the size of your SVG matters.",
    meta: "Cost",
  },
  {
    question: "How large can the artwork be?",
    answer:
      "Aim below roughly 100 KB of SVG. Files are optimized in your browser before registration and the projected onchain size is shown while you work, so you find out before you pay rather than after.",
    meta: "Artwork",
  },
  {
    question: "Can I change the details after registering?",
    answer: `The name, description, date, location, link and artwork are permanent. Two things stay adjustable for the first ${CREATOR_TIMELOCK_DAYS} days: whether the badge is open to everyone, and attaching an invitation list if you registered without one.`,
    meta: "Permanence",
  },
  {
    question: "Which deadlines should I care about?",
    answer: `Two dates. Day ${CREATOR_TIMELOCK_DAYS} is the last day of creator controls, including dropping badges into wallets yourself in batches of up to ${CREATOR_MINT_BATCH_LIMIT}. Day ${SIGNATURE_WINDOW_DAYS} is when codes at the door stop working. Both count from the registration transaction, not from the event date.`,
    meta: "Deadlines",
  },
  {
    question: "Bound to the wallet, or free to move?",
    answer:
      "Set once at registration and never changed afterwards, so decide before you register. Bound is for when the badge is evidence: a certificate that can be resold is not evidence of anything. Transferable is for when the artwork is the point, or when holders will want to consolidate wallets later.",
    meta: "Choices",
  },
  {
    question: "Do I need a wallet just to look around?",
    answer:
      "No. Browsing badges, reading event pages and checking someone's mint all work without connecting. A wallet is needed only to mint or to create.",
    meta: "Access",
  },
  {
    question: "What if Tessera disappears?",
    answer:
      "Your badges do not depend on it. The artwork and the details are in the contract, the code is MIT licensed and public, and anyone can run their own copy of this interface with nothing but a network URL.",
    meta: "Trust",
  },
];

/**
 * The supplied FAQ block, recoloured onto the site tokens and the teal accent.
 * Its own theme toggle and its `bento-theme` storage key are removed in favour
 * of next-themes, so every colour is a token or a `dark:` variant and server
 * and client markup match. Entrance motion is the shared Reveal, so the
 * section animates in on scroll like its neighbours.
 */
const FAQ1 = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes faq1-beam-spin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes faq1-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
      @keyframes faq1-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      @keyframes faq1-tick {
        0%, 30% { transform: translateX(-6px); opacity: 0.4; }
        50% { transform: translateX(2px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      .faq1-section { --faq-glow: rgba(13, 148, 136, 0.12); }
      .dark .faq1-section { --faq-glow: rgba(45, 212, 191, 0.14); }
      .faq1-aurora {
        background: radial-gradient(ellipse 50% 100% at 10% 0%, rgba(13, 148, 136, 0.06), transparent 65%);
      }
      .dark .faq1-aurora {
        background: radial-gradient(ellipse 50% 100% at 10% 0%, rgba(45, 212, 191, 0.08), transparent 65%);
      }
      .faq1-overlay {
        background: linear-gradient(130deg, rgba(0, 0, 0, 0.03) 0%, transparent 70%);
      }
      .dark .faq1-overlay {
        background: linear-gradient(130deg, rgba(255, 255, 255, 0.03) 0%, transparent 65%);
      }
      .faq1-intro {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.85rem 1.4rem;
        border-radius: 9999px;
        overflow: hidden;
        border: 1px solid rgba(23, 23, 23, 0.12);
        background: rgba(250, 250, 250, 0.9);
        color: rgba(23, 23, 23, 0.78);
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.65rem;
        width: 100%;
        max-width: 24rem;
        margin: 0 auto;
        isolation: isolate;
      }
      .dark .faq1-intro {
        border-color: rgba(255, 255, 255, 0.12);
        background: rgba(12, 12, 12, 0.42);
        color: rgba(250, 250, 250, 0.92);
      }
      .faq1-intro__beam,
      .faq1-intro__pulse {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
      }
      .faq1-intro__beam {
        background: conic-gradient(from 180deg, rgba(13, 148, 136, 0.2), transparent 30%, rgba(45, 212, 191, 0.18) 58%, transparent 80%, rgba(13, 148, 136, 0.16));
        animation: faq1-beam-spin 18s linear infinite;
        opacity: 0.55;
      }
      .dark .faq1-intro__beam {
        background: conic-gradient(from 160deg, rgba(45, 212, 191, 0.25), transparent 32%, rgba(94, 234, 212, 0.22) 58%, transparent 78%, rgba(45, 212, 191, 0.18));
      }
      .faq1-intro__pulse {
        border: 1px solid currentColor;
        opacity: 0.25;
        animation: faq1-pulse 3.4s ease-out infinite;
      }
      .faq1-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 600;
        letter-spacing: 0.4em;
      }
      .faq1-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, currentColor 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: faq1-meter 5.8s ease-in-out infinite;
        opacity: 0.7;
      }
      .faq1-intro__tick {
        position: relative;
        z-index: 1;
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 9999px;
        background: currentColor;
        box-shadow: 0 0 0 4px rgba(23, 23, 23, 0.08);
        animation: faq1-tick 3.2s ease-in-out infinite;
      }
      .dark .faq1-intro__tick {
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index));

  const setCardGlow = (event: ReactMouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
  };

  const clearCardGlow = (event: ReactMouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--faq-x");
    target.style.removeProperty("--faq-y");
  };

  return (
    <section
      id="faq"
      className="faq1-section relative scroll-mt-24 overflow-hidden border-t border-border"
    >
      <div className="faq1-aurora absolute inset-0 z-0" aria-hidden="true" />
      <div
        className="faq1-overlay pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:max-w-5xl lg:px-12 lg:py-20">
        <Reveal>
          <div className="faq1-intro">
            <span className="faq1-intro__beam" aria-hidden="true" />
            <span className="faq1-intro__pulse" aria-hidden="true" />
            <span className="faq1-intro__label">Onchain FAQ</span>
            <span className="faq1-intro__meter" aria-hidden="true" />
            <span className="faq1-intro__tick" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal index={1}>
          <header className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.35em] text-fg-tertiary">
              Questions
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              The things creators ask before their first badge
            </h2>
            <p className="max-w-xl text-base leading-7 text-fg-secondary">
              Answers to what actually trips people up: what is permanent, what
              is not, and which deadlines matter.
            </p>
          </header>
        </Reveal>

        <Reveal index={2}>
          <ul className="space-y-4">
            {faqs.map((item, index) => {
              const open = activeIndex === index;
              const buttonId = `faq-trigger-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <li
                  key={item.question}
                  className="group tile-grout relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
                  onMouseMove={setCardGlow}
                  onMouseLeave={clearCardGlow}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                    style={{
                      background:
                        "radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), var(--faq-glow), transparent 70%)",
                    }}
                  />

                  <div className="relative flex items-start gap-6 px-8 pt-7 pb-7">
                    <span
                      aria-hidden="true"
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-all duration-500 group-hover:scale-105"
                    >
                      <span
                        className={`pointer-events-none absolute inset-0 rounded-full border border-teal-400/50 opacity-30 ${
                          open ? "animate-ping" : ""
                        }`}
                      />
                      <svg
                        className={`relative h-5 w-5 text-teal-600 transition-transform duration-500 dark:text-teal-300 ${
                          open ? "rotate-45" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <h3 className="min-w-0">
                          <button
                            type="button"
                            id={buttonId}
                            aria-expanded={open}
                            aria-controls={panelId}
                            onClick={() => toggleQuestion(index)}
                            className="-m-1 cursor-pointer rounded-lg p-1 text-left text-lg font-semibold leading-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 sm:text-xl"
                          >
                            {item.question}
                          </button>
                        </h3>
                        {item.meta ? (
                          <span className="inline-flex w-fit items-center rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-fg-tertiary sm:ml-auto">
                            {item.meta}
                          </span>
                        ) : null}
                      </div>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`overflow-hidden text-base leading-7 text-fg-secondary transition-[max-height] duration-500 ease-out ${
                          open ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <p className="pr-2">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQ1;
export { FAQ1 };
