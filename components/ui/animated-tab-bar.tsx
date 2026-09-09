"use client";

import * as React from "react";
import { useState, useRef, useLayoutEffect, useCallback } from "react";

export interface TabItem {
  icon: React.ReactNode;
  color: string;
  /** Becomes the button's aria-label, required when the bar is icon-only. */
  label?: string;
}

export interface AnimatedTabBarProps {
  items: TabItem[];
  defaultIndex?: number;
  /** Controlled active tab. Omit to let the bar manage its own state. */
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

/**
 * The animated tab bar: a pill bar whose wave swell (menu__border, a filled
 * svg curve) rides the top edge and glides to the active item, while that
 * item's icon lifts into the swell and draws itself in via the strok
 * keyframe. The swell position is a translate3d computed from viewport
 * rects on both sides of the subtraction, so no ancestor chain or scroll
 * state can shift it, and the travel is clamped to the menu's own width so
 * the curve can never spill past the bar or off the screen. Resizes set
 * --timeOut to none, which invalidates the border's transition declaration
 * and makes the reposition snap; the next click removes the property so the
 * glide returns.
 */
export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  defaultIndex = 0,
  activeIndex,
  onTabChange,
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const active = activeIndex !== undefined ? activeIndex : internalIndex;
  const menuRef = useRef<HTMLMenuElement>(null);
  const menuBorderRef = useRef<SVGSVGElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const offsetMenuBorder = useCallback(() => {
    const activeItem = itemRefs.current[active];
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;

    if (activeItem && menu && menuBorder) {
      const menuRect = menu.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const borderRect = menuBorder.getBoundingClientRect();
      const left = Math.floor(
        itemRect.left -
          menuRect.left -
          (borderRect.width - itemRect.width) / 2
      );
      const minLeft = 0;
      const maxLeft = Math.max(minLeft, menu.clientWidth - borderRect.width);
      menuBorder.style.transform = `translate3d(${Math.min(maxLeft, Math.max(minLeft, left))}px, 0, 0)`;
    }
  }, [active]);

  useLayoutEffect(() => {
    offsetMenuBorder();
    const handleResize = () => {
      if (menuRef.current) {
        const menuStyle = menuRef.current.style;
        menuStyle.setProperty("--timeOut", "none");
      }
      offsetMenuBorder();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [offsetMenuBorder]);

  const handleItemClick = (index: number) => {
    if (menuRef.current) {
      const menuStyle = menuRef.current.style;
      menuStyle.removeProperty("--timeOut");
    }
    if (active === index) return;
    if (activeIndex === undefined) {
      setInternalIndex(index);
    }
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <menu className="menu" ref={menuRef}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`menu__item ${active === index ? "active" : ""}`}
          style={{ "--bgColorItem": item.color } as React.CSSProperties}
          onClick={() => handleItemClick(index)}
          aria-label={item.label ?? `Tab ${index + 1}`}
          aria-current={active === index ? "page" : undefined}
          >
            {item.icon}
            {item.label ? <span className="menu__label">{item.label}</span> : null}
          </button>
      ))}
      <svg
        className="menu__border"
        viewBox="0 0 202.9 45.5"
        aria-hidden="true"
        ref={menuBorderRef}
      >
        <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7 c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5 c9.2,3.6,17.6,4.2,23.3,4H6.7z" />
      </svg>
    </menu>
  );
};
