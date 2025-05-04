export default function StatusDot(props: { title: string; active: boolean }) {
    const { active } = props;

    return (
        <div className="flex flex-row gap-4 items-center shrink-0">
            <div className="relative">
                <div className={`h-4 w-4 rounded-full ${active ? "animate-pulse bg-emerald-500" : "bg-yellow-500"}`}></div>
                {active && (
                    <>
                        <div className={`absolute top-0 left-0 h-4 w-4 rounded-full opacity-75 ${active ? "bg-emerald-500 animate-ping" : "bg-yellow-500"}`}></div>
                        <div className={`absolute top-0 left-0 h-4 w-4 rounded-full opacity-50 ${active ? "bg-emerald-300 animate-pulse" : "bg-yellow-300"}`}></div>
                    </>
                )}
            </div>
        </div>
    );
}
