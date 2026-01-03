"use client";

import { useRef } from "react";
import CapturePanelOpenerButton from "../../components/CapturePanelOpenerButton";
import InventoryPanelOpenerButton from "../../components/InventoryPanelOpenerButton";

export default function ConversationPage() {
    const chatRegionRef = useRef<HTMLDivElement | null>(null);

    return (
        <section aria-labelledby="conversation-title" className="p-4 relative">
            <h1 id="conversation-title">Conversation</h1>

            <div
                ref={chatRegionRef}
                tabIndex={-1}
                aria-label="Chat messages"
                className="mt-2 outline-none"
            >
                <p>Assistant and user messages will appear here.</p>
            </div>

            <div className="mt-4 flex gap-2">
                <CapturePanelOpenerButton chatRegionRef={chatRegionRef} />
                <InventoryPanelOpenerButton chatRegionRef={chatRegionRef} />
            </div>
        </section>
    );
}
