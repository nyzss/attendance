import { serverGetAttendance } from "@/lib/attendance";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
        return Response.json(
            { error: "No session token found" },
            { status: 401 }
        );
    }

    const attendance = await serverGetAttendance(sessionToken);
    return Response.json(attendance);
}
