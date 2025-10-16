import { cn } from "@/lib/utils";

export function Footer({ className, ...props }: Omit<React.ComponentProps<'footer'>, 'children'>) {
    return (
        <footer className={cn('max-w-3xl mx-auto p-3', className)} {...props}>
            <p className="text-xs">
                &copy; {new Date().getFullYear()} Rajaniraiyn. All rights reserved.
            </p>
        </footer>
    )
}