"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
