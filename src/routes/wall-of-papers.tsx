import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'
import { z } from 'zod/mini'

export const Route = createFileRoute('/wall-of-papers')({
    validateSearch: (search) => z.object({
        i: z.optional(z.number()),
    }).parse(search),
    component: RouteComponent,
})

const wallpapers = Object.values(import.meta.glob('../assets/wallpapers/*.jpeg', { eager: true, as: 'url' }))

function RouteComponent() {
    const { i: selected } = Route.useSearch()
    const navigate = Route.useNavigate()

    const openFullscreen = useCallback((index: number) => {
        navigate({ search: { i: index } })
    }, [navigate])

    const closeFullscreen = useCallback(() => {
        navigate({ search: {} })
    }, [navigate])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && selected !== undefined) {
            closeFullscreen()
        }
    }, [selected, closeFullscreen])

    useEffect(() => {
        if (selected !== undefined) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [selected, handleKeyDown])

    return (
        <>
            <div className='scroll-pt-1 pt-2 md:pt-10 px-2'>
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

            {/* Fullscreen Modal */}
            {selected !== undefined && (
                <div
                    className='fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4'
                    onClick={closeFullscreen}
                >
                    <div
                        className='relative max-w-7xl max-h-full w-full h-full flex items-center justify-center'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={wallpapers[selected]}
                            alt={`Wallpaper ${selected + 1}`}
                            className='max-w-full max-h-full object-contain rounded-lg shadow-2xl'
                            style={{ imageRendering: 'pixelated' }}
                        />

                        {/* Close button */}
                        <button
                            onClick={closeFullscreen}
                            className='absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm'
                            aria-label="Close fullscreen"
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>

                        {/* Image counter */}
                        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm'>
                            {selected + 1} / {wallpapers.length}
                        </div>

                        {/* Navigation arrows */}
                        <button
                            onClick={() => openFullscreen(selected > 0 ? selected - 1 : wallpapers.length - 1)}
                            className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm'
                            aria-label="Previous image"
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                        </button>

                        <button
                            onClick={() => openFullscreen(selected < wallpapers.length - 1 ? selected + 1 : 0)}
                            className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm'
                            aria-label="Next image"
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
