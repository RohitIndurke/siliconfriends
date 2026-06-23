"use client";

import { HeroUIProvider } from "@heroui/system";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "inherit",
          },
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
