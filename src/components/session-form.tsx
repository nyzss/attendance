"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CheckCircle, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCookieState } from "ahooks";
import { clientGetAttendance } from "@/lib/attendance";

const formSchema = z.object({
    sessionToken: z.string().min(1, {
        message: "Session token is required",
    }),
});

export default function SessionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sessionToken, setCookie] = useCookieState("sessionToken");
    const [isCheckingToken, setIsCheckingToken] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sessionToken: "",
        },
    });

    // Check if existing token is valid
    useEffect(() => {
        async function checkExistingToken() {
            if (sessionToken) {
                setIsCheckingToken(true);
                const attendance = await clientGetAttendance(
                    String(sessionToken)
                );
                setIsTokenValid(!!attendance);
                setIsCheckingToken(false);
            }
        }

        checkExistingToken();
    }, [sessionToken]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        setCookie(values.sessionToken);

        const attendance = await clientGetAttendance(values.sessionToken);

        if (!attendance) {
            toast.error("Invalid session token");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        toast.success("Session token saved");
        router.push("/dashboard");
    }

    function handleClearToken() {
        setCookie("");
        setIsTokenValid(false);
        toast.success("Session token cleared");
    }

    function handleUseExistingToken() {
        router.push("/dashboard");
    }

    return (
        <div className="w-full">
            {/* Banner for existing token */}
            {sessionToken && (
                <Card className="w-full mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {isCheckingToken ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Checking existing session...
                                        </span>
                                    ) : isTokenValid ? (
                                        <span className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="h-5 w-5" />
                                            Valid session token found
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-amber-600">
                                            <AlertTriangle className="h-5 w-5" />
                                            Existing session token may be
                                            invalid
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isTokenValid
                                        ? "You already have a valid session token. Would you like to use it?"
                                        : "You have an existing session token, but it might not be valid anymore."}
                                </p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                {isTokenValid && (
                                    <Button
                                        variant="default"
                                        onClick={handleUseExistingToken}
                                        className="flex-1 md:flex-none"
                                    >
                                        Use Existing Token
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={handleClearToken}
                                    className="flex-1 md:flex-none"
                                >
                                    Clear Token
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>
                            Attendance tracker but it{" "}
                            <span className="text-green-600">works</span> this
                            time™
                        </CardTitle>
                        <CardDescription>
                            Enter your 42 session token to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="sessionToken"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Session Token</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Paste your session token here"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex gap-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">
                                            Privacy Notice
                                        </p>
                                        <p className="mt-1">
                                            Your session token is stored locally
                                            in your browser only. We do not
                                            store it on our servers. It is only
                                            sent to make calls to the official
                                            42 API. This project is open source
                                            and you can verify how your data is
                                            handled at{" "}
                                            <a
                                                href="https://github.com/nyzss/attendance"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline font-medium"
                                            >
                                                github.com/nyzss/attendance
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Processing..."
                                        : "Continue"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            How to get your session token
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-700">
                        <ol className="list-decimal list-inside space-y-3">
                            <li>
                                Go to{" "}
                                <a
                                    href="https://dashboard.42paris.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    dashboard.42paris.fr
                                </a>{" "}
                                and log in
                            </li>
                            <li>
                                Open Chrome DevTools (right-click and select
                                &quot;Inspect&quot; or press F12)
                            </li>
                            <li>Go to the &quot;Application&quot; tab</li>
                            <li>
                                In the left sidebar, expand &quot;Cookies&quot;
                                and select the 42 dashboard site
                            </li>
                            <li>
                                Find the cookie named &quot;session&quot; and
                                copy its value
                            </li>
                            <li>Paste the value in the form on the left</li>
                        </ol>
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 mt-4">
                            <p className="font-medium">
                                Important Security Warning
                            </p>
                            <p className="mt-1">
                                Never share your session token with anyone else
                                or on any other website! (i hope this is
                                obvious, but i had to say it)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
