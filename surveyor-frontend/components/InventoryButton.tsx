"use client";

import { useDisclosure } from "@heroui/react";
import InventoryPanel from "./InventoryPanel";
import Button from "./ui/Button";
import { Box } from "lucide-react";

export default function InventoryButton({
    inventoryCount,
    chatRegionRef,
}: {
    chatRegionRef: React.RefObject<HTMLDivElement | null>;
    inventoryCount: number;
}) {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const handleClose = () => {
        onClose();
        chatRegionRef?.current?.focus();
    };

    return (
        <div
            className="w-fit rounded-full bg-white shadow-sm py-2 px-4 border border-gray-200"
            onClick={onOpen}
        >
            <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">
                    Inventory ({inventoryCount})
                </span>
            </div>
            <InventoryPanel
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={handleClose}
            />
        </div>
    );
}
