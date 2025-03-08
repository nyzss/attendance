import { Schema } from "@/types/main";

export const serverGetAttendance = async (sessionToken: string) => {
    const response = await fetch(
        "https://dashboard.42paris.fr/api/attendance",
        {
            headers: {
                cookie: `session=${sessionToken}`,
            },
            method: "GET",
        }
    );

    if (!response.ok) {
        return null;
    }

    const data: Schema = await response.json();
    return data;
};

export const clientGetAttendance = async (sessionToken: string) => {
    const resp = await fetch("/api/attendance", {
        method: "GET",
        headers: {
            cookie: `sessionToken=${sessionToken}`,
        },
    });

    if (!resp.ok) {
        return null;
    }

    const data: Schema = await resp.json();

    return data;
};
