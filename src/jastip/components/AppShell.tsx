import type { ReactNode } from "react";
import { BrandHeader } from "@/jastip/components/BrandHeader";

interface AppShellProps {
  children: ReactNode;
  largeHeader?: boolean;
}

export function AppShell({ children, largeHeader = false }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper bg-confetti font-body">
      <div className="sticky top-0 z-20 bg-paper/80 backdrop-blur-md">
        <div className={`mx-auto w-full max-w-md px-5 ${largeHeader ? "pb-2 pt-6" : "pb-3 pt-4"}`}>
          <BrandHeader large={largeHeader} />
        </div>
      </div>
      <div key={largeHeader ? "home" : "inner"} className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-3 animate-pop-in">
        {children}
      </div>
    </div>
  );
}
