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
import { CalendarIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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

    // Get sources for merged entries
    const getMergedEntrySources = (index: number) => {
        // Find all raw entries that overlap with this merged entry
        const mergedEntry = dayData.mergedEntries[index];
        const sources = new Set<string>();

        dayData.rawEntries.forEach((rawEntry) => {
            // Check if this raw entry overlaps with the merged entry
            const rawStart = rawEntry.begin.getTime();
            const rawEnd = rawEntry.end.getTime();
            const mergedStart = mergedEntry.begin.getTime();
            const mergedEnd = mergedEntry.end.getTime();

            // Check for overlap
            if (rawStart <= mergedEnd && rawEnd >= mergedStart) {
                sources.add(rawEntry.source);
            }
        });

        return Array.from(sources);
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        <h3 className="text-lg font-medium">{formattedDate}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Total: {formatDuration(dayData.totalMergedHours)}
                    </div>
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
                                    <TableHead className="w-[80px]">
                                        Start
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                        End
                                    </TableHead>
                                    <TableHead>Sources</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Duration
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <ScrollArea className="h-[250px]">
                            <Table>
                                <TableBody>
                                    {dayData.mergedEntries.length > 0 ? (
                                        dayData.mergedEntries.map(
                                            (entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[80px]">
                                                        {format(
                                                            entry.begin,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="w-[80px]">
                                                        {format(
                                                            entry.end,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {getMergedEntrySources(
                                                                index
                                                            ).map(
                                                                (source, i) => (
                                                                    <Badge
                                                                        key={i}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {source}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="w-[100px] text-right">
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
                                                No merged entries for this day
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </TabsContent>

                <TabsContent value="raw" className="mt-2">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">
                                        Start
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                        End
                                    </TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Duration
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <ScrollArea className="h-[250px]">
                            <Table>
                                <TableBody>
                                    {dayData.rawEntries.length > 0 ? (
                                        dayData.rawEntries.map(
                                            (entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[80px]">
                                                        {format(
                                                            entry.begin,
                                                            "HH:mm"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="w-[80px]">
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
                                                    <TableCell className="w-[100px] text-right">
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
                        </ScrollArea>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
