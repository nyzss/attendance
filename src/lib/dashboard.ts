import { Schema } from "@/types/main";
import { format, parseISO, differenceInMinutes, getYear } from "date-fns";

export interface TimeEntry {
    begin: Date;
    end: Date;
    source: string;
    campus_id: number;
    durationHours: number;
}

export interface MergedEntry {
    begin: Date;
    end: Date;
    duration: string;
    durationHours: number;
}

export interface DailyAttendance {
    date: string;
    rawEntries: TimeEntry[];
    mergedEntries: MergedEntry[];
    totalRawHours: number;
    totalMergedHours: number;
}

export interface MonthlyAttendance {
    month: string;
    monthKey: string;
    days: Map<string, DailyAttendance>;
    totalRawHours: number;
    totalMergedHours: number;
}

export interface YearlyAttendance {
    year: number;
    months: MonthlyAttendance[];
    totalRawHours: number;
    totalMergedHours: number;
}

/**
 * Formats a duration in hours to a readable string (e.g., "5h 30m")
 */
export const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
};

/**
 * Merges overlapping time entries to get accurate attendance time
 */
export const mergeTimeEntries = (
    entries: TimeEntry[]
): { begin: Date; end: Date; durationHours: number }[] => {
    if (entries.length === 0) return [];

    // Sort entries by begin time
    const sortedEntries = [...entries].sort(
        (a, b) => a.begin.getTime() - b.begin.getTime()
    );

    const mergedEntries: { begin: Date; end: Date; durationHours: number }[] =
        [];
    let currentEntry = {
        begin: sortedEntries[0].begin,
        end: sortedEntries[0].end,
        durationHours:
            differenceInMinutes(sortedEntries[0].end, sortedEntries[0].begin) /
            60,
    };

    for (let i = 1; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i];

        // If current entry overlaps with the next entry
        if (entry.begin <= currentEntry.end) {
            // Extend the current entry if the next entry ends later
            if (entry.end > currentEntry.end) {
                currentEntry.end = entry.end;
                currentEntry.durationHours =
                    differenceInMinutes(currentEntry.end, currentEntry.begin) /
                    60;
            }
        } else {
            // No overlap, add the current entry to results and start a new one
            mergedEntries.push({ ...currentEntry });
            currentEntry = {
                begin: entry.begin,
                end: entry.end,
                durationHours: differenceInMinutes(entry.end, entry.begin) / 60,
            };
        }
    }

    // Add the last entry
    mergedEntries.push(currentEntry);

    return mergedEntries;
};

/**
 * Processes attendance data and organizes it by year, month, and day
 */
export const processAttendanceData = (data: Schema): YearlyAttendance[] => {
    if (!data.attendance || data.attendance.length === 0) {
        return [];
    }

    // Create a map to store attendance by year
    const yearlyAttendance = new Map<number, YearlyAttendance>();

    // Process all entries from all attendance reports
    data.attendance.forEach((report) => {
        report.entries?.forEach((entry) => {
            const begin = parseISO(entry.time_period.begin_at);
            const end = parseISO(entry.time_period.end_at);

            // Get the year
            const year = getYear(begin);

            // Calculate duration in hours
            const durationMinutes = differenceInMinutes(end, begin);
            const durationHours = durationMinutes / 60;

            // Get the month key and date key
            const monthKey = format(begin, "yyyy-MM");
            const monthDisplay = format(begin, "MMMM yyyy");
            const dateKey = format(begin, "yyyy-MM-dd");

            // Create or update the yearly attendance
            if (!yearlyAttendance.has(year)) {
                yearlyAttendance.set(year, {
                    year,
                    months: [],
                    totalRawHours: 0,
                    totalMergedHours: 0,
                });
            }

            const yearData = yearlyAttendance.get(year)!;

            // Find or create the monthly attendance
            let monthData = yearData.months.find(
                (m) => m.monthKey === monthKey
            );

            if (!monthData) {
                monthData = {
                    month: monthDisplay,
                    monthKey,
                    days: new Map<string, DailyAttendance>(),
                    totalRawHours: 0,
                    totalMergedHours: 0,
                };
                yearData.months.push(monthData);
            }

            // Create or update the daily attendance
            if (!monthData.days.has(dateKey)) {
                monthData.days.set(dateKey, {
                    date: dateKey,
                    rawEntries: [],
                    mergedEntries: [],
                    totalRawHours: 0,
                    totalMergedHours: 0,
                });
            }

            const dayData = monthData.days.get(dateKey)!;

            // Add the entry
            dayData.rawEntries.push({
                begin,
                end,
                source: entry.source,
                campus_id: entry.campus_id,
                durationHours,
            });

            // Update raw hours
            dayData.totalRawHours += durationHours;
            monthData.totalRawHours += durationHours;
            yearData.totalRawHours += durationHours;
        });
    });

    // Process merged entries for each day
    yearlyAttendance.forEach((yearData) => {
        yearData.months.forEach((monthData) => {
            monthData.days.forEach((dayData) => {
                dayData.mergedEntries = mergeTimeEntries(
                    dayData.rawEntries
                ).map((entry) => ({
                    ...entry,
                    duration: `${format(entry.begin, "HH:mm")} - ${format(
                        entry.end,
                        "HH:mm"
                    )}`,
                }));

                dayData.totalMergedHours = dayData.mergedEntries.reduce(
                    (sum, entry) => sum + entry.durationHours,
                    0
                );
                monthData.totalMergedHours += dayData.totalMergedHours;
                yearData.totalMergedHours += dayData.totalMergedHours;
            });
        });

        // Sort months chronologically
        yearData.months.sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    });

    // Convert map to array and sort by year (descending)
    return Array.from(yearlyAttendance.values()).sort(
        (a, b) => b.year - a.year
    );
};

/**
 * Converts a Map to an array of objects with date and hours properties
 * for use in charts
 */
export const mapToChartData = (
    days: Map<string, DailyAttendance>,
    useRawHours = false
) => {
    return Array.from(days.entries())
        .map(([date, data]) => ({
            date,
            hours: useRawHours ? data.totalRawHours : data.totalMergedHours,
            formattedDate: format(parseISO(date), "MMM dd"),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Creates monthly chart data for the entire year
 */
export const createYearlyChartData = (yearData: YearlyAttendance) => {
    return yearData.months.map((month) => ({
        month: month.month,
        hours: month.totalMergedHours,
        rawHours: month.totalRawHours,
        monthKey: month.monthKey,
    }));
};
