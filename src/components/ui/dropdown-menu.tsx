"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Type for clickable trigger elements that can accept onClick
type ClickableTrigger = React.ReactElement<{
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  [key: string]: unknown;
}>;

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

export function DropdownMenu({ children, trigger, className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // Use mousedown to catch clicks before they bubble
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Clone trigger to add onClick handler with proper type narrowing
  const triggerWithHandler = React.isValidElement(trigger)
    ? (() => {
        const clickableTrigger = trigger as ClickableTrigger;
        const originalOnClick = clickableTrigger.props.onClick;
        
        return React.cloneElement(clickableTrigger, {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            // Call original onClick if it exists
            originalOnClick?.(e);
            // Then handle toggle
            handleToggle(e);
          },
          "aria-expanded": open,
          "aria-haspopup": "menu",
        });
      })()
    : trigger;

  return (
    <div className="relative" ref={menuRef}>
      {triggerWithHandler}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full z-50 mt-1 min-w-[8rem] rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // Type for menu item children that can accept onAction
              type MenuItemChild = React.ReactElement<{
                onAction?: () => void;
                [key: string]: unknown;
              }>;
              const menuItemChild = child as MenuItemChild;
              return React.cloneElement(menuItemChild, {
                onAction: () => {
                  setOpen(false);
                },
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  onAction,
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  onAction?: () => void;
}) {
  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onClick?.(e);
    // Close menu after action (with slight delay to allow onClick to complete)
    setTimeout(() => {
      onAction?.();
    }, 0);
  };

  return (
    <div
      role="menuitem"
      className={cn(
        "cursor-pointer rounded-sm px-2 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

