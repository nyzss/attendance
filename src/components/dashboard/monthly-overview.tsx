"use client";

import React from "react";
import {
    MonthlyAttendance,
    mapToChartData,
    formatDuration,
} from "@/lib/dashboard";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceLine,
    RadialBar,
    RadialBarChart,
    PolarAngleAxis,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Clock } from "lucide-react";

// Monthly goal in hours (7 hours per day, 5 days a week, ~4 weeks per month)
const DAILY_GOAL = 7;
const WEEKLY_GOAL = DAILY_GOAL * 5;
const MONTHLY_GOAL = WEEKLY_GOAL * 4; // Approximately 140 hours

interface MonthlyOverviewProps {
    monthData: MonthlyAttendance;
}

export function MonthlyOverview({ monthData }: MonthlyOverviewProps) {
    const chartData = mapToChartData(monthData.days);

    const chartConfig = {
        hours: {
            label: "Hours",
            color: "hsl(var(--chart-1))",
        },
    };

    // Calculate progress percentage
    const progressPercentage = Math.min(
        100,
        (monthData.totalMergedHours / MONTHLY_GOAL) * 100
    );

    // Data for radial chart
    const radialData = [
        {
            name: "Goal",
            value: progressPercentage,
            fill:
                progressPercentage >= 100
                    ? "hsl(var(--success))"
                    : progressPercentage >= 75
                    ? "hsl(var(--warning))"
                    : "hsl(var(--destructive))",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Radial Goal Chart */}
            <div className="w-full md:col-span-1">
                <div className="text-center mb-2">
                    <h3 className="text-lg font-medium">Monthly Goal</h3>
                    <p className="text-sm text-muted-foreground">
                        {Math.round(progressPercentage)}% Complete
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="h-[180px] w-[180px] relative">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={radialData}
                            startAngle={90}
                            endAngle={-270}
                            width={180}
                            height={180}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={30}
                            />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-2xl font-bold"
                            >
                                {Math.round(progressPercentage)}%
                            </text>
                        </RadialBarChart>
                    </div>
                    <div className="mt-2 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                                {formatDuration(monthData.totalMergedHours)}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Goal: {MONTHLY_GOAL}h ({DAILY_GOAL}h/day, 5
                            days/week)
                        </div>
                    </div>
                </div>
            </div>

            {/* Area Chart */}
            <div className="w-full md:col-span-3">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 12,
                            left: 12,
                            bottom: 10,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="fillHours"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-hours)"
                                    stopOpacity={0.9}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-hours)"
                                    stopOpacity={0.3}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={10}
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
                                    labelFormatter={(value) => {
                                        return `Date: ${value}`;
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <ReferenceLine
                            y={DAILY_GOAL}
                            stroke="rgba(255, 0, 0, 0.5)"
                            strokeDasharray="3 3"
                            label={{
                                value: "Daily Goal (7h)",
                                position: "insideTopRight",
                            }}
                        />
                        <Area
                            dataKey="hours"
                            type="natural"
                            fill="url(#fillHours)"
                            stroke="var(--color-hours)"
                            strokeWidth={2}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
                <div className="text-sm text-muted-foreground mt-2">
                    Showing daily attendance for {monthData.month}
                </div>
            </div>
        </div>
    );
}
