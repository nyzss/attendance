"use client";

import { clientGetAttendance } from "@/lib/attendance";
import { useQuery } from "@tanstack/react-query";
import { useCookieState } from "ahooks";

export default function DashboardPage() {
    const [sessionToken] = useCookieState("sessionToken");

    const { data, isPending } = useQuery({
        queryKey: ["attendance"],
        queryFn: async () => {
            const data = await clientGetAttendance(String(sessionToken));
            return data;
        },
        enabled: !!sessionToken,
    });

    if (isPending || !data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{data.attendance?.length}</h1>
        </div>
    );
}
