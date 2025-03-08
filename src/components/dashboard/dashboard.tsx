"use client";

import { useState, useMemo, useEffect } from "react";
import { Schema } from "@/types/main";
import { processAttendanceData } from "@/lib/dashboard";
import { YearlyOverview } from "./yearly-overview";
import { MonthlyOverview } from "./monthly-overview";
import { DailyEntries } from "./daily-entries";
import { MonthSelector } from "./month-selector";
import { DaySelector } from "./day-selector";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DashboardProps {
    data: Schema;
}

export function Dashboard({ data }: DashboardProps) {
    const queryClient = useQueryClient();
    const yearlyData = useMemo(() => processAttendanceData(data), [data]);

    const [selectedYearIndex, setSelectedYearIndex] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Function to handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await queryClient.invalidateQueries({ queryKey: ["attendance"] });
        toast.success("Attendance data refreshed");
        setIsRefreshing(false);
    };

    // Set default year and month to current date on initial load
    useEffect(() => {
        if (yearlyData.length > 0) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonthKey = format(currentDate, "yyyy-MM");

            // Find the index of the current year
            const yearIndex = yearlyData.findIndex(
                (year) => year.year === currentYear
            );
            if (yearIndex !== -1) {
                setSelectedYearIndex(yearIndex);

                // Find the index of the current month in this year
                const year = yearlyData[yearIndex];
                const monthIndex = year.months.findIndex(
                    (month) => month.monthKey === currentMonthKey
                );
                if (monthIndex !== -1) {
                    setSelectedMonthIndex(monthIndex);
                }
            }
        }
    }, [yearlyData]);

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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Attendance Dashboard</h1>

                    <div className="flex items-center gap-2">
                        {/* Refresh Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh attendance data"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                        </Button>

                        {/* Year Selector as a dropdown */}
                        <Select
                            value={selectedYearIndex.toString()}
                            onValueChange={(value: string) => {
                                const index = parseInt(value);
                                setSelectedYearIndex(index);
                                setSelectedMonthIndex(0);
                                setSelectedDayIndex(0);
                            }}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select Year">
                                    {yearlyData[selectedYearIndex]?.year}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {yearlyData.map((year, index) => (
                                    <SelectItem
                                        key={year.year}
                                        value={index.toString()}
                                    >
                                        {year.year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-muted-foreground">
                    View your attendance hours and entries
                </p>
            </div>

            {/* Unified Dashboard View */}
            <div className="space-y-6">
                {/* Month Selector and Overview */}
                <div className="space-y-4">
                    <MonthSelector
                        months={selectedYear.months}
                        selectedMonthIndex={selectedMonthIndex}
                        onSelectMonth={(index) => {
                            setSelectedMonthIndex(index);
                            setSelectedDayIndex(0);
                        }}
                    />
                    <MonthlyOverview monthData={selectedMonth} />
                </div>

                {/* Day Selector and Entries */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                        <div className="h-full flex flex-col">
                            <div className="flex-1">
                                <DaySelector
                                    days={daysArray}
                                    selectedDayIndex={selectedDayIndex}
                                    onSelectDay={setSelectedDayIndex}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-7">
                        {selectedDay && <DailyEntries dayData={selectedDay} />}
                    </div>
                </div>

                {/* Yearly Overview */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Yearly Overview
                    </h2>
                    <YearlyOverview yearData={selectedYear} />
                </div>
            </div>
        </div>
    );
}
