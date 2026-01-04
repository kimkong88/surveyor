"use client";

import Drawer from "./ui/Drawer";

export default function CapturePanel({
    isOpen,
    onOpenChange,
    onClose,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}) {
    return (
        <Drawer
            placement="bottom"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            title="Capture"
        >
            CapturePanel
        </Drawer>
    );
}
