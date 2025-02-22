"use client";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Provider } from "react-redux";
import { store } from "./store";
import { useRouter } from "next/navigation";

export default function ClientWrapper({ children }) {
    const [hasToken, setHasToken] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const checkToken = () => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                setHasToken(!!token);
                if (!token) {
                    router.push('/login');
                }
            }
        };
        checkToken();
        window.addEventListener("storage", checkToken);
        return () => {
            window.removeEventListener("storage", checkToken);
        };
    }, []);

    if (!hasToken) return (
        <Provider store={store}>
            {children}
        </Provider>
    );

    return (
        <Provider store={store}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </Provider>
    );
}
