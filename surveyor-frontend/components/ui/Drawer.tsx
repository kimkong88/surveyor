"use client";

import {
    Drawer as HeroUIDrawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@heroui/react";

type DrawerProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
};

export default function Drawer({
    isOpen,
    onOpenChange,
    children,
    title,
}: DrawerProps) {
    return (
        <HeroUIDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
                {title && (
                    <DrawerHeader>
                        <h2>{title}</h2>
                    </DrawerHeader>
                )}
                <DrawerBody className="mt-2">{children}</DrawerBody>
            </DrawerContent>
        </HeroUIDrawer>
    );
}
