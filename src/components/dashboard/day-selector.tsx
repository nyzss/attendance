"use client";

import { DailyAttendance } from "@/lib/dashboard";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
    days: DailyAttendance[];
    selectedDayIndex: number;
    onSelectDay: (index: number) => void;
}

export function DaySelector({
    days,
    selectedDayIndex,
    onSelectDay,
}: DaySelectorProps) {
    // Create a map of dates with attendance data
    const daysWithData = useMemo(() => {
        const dateMap = new Map<string, { index: number; hours: number }>();

        days.forEach((day, index) => {
            const dateStr = format(new Date(day.date), "yyyy-MM-dd");
            dateMap.set(dateStr, {
                index,
                hours: day.totalMergedHours,
            });
        });

        return dateMap;
    }, [days]);

    // Get all days in the month
    const daysInMonth = useMemo(() => {
        // Get the month from the first day (assuming all days are from the same month)
        const monthDate = days.length > 0 ? new Date(days[0].date) : new Date();
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        return eachDayOfInterval({ start, end });
    }, [days]);

    // Get day names for the header
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the selected date
    const selectedDate = days[selectedDayIndex]?.date
        ? new Date(days[selectedDayIndex].date)
        : undefined;

    // Handle day selection
    const handleSelectDay = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayData = daysWithData.get(dateStr);

        if (dayData) {
            onSelectDay(dayData.index);
        }
    };

    return (
        <div className="h-full">
            <div className="grid grid-cols-7 gap-1 mb-3">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Add empty cells for days before the first day of the month */}
                {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
                    <div key={`empty-start-${i}`} className="h-12" />
                ))}

                {/* Render all days in the month */}
                {daysInMonth.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayData = daysWithData.get(dateStr);
                    const isSelected =
                        selectedDate && isSameDay(date, selectedDate);
                    const hasHours = dayData && dayData.hours > 0;

                    return (
                        <button
                            key={dateStr}
                            className={cn(
                                "h-12 w-full rounded-md flex items-center justify-center relative",
                                isSelected &&
                                    "bg-primary text-primary-foreground",
                                !isSelected &&
                                    hasHours &&
                                    "bg-primary/10 hover:bg-primary/20",
                                !isSelected && !hasHours && "hover:bg-muted"
                            )}
                            onClick={() => dayData && handleSelectDay(date)}
                            disabled={!dayData}
                        >
                            <span className="text-md">{date.getDate()}</span>
                            {hasHours && !isSelected && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            {hasHours && (
                                <span className="absolute top-1 right-1 text-[8px] text-foreground/70">
                                    {Math.round(dayData.hours)}h
                                </span>
                            )}
                        </button>
                    );
                })}

                {/* Add empty cells for days after the last day of the month */}
                {Array.from({
                    length: 6 - daysInMonth[daysInMonth.length - 1].getDay(),
                }).map((_, i) => (
                    <div key={`empty-end-${i}`} className="h-12" />
                ))}
            </div>
        </div>
    );
}
