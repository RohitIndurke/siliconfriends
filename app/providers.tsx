"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          classNames: {
            base: "z-[9999] shadow-lg",
          },
        }}
      />
      <style>{`
        .toast--success {
          background-color: #f0fdf4 !important;
          border-color: #bbf7d0 !important;
        }
        .toast--success .toast__title {
          color: #15803d !important;
        }
        .toast--success .toast__description {
          color: #166534 !important;
        }
        .toast--success .toast__indicator {
          color: #16a34a !important;
        }
        .toast--danger {
          background-color: #fff1f2 !important;
          border-color: #fecdd3 !important;
        }
        .toast--danger .toast__title {
          color: #be123c !important;
        }
        .toast--danger .toast__description {
          color: #9f1239 !important;
        }
        .toast--danger .toast__indicator {
          color: #e11d48 !important;
        }
        .toast {
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
      `}</style>
      {children}
    </HeroUIProvider>
  );
}
