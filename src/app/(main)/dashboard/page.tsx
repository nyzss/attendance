"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookieState } from "ahooks";

export default function DashboardPage() {
    const router = useRouter();
    const [sessionToken] = useCookieState("sessionToken");

    useEffect(() => {
        if (!sessionToken) {
            router.push("/");
        }
    }, [sessionToken]);

    return (
        <div>
            <h1>{sessionToken}</h1>
        </div>
    );
}
