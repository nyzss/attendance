"use client";

import React from "react";
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
    LabelList,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { CalendarDays, TrendingUp } from "lucide-react";

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

    // Calculate percentage of goal achieved
    const goalPercentage = Math.min(
        100,
        (totalActualHours / totalGoalHours) * 100
    );

    return (
        <div className="w-full">
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    <h3 className="text-lg font-medium">
                        {yearData.year} Monthly Breakdown
                    </h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Total hours: {formatDuration(yearData.totalMergedHours)} vs
                    Goal: {formatDuration(totalGoalHours)} (
                    {formatDifference(totalDifference)})
                </p>
            </div>

            <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[300px] w-full"
            >
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 12,
                        left: 12,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                            value.split(" ")[0].slice(0, 3)
                        }
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${Math.round(value)}h`}
                        domain={[0, "auto"]}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                className="w-[180px]"
                                formatter={(value, name) => [
                                    <span key={name} className="font-bold">
                                        Actual Hours:{" "}
                                    </span>,
                                    `${Math.round(Number(value))}h`,
                                ]}
                            />
                        }
                    />
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
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={4}>
                        <LabelList
                            dataKey="hours"
                            position="top"
                            formatter={(value: number) => Math.round(value)}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>

            <div className="flex flex-col mt-4 gap-2 text-sm">
                <div className="flex gap-2 font-medium">
                    {goalPercentage >= 100
                        ? "Yearly goal achieved!"
                        : `${Math.round(goalPercentage)}% of yearly goal`}
                    {goalPercentage >= 100 && (
                        <TrendingUp className="h-4 w-4" />
                    )}
                </div>
                <div className="text-muted-foreground">
                    Showing monthly attendance for {yearData.year}
                </div>
            </div>
        </div>
    );
}
