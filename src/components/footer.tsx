import { cn } from "@/lib/utils";
import { Signature } from "@/components/signature";
import { Link } from "@tanstack/react-router";
import { GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon, PaletteIcon } from "lucide-react";

export function Footer({ className, ...props }: Omit<React.ComponentProps<'footer'>, 'children'>) {
    return (
        <footer className={cn('max-w-3xl mx-auto p-3 space-y-4', className)} {...props}>
            {/* Main footer content */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left side - Wall of Papers */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/wall-of-papers"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <PaletteIcon className="size-4" />
                        Wall of Papers
                    </Link>
                </div>

                {/* Center - Social Links */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Rajaniraiyn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                        aria-label="GitHub"
                    >
                        <GithubIcon className="size-4" />
                    </a>
                    <a
                        href="https://linkedin.com/in/rajaniraiyn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                        aria-label="LinkedIn"
                    >
                        <LinkedinIcon className="size-4" />
                    </a>
                    <a
                        href="https://x.com/rajaniraiyn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                        aria-label="Twitter/X"
                    >
                        <TwitterIcon className="size-4" />
                    </a>
                    <a
                        href="https://instagram.com/rajaniraiyn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/50"
                        aria-label="Instagram"
                    >
                        <InstagramIcon className="size-4" />
                    </a>
                </div>

                {/* Right side - Signature */}
                <Signature className="h-12 w-auto" />
            </div>

            {/* Copyright */}
            <div className="flex justify-center">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Rajaniraiyn. All rights reserved.
                </p>
            </div>
        </footer >
    )
}