"use client";

import { YearlyAttendance } from "@/lib/dashboard";
import { Button } from "@/components/ui/button";

interface YearSelectorProps {
    years: YearlyAttendance[];
    selectedYearIndex: number;
    onSelectYear: (index: number) => void;
}

export function YearSelector({
    years,
    selectedYearIndex,
    onSelectYear,
}: YearSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2 bg-card rounded-lg border p-2">
            {years.map((year, index) => (
                <Button
                    key={year.year}
                    variant={
                        selectedYearIndex === index ? "default" : "outline"
                    }
                    onClick={() => onSelectYear(index)}
                    className="px-4"
                >
                    {year.year}
                </Button>
            ))}
        </div>
    );
}
