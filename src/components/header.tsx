import { HyperText } from "@/components/ui/hyper-text";
import { useStorage } from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function Header({ className, ...props }: React.ComponentProps<'header'>) {
    const [savedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

    const isWallpaperSaved = !!savedWallpaper;

    const navigate = useNavigate();

    return (
        <header
            className={cn({ "drop-shadow-secondary drop-shadow-md": false, }, className)}
            onClick={() => navigate({ to: '/' })}
            {...props}
        >
            <div className='w-full h-1 bg-background' />
            <div className="max-w-3xl mx-auto">
                <div className={cn('flex flex-row', { 'justify-center-safe': isWallpaperSaved })}>
                    {isWallpaperSaved && (
                        <svg
                            className='size-7 rotate-z-90'
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_310_2)">
                                <path d="M30 0H0V30C0 13.431 13.431 0 30 0Z" className='fill-background' />
                            </g>
                            <defs>
                                <clipPath id="clip0_310_2">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                    <Name className={cn('bg-background p-3 rounded-br-4xl', { 'rounded-bl-4xl': isWallpaperSaved })} />
                    <svg
                        className='size-7'
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_310_2)">
                            <path d="M30 0H0V30C0 13.431 13.431 0 30 0Z" className='fill-background'>
                            </path>
                        </g>
                        <defs>
                            <clipPath id="clip0_310_2">
                                <rect width="30" height="30" fill="white">
                                </rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                {!isWallpaperSaved && (
                    <svg
                        className='size-7'
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#clip0_310_2)">
                            <path d="M30 0H0V30C0 13.431 13.431 0 30 0Z" className='fill-background' />
                        </g>
                        <defs>
                            <clipPath id="clip0_310_2">
                                <rect width="30" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                )}
            </div>
        </header>
    )
}

function Name({ className }: { className: string }) {
    const [nameVersion, setNameVersion] = useState<"short" | "long">("long");
    return (
        <HyperText
            as='h3'
            className={cn('text-3xl font-extrabold font-departure-mono uppercase', className)}
            onDoubleClick={() => {
                getSelection()?.removeAllRanges();
                setNameVersion(prev => prev === "short" ? "long" : "short")
            }}
        >
            {nameVersion === "short" ? "Raj" : "Rajaniraiyn"}
        </HyperText>
    )
}