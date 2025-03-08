"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    Tooltip,
    ReferenceLine,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Clock } from "lucide-react";

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

    // Determine status color based on progress
    const getStatusColor = () => {
        if (progressPercentage >= 100) return "text-green-500";
        if (progressPercentage >= 75) return "text-yellow-500";
        if (progressPercentage >= 50) return "text-orange-500";
        return "text-red-500";
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            {monthData.month}
                        </CardTitle>
                        <CardDescription>
                            Total hours:{" "}
                            {formatDuration(monthData.totalMergedHours)}{" "}
                            (merged) / {formatDuration(monthData.totalRawHours)}{" "}
                            (raw)
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium">Monthly Goal</div>
                        <div
                            className={`text-xl font-bold ${getStatusColor()}`}
                        >
                            {Math.round(progressPercentage)}%
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {formatDuration(monthData.totalMergedHours)}
                                </span>
                            </div>
                            <div>
                                Goal: {MONTHLY_GOAL}h ({DAILY_GOAL}h/day, 5
                                days/week)
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <ChartContainer
                        config={chartConfig}
                        className="h-[250px] w-full"
                    >
                        <AreaChart accessibilityLayer data={chartData}>
                            <defs>
                                <linearGradient
                                    id="colorHours"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-hours)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-hours)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="formattedDate"
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    `${Math.round(value)}h`
                                }
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
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
                                type="monotone"
                                dataKey="hours"
                                stroke="var(--color-hours)"
                                fillOpacity={1}
                                fill="url(#colorHours)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
