"use client";

import { useRef } from "react";
import CapturePanelOpenerButton from "../../../components/CapturePanelOpenerButton";
import InventoryPanelOpenerButton from "../../../components/InventoryPanelOpenerButton";
import InventoryButton from "../../../components/InventoryButton";

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
            {/** Bottom floating action button */}
            <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-center">
                <InventoryButton
                    inventoryCount={0}
                    chatRegionRef={chatRegionRef}
                />
            </div>
        </section>
    );
}
