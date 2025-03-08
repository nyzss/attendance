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

interface DailyEntriesProps {
    dayData: DailyAttendance;
}

export function DailyEntries({ dayData }: DailyEntriesProps) {
    const formattedDate = format(new Date(dayData.date), "EEEE, MMMM d, yyyy");

    // Calculate the daily goal (140 hours per month / ~30 days)
    const dailyGoal = 140 / 30;
    const isAboveGoal = dayData.totalMergedHours >= dailyGoal;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            {formattedDate}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            Total hours:{" "}
                            {formatDuration(dayData.totalMergedHours)} (merged)
                            / {formatDuration(dayData.totalRawHours)} (raw)
                        </CardDescription>
                    </div>
                    <Badge variant={isAboveGoal ? "default" : "secondary"}>
                        {isAboveGoal ? "Above" : "Below"} Daily Goal
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">
                                Merged Entries
                            </h3>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                            >
                                <ArrowUpDown className="h-3 w-3" />
                                {dayData.mergedEntries.length} entries
                            </Badge>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
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
                                                    {format(entry.end, "HH:mm")}
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

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">Raw Entries</h3>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                            >
                                <ArrowUpDown className="h-3 w-3" />
                                {dayData.rawEntries.length} entries
                            </Badge>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dayData.rawEntries.length > 0 ? (
                                    dayData.rawEntries.map((entry, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {format(entry.begin, "HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                {format(entry.end, "HH:mm")}
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
                                    ))
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
                </div>
            </CardContent>
        </Card>
    );
}
