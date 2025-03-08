"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyAttendance } from "@/lib/dashboard";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse, startOfMonth } from "date-fns";
import { useMemo } from "react";

interface MonthSelectorProps {
    months: MonthlyAttendance[];
    selectedMonthIndex: number;
    onSelectMonth: (index: number) => void;
}

export function MonthSelector({
    months,
    selectedMonthIndex,
    onSelectMonth,
}: MonthSelectorProps) {
    // Create a map of available months
    const availableMonths = useMemo(() => {
        const monthMap = new Map<string, number>();

        months.forEach((month, index) => {
            monthMap.set(month.monthKey, index);
        });

        return monthMap;
    }, [months]);

    // Get the selected month date
    const selectedMonthDate = useMemo(() => {
        if (months.length === 0 || selectedMonthIndex >= months.length)
            return undefined;

        const monthKey = months[selectedMonthIndex].monthKey; // Format: "yyyy-MM"
        return startOfMonth(parse(monthKey, "yyyy-MM", new Date()));
    }, [months, selectedMonthIndex]);

    const handleSelectMonth = (date: Date | undefined) => {
        if (!date) return;

        const monthKey = format(date, "yyyy-MM");
        const monthIndex = availableMonths.get(monthKey);

        if (monthIndex !== undefined) {
            onSelectMonth(monthIndex);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Select Month</CardTitle>
            </CardHeader>
            <CardContent>
                <DatePicker
                    date={selectedMonthDate}
                    onSelect={handleSelectMonth}
                    placeholder="Select a month"
                />
            </CardContent>
        </Card>
    );
}
