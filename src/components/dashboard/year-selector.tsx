"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { YearlyAttendance } from "@/lib/dashboard";

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
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                    {years.map((year, index) => (
                        <Button
                            key={year.year}
                            variant={
                                selectedYearIndex === index
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => onSelectYear(index)}
                        >
                            {year.year}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
