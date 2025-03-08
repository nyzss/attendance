"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const sessionToken = window.localStorage.getItem("sessionToken");

        if (!sessionToken) {
            toast.error("No session token found");
            router.push("/");
        }
    }, []);

    return <div>{children}</div>;
}
