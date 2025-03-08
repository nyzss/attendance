"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MonthlyAttendance } from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";

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
    const handlePrevious = () => {
        if (selectedMonthIndex > 0) {
            onSelectMonth(selectedMonthIndex - 1);
        }
    };

    const handleNext = () => {
        if (selectedMonthIndex < months.length - 1) {
            onSelectMonth(selectedMonthIndex + 1);
        }
    };

    // Format the month name more nicely
    const formatMonthDisplay = (monthStr: string) => {
        try {
            // Parse the month string (e.g., "January 2023")
            const date = parse(monthStr, "MMMM yyyy", new Date());
            // Format it as "Jan 2023"
            return format(date, "MMM yyyy");
        } catch (e) {
            return monthStr;
        }
    };

    return (
        <div className="flex items-center justify-between bg-card rounded-lg border p-2">
            <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={selectedMonthIndex === 0}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
                {months.map((month, index) => (
                    <Button
                        key={month.monthKey}
                        variant={
                            selectedMonthIndex === index ? "default" : "ghost"
                        }
                        className="px-3"
                        onClick={() => onSelectMonth(index)}
                    >
                        {formatMonthDisplay(month.month)}
                    </Button>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={selectedMonthIndex === months.length - 1}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
