import { useStore } from "@nanostores/preact";
import { twMerge } from "tailwind-merge";

import { themeList } from "../models/settings";
import { $settings } from "../nanostores/settings";

export function ThemeButton() {
  const { theme } = useStore($settings);

  function handleThemeChange() {
    // find next theme in themeList and set it
    const currentIndex = themeList.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];

    $settings.setKey("theme", nextTheme);
  }

  return (
    <button
      class={twMerge(
        "btn btn-ghost btn-circle swap swap-rotate focus-visible:outline-accent",
        theme === "system" && "swap-default",
        theme === "light" && "swap-active",
        theme === "dark" && "swap-inactive",
        "tooltip tooltip-bottom font-normal",
      )}
      data-tip={`Switch theme (${theme})`}
      onClick={handleThemeChange}
      aria-label="Switch theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 swap-indeterminate [.swap-default>&]:opacity-100"
        fill="none"
        stroke="currentColor"
      >
        <use href="#system" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 swap-on [.swap-default>&]:opacity-0"
        fill="currentColor"
        stroke="none"
      >
        <use href="#day" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 swap-off [.swap-default>&]:opacity-0"
        fill="currentColor"
        stroke="none"
      >
        <use href="#night" />
      </svg>
    </button>
  );
}
