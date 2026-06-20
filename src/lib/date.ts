export function formatDate(dateStr: string) {
    if (dateStr === "Present") return "Present";
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
