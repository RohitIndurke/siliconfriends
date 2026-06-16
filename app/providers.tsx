"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider toastProps={{ classNames: { base: "z-[9999]" } }} />
      {children}
    </HeroUIProvider>
  );
}
