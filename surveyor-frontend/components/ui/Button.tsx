"use client";

import { ButtonProps, Button as HeroUIButton } from "@heroui/react";

export default function Button(
    props: ButtonProps & { children: React.ReactNode }
) {
    return <HeroUIButton {...props}>{props.children}</HeroUIButton>;
}
