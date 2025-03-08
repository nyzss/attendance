"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    sessionToken: z.string().min(1, {
        message: "Session token is required",
    }),
});

export default function SessionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sessionToken: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        localStorage.setItem("sessionToken", values.sessionToken);

        setTimeout(() => {
            setIsSubmitting(false);
            // router.push("/dashboard");
        }, 1000);
    }

    return (
        <div className="w-full">
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
                                                href="https://github.com/nyzss"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline font-medium"
                                            >
                                                github.com/nyzss
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
                                "Inspect" or press F12)
                            </li>
                            <li>Go to the "Application" tab</li>
                            <li>
                                In the left sidebar, expand "Cookies" and select
                                the 42 dashboard site
                            </li>
                            <li>
                                Find the cookie named "session" and copy its
                                value
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
