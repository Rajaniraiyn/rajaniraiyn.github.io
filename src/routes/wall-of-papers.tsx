import cityLightsPortraitUrl from "@/assets/wallpapers/city-lights-portrait.jpeg?url";
import coastalCliffsLandscapeUrl from "@/assets/wallpapers/coastal-cliffs-landscape.jpeg?url";
import forestGreeneryLandscapeUrl from "@/assets/wallpapers/forest-greenery-landscape.jpeg?url";
import forestPathLandscapeUrl from "@/assets/wallpapers/forest-path-landscape.jpeg?url";
import forestTrailPortraitUrl from "@/assets/wallpapers/forest-trail-portrait.jpeg?url";
import gameTowerUrl from "@/assets/wallpapers/game-tower.jpeg?url";
import mountainPeakPortraitUrl from "@/assets/wallpapers/mountain-peak-portrait.jpeg?url";
import mountainValleyLandscapeUrl from "@/assets/wallpapers/mountain-valley-landscape.jpeg?url";
import natureUrl from "@/assets/wallpapers/nature.jpeg?url";
import nightCityPortraitUrl from "@/assets/wallpapers/night-city-portrait.jpeg?url";
import nightCityscapeLandscapeUrl from "@/assets/wallpapers/night-cityscape-landscape.jpeg?url";
import nightForestPortraitUrl from "@/assets/wallpapers/night-forest-portrait.jpeg?url";
import nightMountainLandscapeUrl from "@/assets/wallpapers/night-mountain-landscape.jpeg?url";
import oceanWavesLandscapeUrl from "@/assets/wallpapers/ocean-waves-landscape.jpeg?url";
import sunsetHillsLandscapeUrl from "@/assets/wallpapers/sunset-hills-landscape.jpeg?url";
import sunsetUrl from "@/assets/wallpapers/sunset.jpeg?url";
import urbanSkyscrapersPortraitUrl from "@/assets/wallpapers/urban-skyscrapers-portrait.jpeg?url";
import waterfallPortraitUrl from "@/assets/wallpapers/waterfall-portrait.jpeg?url";
import winterLandscapePortraitUrl from "@/assets/wallpapers/winter-landscape-portrait.jpeg?url";
import { Button } from '@/components/ui/button';
import { Dialog, DialogPopup } from '@/components/ui/dialog';
import { useStorage } from '@/hooks/use-storage';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { useCallback } from 'react';
import { z } from 'zod/mini';

export const Route = createFileRoute('/wall-of-papers')({
    validateSearch: (search) => z.object({
        i: z.optional(z.number()),
    }).parse(search),
    component: RouteComponent,
})

const wallpapers = [
    coastalCliffsLandscapeUrl,
    cityLightsPortraitUrl,
    forestGreeneryLandscapeUrl,
    forestPathLandscapeUrl,
    forestTrailPortraitUrl,
    gameTowerUrl,
    mountainPeakPortraitUrl,
    mountainValleyLandscapeUrl,
    natureUrl,
    nightCityPortraitUrl,
    nightCityscapeLandscapeUrl,
    nightForestPortraitUrl,
    nightMountainLandscapeUrl,
    oceanWavesLandscapeUrl,
    sunsetHillsLandscapeUrl,
    sunsetUrl,
    urbanSkyscrapersPortraitUrl,
    waterfallPortraitUrl,
    winterLandscapePortraitUrl,
];

function RouteComponent() {
    const { i: selected } = Route.useSearch()
    const navigate = Route.useNavigate()
    const [, setSavedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

    const openFullscreen = useCallback((index: number) => {
        navigate({ search: { i: index }, replace: true as const })
    }, [navigate])

    const closeFullscreen = useCallback(() => {
        navigate({ search: {}, replace: true })
    }, [navigate])

    const handleLikeWallpaper = useCallback(() => {
        if (selected !== undefined) {
            setSavedWallpaper(wallpapers[selected])
            navigate({ to: '/' })
        }
    }, [selected, navigate, setSavedWallpaper])

    const handleDialogOpenChange = useCallback((open: boolean) => {
        if (!open) {
            closeFullscreen()
        }
    }, [closeFullscreen])

    const goToPrevious = useCallback(() => {
        if (selected !== undefined) {
            openFullscreen(selected > 0 ? selected - 1 : wallpapers.length - 1)
        }
    }, [selected, openFullscreen])

    const goToNext = useCallback(() => {
        if (selected !== undefined) {
            openFullscreen(selected < wallpapers.length - 1 ? selected + 1 : 0)
        }
    }, [selected, openFullscreen])

    return (
        <>
            <div className='scroll-pt-1 pt-2 md:pt-10 px-2 max-w-3xl mx-auto'>
                <div className='columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4' style={{ columnGap: '1rem' }}>
                    {wallpapers.map((src, index) => (
                        <div
                            key={src}
                            className='break-inside-avoid mb-4 cursor-pointer'
                            style={{ breakInside: 'avoid' }}
                            onClick={() => openFullscreen(index)}
                        >
                            <div className='relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group'>
                                <img
                                    className='w-full h-auto transition-transform duration-300 group-hover:scale-105'
                                    style={{ imageRendering: 'pixelated' }}
                                    src={src}
                                    alt={`Wallpaper ${index + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg' />
                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <div className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow-lg'>
                                        View Full
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={selected !== undefined} onOpenChange={handleDialogOpenChange}>
                <DialogPopup
                    showCloseButton={false}
                    backdropClassName="bg-black/75"
                    containerClassName="pointer-events-none"
                    positionerClassName="flex h-full w-full flex-row items-center justify-center overflow-hidden p-4 pointer-events-none pt-0 before:hidden after:hidden max-sm:before:hidden sm:overflow-hidden sm:p-4 sm:before:basis-0 sm:after:flex-none"
                    className="pointer-events-auto relative flex h-full max-h-full w-full max-w-7xl items-center justify-center border-none bg-transparent p-0 shadow-none sm:max-w-7xl sm:scale-100 sm:rounded-none before:hidden dark:before:hidden"
                >
                    {selected !== undefined && (
                        <>
                            <img
                                src={wallpapers[selected]}
                                alt={`Wallpaper ${selected + 1}`}
                                className='max-h-full max-w-full rounded-lg object-contain shadow-2xl'
                                style={{ imageRendering: 'pixelated' }}
                                decoding="async"
                            />

                            <Button
                                onClick={closeFullscreen}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 size-10 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                aria-label="Close fullscreen"
                            >
                                <X className="size-6" />
                            </Button>

                            <div className='absolute bottom-4 left-0 right-0 flex items-center justify-between gap-4 px-4'>
                                <div className='rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm'>
                                    {selected + 1} / {wallpapers.length}
                                </div>

                                <Button
                                    onClick={handleLikeWallpaper}
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                >
                                    <Heart className="size-4" />
                                    <span className="sr-only">Like</span>
                                </Button>
                            </div>

                            <Button
                                onClick={goToPrevious}
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 size-12 -translate-y-1/2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="size-6" />
                            </Button>

                            <Button
                                onClick={goToNext}
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 size-12 -translate-y-1/2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                aria-label="Next image"
                            >
                                <ChevronRight className="size-6" />
                            </Button>
                        </>
                    )}
                </DialogPopup>
            </Dialog>
        </>
    )
}
