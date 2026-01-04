export default function ResponsiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="max-w-lg mx-auto p-6">{children}</div>;
}
