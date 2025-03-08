"use client";

import { useState, useMemo, useEffect } from "react";
import { Schema } from "@/types/main";
import { processAttendanceData } from "@/lib/dashboard";
import { YearlyOverview } from "./yearly-overview";
import { MonthlyOverview } from "./monthly-overview";
import { DailyEntries } from "./daily-entries";
import { DaySelector } from "./day-selector";
import { format, parseISO } from "date-fns";
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
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

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

                    // Find the most recent day with data
                    const month = year.months[monthIndex];
                    const daysArray = Array.from(month.days.values()).sort(
                        (a, b) => b.date.localeCompare(a.date) // Sort in descending order (most recent first)
                    );

                    if (daysArray.length > 0) {
                        // Convert to the format used in the component
                        const sortedDaysForDisplay = Array.from(
                            month.days.values()
                        ).sort(
                            (a, b) => a.date.localeCompare(b.date) // Sort in ascending order for display
                        );

                        // Find the index of the most recent day in the display array
                        const mostRecentDay = daysArray[0];
                        const mostRecentDayIndex =
                            sortedDaysForDisplay.findIndex(
                                (day) => day.date === mostRecentDay.date
                            );

                        if (mostRecentDayIndex !== -1) {
                            setSelectedDayIndex(mostRecentDayIndex);
                        }
                    }
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
        <div className="flex flex-col gap-6">
            {/* Month title at the very top */}
            <div className="sticky top-3 z-10 py-2">
                <h1 className="text-2xl font-bold">{selectedMonth.month}</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left sidebar with selectors */}
                <div className="md:sticky md:top-14 md:self-start md:w-64 border rounded-lg bg-card shadow-sm">
                    <div className="p-4 space-y-6">
                        {/* Dashboard Title */}
                        <div>
                            <h2 className="text-xl font-bold mb-1">
                                Dashboard
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                View your attendance
                            </p>
                        </div>

                        {/* Year Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Select
                                value={selectedYearIndex.toString()}
                                onValueChange={(value: string) => {
                                    const index = parseInt(value);
                                    setSelectedYearIndex(index);
                                    setSelectedMonthIndex(0);
                                    setSelectedDayIndex(0);
                                }}
                            >
                                <SelectTrigger className="w-full">
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

                        {/* Month Selector - Vertical List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Month
                                </label>
                            </div>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                                {selectedYear.months.map((month, index) => (
                                    <button
                                        key={month.monthKey}
                                        onClick={() => {
                                            setSelectedMonthIndex(index);
                                            setSelectedDayIndex(0);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                                            selectedMonthIndex === index
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted"
                                        }`}
                                    >
                                        {month.month}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Refresh Button - More Intuitive */}
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                            <span>
                                {isRefreshing
                                    ? "Refreshing..."
                                    : "Refresh Data"}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 max-w-4xl space-y-6">
                    {/* Monthly Overview Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Attendance Overview</CardTitle>
                                <CardDescription>
                                    View your attendance hours
                                </CardDescription>
                            </div>
                            <div className="text-sm font-medium">
                                Total:{" "}
                                {selectedMonth.totalMergedHours.toFixed(1)}{" "}
                                hours
                            </div>
                        </CardHeader>
                        <CardContent>
                            <MonthlyOverview monthData={selectedMonth} />
                        </CardContent>
                    </Card>

                    {/* Day Selector and Entries */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                            <Card className="h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle>Daily View</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DaySelector
                                        days={daysArray}
                                        selectedDayIndex={selectedDayIndex}
                                        onSelectDay={setSelectedDayIndex}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-7">
                            {selectedDay && (
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle>Daily Entries</CardTitle>
                                        <CardDescription>
                                            {format(
                                                parseISO(selectedDay.date),
                                                "EEEE, MMMM d, yyyy"
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <DailyEntries dayData={selectedDay} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Yearly Overview */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Yearly Overview</CardTitle>
                            <CardDescription>
                                {yearlyData[selectedYearIndex]?.year} attendance
                                summary
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <YearlyOverview yearData={selectedYear} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
