import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

import "./navigationStyle.css";

const MainLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full">
            <div className="sidebar z-30">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
            {children}
            </main>
        </div>
    )
}

export default MainLayout;