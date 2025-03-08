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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardProps {
    data: Schema;
}

export function Dashboard({ data }: DashboardProps) {
    const yearlyData = useMemo(() => processAttendanceData(data), [data]);

    const [selectedYearIndex, setSelectedYearIndex] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("yearly");

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

            {/* Year Selector */}
            <YearSelector
                years={yearlyData}
                selectedYearIndex={selectedYearIndex}
                onSelectYear={(index) => {
                    setSelectedYearIndex(index);
                    setSelectedMonthIndex(0);
                    setSelectedDayIndex(0);
                }}
            />

            {/* Tabs for different views */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="yearly">Yearly Overview</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly View</TabsTrigger>
                    <TabsTrigger value="daily">Daily Details</TabsTrigger>
                </TabsList>

                {/* Yearly Overview Tab */}
                <TabsContent value="yearly" className="mt-4 space-y-4">
                    <YearlyOverview yearData={selectedYear} />
                </TabsContent>

                {/* Monthly View Tab */}
                <TabsContent value="monthly" className="mt-4 space-y-4">
                    <MonthSelector
                        months={selectedYear.months}
                        selectedMonthIndex={selectedMonthIndex}
                        onSelectMonth={(index) => {
                            setSelectedMonthIndex(index);
                            setSelectedDayIndex(0);
                        }}
                    />
                    <MonthlyOverview monthData={selectedMonth} />
                </TabsContent>

                {/* Daily Details Tab */}
                <TabsContent value="daily" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <MonthSelector
                                months={selectedYear.months}
                                selectedMonthIndex={selectedMonthIndex}
                                onSelectMonth={(index) => {
                                    setSelectedMonthIndex(index);
                                    setSelectedDayIndex(0);
                                }}
                            />
                            <div className="mt-4">
                                <DaySelector
                                    days={daysArray}
                                    selectedDayIndex={selectedDayIndex}
                                    onSelectDay={setSelectedDayIndex}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            {selectedDay && (
                                <DailyEntries dayData={selectedDay} />
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
