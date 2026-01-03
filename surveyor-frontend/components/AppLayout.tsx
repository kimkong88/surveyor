import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <header role="banner" aria-label="Application Header" className="w-full p-2">
        <div role="status" aria-label="Status placeholders">
          {/* e.g., network status, session state */}
        </div>
        <div aria-label="Progress placeholder">
          {/* e.g., progress chip */}
        </div>
      </header>
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <footer role="contentinfo" aria-label="Application Footer" className="w-full p-2">
        <div role="group" aria-label="Voice controls" data-testid="voice-controls">
          {/* e.g., mic toggle, captions on/off */}
        </div>
        <div role="group" aria-label="Text controls" data-testid="text-controls">
          {/* e.g., text input toggle */}
        </div>
      </footer>
    </>
  );
}


