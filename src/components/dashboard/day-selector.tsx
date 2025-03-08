"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyAttendance } from "@/lib/dashboard";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

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

    // Get the month from the first day (assuming all days are from the same month)
    const monthDate = days.length > 0 ? new Date(days[0].date) : new Date();

    // Get the selected date
    const selectedDate = days[selectedDayIndex]?.date
        ? new Date(days[selectedDayIndex].date)
        : undefined;

    // Custom day rendering to highlight days with data
    const modifiers = useMemo(() => {
        const hasData = days.map((day) => new Date(day.date));
        return { hasData };
    }, [days]);

    const modifiersClassNames = {
        hasData: "bg-primary/10 font-medium",
    };

    const handleSelect = (date: Date | undefined) => {
        if (!date) return;

        const dateStr = format(date, "yyyy-MM-dd");
        const dayData = daysWithData.get(dateStr);

        if (dayData) {
            onSelectDay(dayData.index);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Select Day</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    className="rounded-md border"
                    month={monthDate}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                />
            </CardContent>
        </Card>
    );
}
