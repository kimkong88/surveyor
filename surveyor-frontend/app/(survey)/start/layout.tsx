import ResponsiveLayout from "components/layout/ResponsiveLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ResponsiveLayout>{children}</ResponsiveLayout>;
}
