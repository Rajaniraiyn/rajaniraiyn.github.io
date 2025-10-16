import { cn } from "@/lib/utils";

export function Sidebar({ className, ...props }: React.ComponentProps<'aside'>) {
    return (
        <aside className={cn('rounded-lg p-2 min-w-3xs bg-accent/10 border flex flex-col justify-between items-center-safe gap-2', className)} {...props}>
            <div></div>
            <div>
                Center
            </div>
            <div></div>
        </aside>
    )
}