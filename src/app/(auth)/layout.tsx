interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <main className="flex items-center justify-center h-full">
            {children}
        </main>
    );
};

export default Layout;
