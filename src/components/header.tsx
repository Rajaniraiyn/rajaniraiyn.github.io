import { HyperText } from "@/components/ui/hyper-text";
import { useStorage } from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Header({ className, ...props }: React.ComponentProps<'header'>) {
    const [savedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

    const isWallpaperSaved = !!savedWallpaper;

    return (
        <header
            className={cn({ "drop-shadow-secondary drop-shadow-md": false, }, className)}
            {...props}
        >
            <div className={cn('w-full h-1 bg-background', {
                'opacity-75': isWallpaperSaved,
            })} />
            <div className='flex flex-row'>
                <Name className={cn('bg-background p-3 rounded-br-4xl', {
                    'bg-background/75': isWallpaperSaved,
                })} />
                <svg
                    className={cn('size-7', {
                        'opacity-75': isWallpaperSaved,
                    })}
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
            <svg
                className={cn('size-7', {
                    'opacity-75': isWallpaperSaved,
                })}
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
        </header>
    )
}

function Name({ className }: { className: string }) {
    const [nameVersion, setNameVersion] = useState<"short" | "long">("long");
    return (
        <HyperText
            as='h3'
            className={cn('text-3xl font-extrabold font-departure-mono uppercase', className)}
            onClick={() => {
                getSelection()?.removeAllRanges();
                setNameVersion(prev => prev === "short" ? "long" : "short")
            }}
        >
            {nameVersion === "short" ? "Raj" : "Rajaniraiyn"}
        </HyperText>
    )
}