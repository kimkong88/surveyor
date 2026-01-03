"use client";

import { useDisclosure } from "@heroui/react";
import InventoryPanel from "./InventoryPanel";
import Button from "./ui/Button";

export default function InventoryPanelOpenerButton({
    chatRegionRef,
}: {
    chatRegionRef: React.RefObject<HTMLDivElement | null>;
}) {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const handleClose = () => {
        onClose();
        chatRegionRef?.current?.focus();
    };

    return (
        <>
            <Button onPress={onOpen}>Open Inventory</Button>
            <InventoryPanel
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={handleClose}
            />
        </>
    );
}
