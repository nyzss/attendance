"use client";

import { clientGetAttendance } from "@/lib/attendance";
import { useQuery } from "@tanstack/react-query";
import { useCookieState } from "ahooks";
import { Dashboard } from "@/components/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
    const [sessionToken] = useCookieState("sessionToken");

    const { data, isPending, isError } = useQuery({
        queryKey: ["attendance"],
        queryFn: async () => {
            const data = await clientGetAttendance(String(sessionToken));
            return data;
        },
        enabled: !!sessionToken,
    });

    if (isPending) {
        return (
            <div className="container py-6 px-6 md:px-8 lg:px-12 mx-auto">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-4 w-[300px]" />
                    </div>
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="container py-6 px-6 md:px-8 lg:px-12 mx-auto">
                <div className="max-w-6xl mx-auto space-y-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Failed to fetch attendance data. Please check your
                            session token or try again later.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!data.attendance || data.attendance.length === 0) {
        return (
            <div className="container py-6 px-6 md:px-8 lg:px-12 mx-auto">
                <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-[50vh] space-y-4">
                    <h1 className="text-2xl font-bold">
                        No attendance data available
                    </h1>
                    <p className="text-muted-foreground">
                        No attendance records were found for your account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6 px-6 md:px-8 lg:px-12 mx-auto">
            <Dashboard data={data} />
        </div>
    );
}
