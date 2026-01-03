"use client";

import { useDisclosure } from "@heroui/react";
import CapturePanel from "./CapturePanel";
import Button from "./ui/Button";

export default function CapturePanelOpenerButton({
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
            <Button onPress={onOpen}>Open Capture</Button>
            <CapturePanel
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={handleClose}
            />
        </>
    );
}
