import { cn } from "@/lib/utils";
import { Signature } from "@/components/signature";

export function Footer({ className, ...props }: Omit<React.ComponentProps<'footer'>, 'children'>) {
    return (
        <footer className={cn('max-w-3xl mx-auto p-3 flex flex-row items-center-safe justify-between gap-2', className)} {...props}>
            <p className="text-xs">
                &copy; {new Date().getFullYear()} Rajaniraiyn. All rights reserved.
            </p>
            <Signature className="h-16 w-auto" />
        </footer >
    )
}