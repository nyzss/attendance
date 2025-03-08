"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [sessionToken, setSessionToken] = useState<string>();

    useEffect(() => {
        const sessionToken = window.localStorage.getItem("sessionToken");

        if (!sessionToken) {
            router.push("/");
        }

        setSessionToken(sessionToken ?? undefined);
    }, []);

    return (
        <div>
            <h1>{sessionToken}</h1>
        </div>
    );
}
