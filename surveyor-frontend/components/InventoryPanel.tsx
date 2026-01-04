"use client";

import Drawer from "./ui/Drawer";

export default function InventoryPanel({
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
            size="full"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            title="Inventory"
        >
            InventoryPanel
        </Drawer>
    );
}
