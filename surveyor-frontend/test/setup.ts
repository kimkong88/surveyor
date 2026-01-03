import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
    Geist: () => ({ variable: "" }),
    Geist_Mono: () => ({ variable: "" }),
}));
