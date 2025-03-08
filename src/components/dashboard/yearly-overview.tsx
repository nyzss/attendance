"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    YearlyAttendance,
    createYearlyChartData,
    formatDuration,
} from "@/lib/dashboard";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceLine,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { CalendarDays } from "lucide-react";

// Monthly goal in hours (7 hours per day, 5 days a week, ~4 weeks per month)
const DAILY_GOAL = 7;
const WEEKLY_GOAL = DAILY_GOAL * 5;
const MONTHLY_GOAL = WEEKLY_GOAL * 4; // Approximately 140 hours

interface YearlyOverviewProps {
    yearData: YearlyAttendance;
}

export function YearlyOverview({ yearData }: YearlyOverviewProps) {
    const chartData = createYearlyChartData(yearData).map((month) => ({
        ...month,
        goal: MONTHLY_GOAL,
        // Calculate how much over/under the goal
        difference: month.hours - MONTHLY_GOAL,
    }));

    const chartConfig = {
        hours: {
            label: "Actual Hours",
            color: "hsl(var(--chart-1))",
        },
        goal: {
            label: `Goal (${MONTHLY_GOAL}h)`,
            color: "hsl(var(--chart-3))",
        },
        difference: {
            label: "Difference",
            color: "hsl(var(--chart-2))",
        },
    };

    // Calculate total hours vs total goal for the year
    const totalMonths = chartData.length;
    const totalGoalHours = MONTHLY_GOAL * totalMonths;
    const totalActualHours = yearData.totalMergedHours;
    const totalDifference = totalActualHours - totalGoalHours;

    // Format the difference with a + sign for positive values
    const formatDifference = (value: number) => {
        return value >= 0 ? `+${formatDuration(value)}` : formatDuration(value);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            {yearData.year} Attendance Overview
                        </CardTitle>
                        <CardDescription>
                            Total hours:{" "}
                            {formatDuration(yearData.totalMergedHours)} vs Goal:{" "}
                            {formatDuration(totalGoalHours)}(
                            {formatDifference(totalDifference)})
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value.split(" ")[0].slice(0, 3)
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${Math.round(value)}h`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ReferenceLine
                            y={MONTHLY_GOAL}
                            stroke="rgba(255, 0, 0, 0.5)"
                            strokeDasharray="3 3"
                            label={{
                                value: `${MONTHLY_GOAL}h Goal`,
                                position: "right",
                            }}
                        />
                        <Bar
                            dataKey="hours"
                            fill="var(--color-hours)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
