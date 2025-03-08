export interface TimePeriod {
    begin_at: string;
    end_at: string;
}

export interface Entries {
    campus_id: number;
    source: string;
    time_period: TimePeriod;
}

export interface DetailedAttendance {
    campus_id: number;
    duration: string;
    name: string;
    type: string;
}

export interface DailyAttendances {
    date: string;
    day: string;
    total_attendance: string;
    total_off_site_attendance: string;
    total_on_site_attendance: string;
}

export interface AttendanceReport {
    allow_overflow: boolean;
    daily_attendances: DailyAttendances[] | null;
    detailed_attendance: DetailedAttendance[] | null;
    entries: Entries[] | null;
    from_date: string;
    from_source_type: string[] | null;
    from_sources: string[] | null;
    from_time: string | null;
    prioritize_sources: boolean;
    to_date: string;
    to_time: string | null;
    total_attendance: string;
    total_off_site_attendance: string;
    total_on_site_attendance: string;
    weekdays: string[] | null;
}

export interface Schema {
    attendance: AttendanceReport[] | null;
    image_url: string;
    login: string;
}
