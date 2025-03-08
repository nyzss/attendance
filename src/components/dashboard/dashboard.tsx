"use client";

import { useState, useMemo } from "react";
import { Schema } from "@/types/main";
import { processAttendanceData } from "@/lib/dashboard";
import { YearlyOverview } from "./yearly-overview";
import { MonthlyOverview } from "./monthly-overview";
import { DailyEntries } from "./daily-entries";
import { YearSelector } from "./year-selector";
import { MonthSelector } from "./month-selector";
import { DaySelector } from "./day-selector";

interface DashboardProps {
    data: Schema;
}

export function Dashboard({ data }: DashboardProps) {
    const yearlyData = useMemo(() => processAttendanceData(data), [data]);

    const [selectedYearIndex, setSelectedYearIndex] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // If no data, show a message
    if (yearlyData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-xl text-muted-foreground">
                    No attendance data available
                </p>
            </div>
        );
    }

    const selectedYear = yearlyData[selectedYearIndex];
    const selectedMonth = selectedYear.months[selectedMonthIndex];

    // Convert the Map to an array for easier rendering
    const daysArray = Array.from(selectedMonth.days.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    const selectedDay = daysArray[selectedDayIndex];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid gap-2">
                <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
                <p className="text-muted-foreground">
                    View your attendance hours and entries
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year Selector */}
                <div className="md:col-span-3">
                    <YearSelector
                        years={yearlyData}
                        selectedYearIndex={selectedYearIndex}
                        onSelectYear={(index) => {
                            setSelectedYearIndex(index);
                            setSelectedMonthIndex(0);
                            setSelectedDayIndex(0);
                        }}
                    />
                </div>

                {/* Yearly Overview */}
                <div className="md:col-span-3">
                    <YearlyOverview yearData={selectedYear} />
                </div>

                {/* Month Selector */}
                <div className="md:col-span-3">
                    <MonthSelector
                        months={selectedYear.months}
                        selectedMonthIndex={selectedMonthIndex}
                        onSelectMonth={(index) => {
                            setSelectedMonthIndex(index);
                            setSelectedDayIndex(0);
                        }}
                    />
                </div>

                {/* Monthly Overview */}
                <div className="md:col-span-3">
                    <MonthlyOverview monthData={selectedMonth} />
                </div>

                {/* Day Selector */}
                <div className="md:col-span-3">
                    <DaySelector
                        days={daysArray}
                        selectedDayIndex={selectedDayIndex}
                        onSelectDay={setSelectedDayIndex}
                    />
                </div>

                {/* Daily Entries */}
                {selectedDay && (
                    <div className="md:col-span-3">
                        <DailyEntries dayData={selectedDay} />
                    </div>
                )}
            </div>
        </div>
    );
}
