import ResponsiveLayout from "components/layout/ResponsiveLayout";
import ProgressHeader from "components/ProgressHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProgressHeader />
            <ResponsiveLayout>{children}</ResponsiveLayout>
        </>
    );
}
