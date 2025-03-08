"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DailyAttendance, formatDuration } from "@/lib/dashboard";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Clock, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Daily goal in hours (7 hours per day for workdays)
const DAILY_GOAL = 7;

interface DailyEntriesProps {
    dayData: DailyAttendance;
}

export function DailyEntries({ dayData }: DailyEntriesProps) {
    const formattedDate = format(new Date(dayData.date), "EEEE, MMMM d, yyyy");
    const dayOfWeek = format(new Date(dayData.date), "EEEE");

    // Check if it's a weekday (Monday-Friday)
    const isWeekday = !["Saturday", "Sunday"].includes(dayOfWeek);

    // Only apply goal to weekdays
    const dailyGoal = isWeekday ? DAILY_GOAL : 0;
    const isAboveGoal = dayData.totalMergedHours >= dailyGoal;

    // Calculate how much is missing to reach the goal
    const hoursToGoal = Math.max(0, dailyGoal - dayData.totalMergedHours);

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            {formattedDate}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            Total: {formatDuration(dayData.totalMergedHours)}
                        </CardDescription>
                    </div>
                    {isWeekday ? (
                        <Badge variant={isAboveGoal ? "default" : "secondary"}>
                            {isAboveGoal
                                ? "Goal Reached"
                                : `${formatDuration(
                                      hoursToGoal
                                  )} to reach ${DAILY_GOAL}h goal`}
                        </Badge>
                    ) : (
                        <Badge variant="outline">Weekend - No Goal</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="merged">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="merged">Merged Entries</TabsTrigger>
                        <TabsTrigger value="raw">Raw Entries</TabsTrigger>
                    </TabsList>

                    <TabsContent value="merged" className="mt-2">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Start</TableHead>
                                        <TableHead>End</TableHead>
                                        <TableHead>Duration</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dayData.mergedEntries.length > 0 ? (
                                        dayData.mergedEntries.map(
                                            (entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {format(
                                                            entry.begin,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            entry.end,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDuration(
                                                            entry.durationHours
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center text-muted-foreground py-4"
                                            >
                                                No merged entries for this day
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="raw" className="mt-2">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Start</TableHead>
                                        <TableHead>End</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Duration</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dayData.rawEntries.length > 0 ? (
                                        dayData.rawEntries.map(
                                            (entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {format(
                                                            entry.begin,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            entry.end,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {entry.source}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDuration(
                                                            entry.durationHours
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground py-4"
                                            >
                                                No raw entries for this day
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
