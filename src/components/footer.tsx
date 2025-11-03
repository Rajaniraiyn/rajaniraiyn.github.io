import { Signature } from "@/components/signature";
import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { PaletteIcon, PlayIcon } from "lucide-react";

export function Footer({ className, ...props }: Omit<React.ComponentProps<'footer'>, 'children'>) {
    const isGameActive = useSearch({ strict: false, select: (search) => search.game });

    return (
        <footer className={cn('max-w-3xl mx-auto p-3 space-y-4', className)} {...props}>
            {/* Main footer content */}
            <div className="flex flex-row flex-wrap items-center justify-around gap-4">
                {/* Left side - Easter Eggs */}
                <div className="flex items-center gap-4">
                    {!isGameActive && (
                        <Link
                            to="/"
                            search={{ game: true }}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                            aria-label="Start Adventure"
                        >
                            <PlayIcon className="size-4" />
                        </Link>
                    )}
                    <Link
                        to="/wall-of-papers"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                        aria-label="Wall of Papers"
                    >
                        <PaletteIcon className="size-4" />
                    </Link>
                </div>

                {/* Copyright */}
                {/* <div className="flex justify-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Rajaniraiyn. All rights reserved.
                    </p>
                </div> */}

                {/* Right side - Signature */}
                <Signature className="h-12 w-auto" />
            </div>
        </footer >
    )
}