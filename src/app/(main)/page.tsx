import SessionForm from "@/components/session-form";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Attendance Tracker for 42
                </h1>
                <SessionForm />
            </div>
        </div>
    );
}
