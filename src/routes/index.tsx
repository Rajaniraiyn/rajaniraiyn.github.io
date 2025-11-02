import santaBrowserFaviconSrc from '@/assets/images/santabrowser-favicon.svg'
import gameTowerPixelArtSrc from '@/assets/wallpapers/game-tower.jpeg'
import naturePixelArtSrc from '@/assets/wallpapers/nature.jpeg'
import { Game } from '@/components/cheats/game'
import { TextHighlighter, type TextHighlighterRef } from "@/components/fancy/text/text-highlighter"
import { Header } from '@/components/header'
import { TechStack } from '@/components/stack'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/contexts/theme'
import { useGameElement } from '@/hooks/use-game-element'
import { useStorage } from '@/hooks/use-storage'
import { GameElement, GameSurface } from '@/lib/mario-game'
import { createFileRoute, Link } from '@tanstack/react-router'
import confetti from "canvas-confetti"
import { BuildingIcon, ExternalLink, GithubIcon } from 'lucide-react'
import type { Transition } from "motion"
import type { ComponentProps, ReactNode } from 'react'
import { useCallback } from 'react'
import { z } from 'zod/mini'

export const Route = createFileRoute('/')({
    validateSearch: (search) => z.object({
        game: z.optional(z.boolean()),
    }).parse(search),
    component: RouteComponent,
})

function RouteComponent() {
    const { game: isGameActive } = Route.useSearch()
    const [savedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

    const workExperienceTitleRef = useGameElement<HTMLHeadingElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, bottom: true, left: true, right: true },
    })
    const projectsTitleRef = useGameElement<HTMLHeadingElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, bottom: true, left: true, right: true },
    })

    return (
        <div className='space-y-10 scroll-pt-1'>
            <Header className='sticky inset-0 bottom-auto z-50 mb-0' />
            <section className='px-2'>
                <h2 className='text-2xl font-bold sr-only'>About</h2>
                <About />
            </section>
            <section className='space-y-4 px-2'>
                <h2 ref={workExperienceTitleRef} className='text-2xl font-bold font-departure-mono uppercase w-fit'>Work Experience</h2>
                <Accordion className='flex flex-col gap-4 md:px-5' multiple>
                    {/* <WorkExperience
                        title="Desktop Application Developer"
                        company="Abacus"
                        companyUrl="https://abacus.ai"
                        icon="https://www.google.com/s2/favicons?domain=abacus.ai&sz=128"
                        startDate="2025-01-01"
                        endDate="Present"
                    /> */}
                    <WorkExperience
                        title="Founding Engineer"
                        company="Portal"
                        companyUrl="https://portal.so"
                        icon="https://www.google.com/s2/favicons?domain=portal.so&sz=128"
                        startDate="2023-12-01"
                        // endDate="2025-01-01"
                        endDate='Present'
                    />
                    <WorkExperience
                        title="Software Developer"
                        company="Santa Browser"
                        companyUrl="https://santabrowser.com"
                        icon={santaBrowserFaviconSrc}
                        startDate="2023-01-01"
                        endDate="2023-12-01"
                    />
                </Accordion>
            </section>
            <section className='space-y-4 px-2'>
                <h2 ref={projectsTitleRef} className='text-2xl font-bold font-departure-mono uppercase w-fit'>Projects</h2>
                <Accordion className='flex flex-col gap-4 md:px-5' multiple>
                    <Project
                        name="React Alien Signals"
                        github="https://github.com/Rajaniraiyn/react-alien-signals"
                        website=""
                        startDate="2024-11-01"
                        endDate="Present"
                        description="Alien React Signals is a TypeScript library that provides state management APIs built on top of Alien Signals."
                        details={[
                            "Modern state management solution for React applications with signal-based reactivity.",
                            "Built on top of the powerful Alien Signals library for optimal performance.",
                            "Provides familiar React hooks API while leveraging advanced signal patterns.",
                            "52+ stars on GitHub, actively maintained and adopted by developers.",
                        ]}
                    />
                    <Project
                        name="AI SDK Solid"
                        github="https://github.com/Rajaniraiyn/ai-sdk-solid"
                        website=""
                        startDate="2025-01-01"
                        endDate="Present"
                        description="AI SDK provider for solidjs - enabling seamless AI integration in SolidJS applications."
                        details={[
                            "Official AI SDK integration for the SolidJS reactive framework.",
                            "Implements reactive AI state management with streaming capabilities.",
                            "Provides TypeScript-first API for modern AI interactions.",
                            "Enables reactive AI workflows within SolidJS applications.",
                        ]}
                    />
                    <Project
                        name="Vite Plugin React Scan"
                        github="https://github.com/Rajaniraiyn/vite-plugin-react-scan"
                        website=""
                        startDate="2025-01-01"
                        endDate="Present"
                        description="Vite plugin for react-scan - automatic React performance monitoring and component analysis."
                        details={[
                            "Seamless Vite integration for the popular react-scan performance tool.",
                            "Automatic component re-render analysis during development.",
                            "Helps identify performance bottlenecks in React applications.",
                            "Zero-config setup for immediate performance insights.",
                        ]}
                    />
                    <Project
                        name="CSSUnicorn"
                        github="https://github.com/Rajaniraiyn/cssunicorn"
                        website=""
                        startDate="2024-12-01"
                        endDate="Present"
                        description="CSS utilities and components library for modern web development."
                        details={[
                            "Comprehensive CSS utility library for rapid web development.",
                            "Modern component system with accessible and responsive design patterns.",
                            "TypeScript support for type-safe styling solutions.",
                            "Performance-optimized CSS with minimal bundle size impact.",
                        ]}
                    />
                    <Project
                        name="CDS Design System"
                        github=""
                        website="https://cds-design.github.io"
                        startDate="2023-07-01"
                        endDate="Present"
                        description="A comprehensive design system & component library focused on interaction engineering (1.4k+ npm downloads)."
                        details={[
                            "Designed & developed reusable UI components and guidelines, improving development efficiency.",
                            "Implemented micro-interactions and animations using Framer Motion and GSAP.",
                            "Led the project from design to deployment, ensuring visual consistency and adherence to design principles.",
                            "Enhanced developer experience by providing detailed documentation and tooling.",
                        ]}
                    />
                    <Project
                        name="UPM"
                        github="https://github.com/Rajaniraiyn/upm"
                        website=""
                        startDate="2023-02-01"
                        endDate="Present"
                        description="A simplified and performant package manager built with Rust."
                        details={[
                            "Achieved high performance and memory safety using Rust.",
                            "Simplified commands for better user experience.",
                            "Ensured cross-platform support and scalability.",
                        ]}
                    />
                    <Project
                        name="svelte-sound"
                        github="https://github.com/Rajaniraiyn/svelte-sound"
                        website=""
                        startDate="2022-11-01"
                        endDate="Present"
                        description="Svelte actions for playing interaction sounds on DOM events. (6.4k+ npm downloads)"
                        details={[
                            "Developed a lightweight and performant audio interaction library for Svelte.",
                            "Implemented dynamic imports to support partial hydration.",
                            "Created a scalable solution for complex game interactions.",
                        ]}
                    />
                    <Project
                        name="RTube"
                        github="https://github.com/Rajaniraiyn/rtube"
                        website=""
                        startDate="2022-09-01"
                        endDate="Present"
                        description="A modern, lightweight YouTube video player and downloader."
                        details={[
                            "Built using web technologies and Svelte.",
                            "Features include ad-free viewing, ultra-fast downloads with parallel connections, and resumable downloads.",
                            "Designed an intuitive user interface, enhancing user satisfaction.",
                        ]}
                    />
                    <Project
                        name="Raj Browser"
                        github="https://github.com/Rajaniraiyn/raj-browser"
                        website=""
                        startDate="2021-08-01"
                        endDate="Present"
                        description="A UI and privacy-focused web browser built from scratch using Electron.js."
                        details={[
                            "Engineered a custom browser focusing on privacy and user experience.",
                            "Implemented ad-blocking, custom scrollbars, process management, and advanced download features.",
                            "Designed a unique and modern interface, handling both design and development aspects.",
                            "Optimized performance and resource usage, resulting in a lightweight application used by thousands of users.",
                        ]}
                    />
                </Accordion>
            </section>
            <section className='space-y-4 px-2'>
                <h2 className='text-2xl font-bold font-departure-mono uppercase w-fit'>Stack</h2>
                <TechStack />
            </section>
            {isGameActive && <Game />}
            {savedWallpaper && <img
                src={savedWallpaper}
                alt="Saved Wallpaper"
                className="absolute inset-0 size-full -z-10 object-cover opacity-25"
                style={{ imageRendering: 'pixelated' }}
            />}
        </div>
    )
}

const CAREER_START_DATE = "2021-08-01";

function About() {
    const careerYears = new Date().getFullYear() - new Date(CAREER_START_DATE).getFullYear();

    return (
        <div className="space-y-3">
            <TooltipProvider delay={0}>
                <p>
                    Dynamic and versatile engineer with {careerYears}+ years of experience specializing in frontend and desktop application development, with a strong focus on{" "}
                    <HighlightedTextWithPreview previewUrl={naturePixelArtSrc} isFirst>interaction engineering and user experience</HighlightedTextWithPreview>
                    .
                </p>
                <p>
                    I architect impactful solutions, lead technical direction, and obsess over the details that elevate digital products—from{" "}
                    <HighlightedTextWithPreview previewUrl={gameTowerPixelArtSrc}>microinteractions</HighlightedTextWithPreview>{" "}
                    to{" "}
                    <HighlightedTextWithPreview previewUrl={naturePixelArtSrc}>robust design systems</HighlightedTextWithPreview>
                    . Whether it’s building browsers, enhancing developer tools, or creating open-source projects, I bring ideas to life through{" "}
                    <HighlightedTextWithPreview previewUrl={naturePixelArtSrc}>thoughtful design and meticulous engineering</HighlightedTextWithPreview>
                    .
                </p>
                <p>
                    My expertise bridges product vision and implementation—contributing to{" "}
                    <HighlightedTextWithPreview previewUrl={santaBrowserFaviconSrc}>Chromium-based browsers</HighlightedTextWithPreview>
                    , engineering full-stack platforms, and integrating{" "}
                    <HighlightedTextWithPreview previewUrl={naturePixelArtSrc}>AI capabilities for next-generation user experiences</HighlightedTextWithPreview>
                    . I thrive on tackling complex problems and delivering well-crafted solutions that scale.
                </p>
                <p>
                    I’m always exploring new technologies, mentoring teams, and advancing the craft of{" "}
                    <HighlightedTextWithPreview previewUrl={naturePixelArtSrc}>developer experience and interaction design</HighlightedTextWithPreview>
                    . Let’s push boundaries and build incredible products.
                </p>
            </TooltipProvider>
        </div>
    )
}

function HighlightedTextWithPreview({ children, previewUrl, isFirst }: { children: ReactNode, previewUrl?: string, isFirst?: boolean }) {
    const { resolvedTheme } = useTheme();

    const registerPlatform = useGameElement<HTMLElement>({
        type: GameElement.PLATFORM,
        collisionSides: { top: true },
        surface: GameSurface.CARPET,
        events: isFirst ? {
            onPlayerEnter: (_payload) => {
                console.log("player reached top");

                // Fullscreen confetti shower!
                const duration = 3000;
                const end = Date.now() + duration;

                const frame = () => {
                    confetti({
                        particleCount: 50,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.8 },
                        colors: ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF', '#FF6B35']
                    });

                    confetti({
                        particleCount: 50,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.8 },
                        colors: ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF', '#FF6B35']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                };

                frame();
            },
            onPlayerLeave: (_payload) => {
                console.log("player left top");
                // Confetti automatically disappears, no cleanup needed
            },
        } : undefined,
    })
    const attachHighlighterRef = useCallback((instance: TextHighlighterRef | null) => {
        registerPlatform(instance?.componentElement ?? null)
    }, [registerPlatform])

    const highlighterProps = {
        className: "rounded-sm px-px mix-blend-difference",
        highlightColor: resolvedTheme === "dark"
            ? ["hsl(30, 70%, 45%)", "hsl(25, 85%, 35%)", "hsl(20, 90%, 25%)"]
            : ["hsl(45, 80%, 85%)", "hsl(35, 90%, 90%)", "hsl(40, 85%, 95%)"],
        useInViewOptions: { once: true, initial: true, amount: 0.1 },
        transition: { type: "spring", duration: 0.8, delay: 0.1, bounce: 0 } satisfies Transition,
    } satisfies Omit<ComponentProps<typeof TextHighlighter>, "children">;

    const highlighted = <TextHighlighter ref={attachHighlighterRef} {...highlighterProps}>{children}</TextHighlighter>;

    // for now, we skip the tooltip for all text
    if (!previewUrl || true) {
        return highlighted;
    }

    return (
        <Tooltip>
            <TooltipTrigger>{highlighted}</TooltipTrigger>
            <TooltipPopup className="rounded-md shadow-xl max-w-20 max-h-20 p-0" render={<img src={previewUrl} alt="Nature Pixel Art" />} />
        </Tooltip>
    )
}

function WorkExperience({ title, company, companyUrl, icon, startDate, endDate }: { title: string, company: string, companyUrl: string, icon: string, startDate: string, endDate: string }) {
    const platformRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.CONCRETE,
    })
    return (
        <Card ref={platformRef} className='p-2 gap-1 last:border-b-1'>
            <CardHeader className="p-0 flex justify-between flex-row flex-wrap items-start gap-2">
                <Avatar className="sm:size-12 rounded-xl bg-transparent">
                    <AvatarImage src={icon} alt={company} />
                    <AvatarFallback>
                        <BuildingIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <CardTitle className="text-md font-semibold">
                        {title}
                    </CardTitle>
                    <div className='flex flex-row items-center justify-between gap-2'>
                        <Link className="text-sm text-muted-foreground" to={companyUrl}>{company}</Link>
                        <span className="text-sm text-muted-foreground whitespace-pre">
                            <time dateTime={startDate}>{formatDate(startDate)}</time> - <time dateTime={endDate}>{formatDate(endDate)}</time>
                        </span>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

function Project({ name, github, website, startDate, endDate, description, details }: { name: string, github: string, website: string, startDate: string, endDate: string, description: string, details: string[] }) {
    const platformRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
    })

    return (
        <AccordionItem render={<div ref={platformRef} />} className='px-2 py-1 gap-1 rounded border border-border/60 bg-card/60 last:border-b-1'>
            <AccordionTrigger className="p-0 flex flex-row justify-between items-center [&[data-panel-open]_svg[data-chevron]]:rotate-90 group">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-semibold">{name}</span>
                            <ProjectLinks github={github} website={website} />
                        </div>
                        <span className="text-xs text-muted-foreground block">
                            {startDate && endDate && `${formatDate(startDate)} - ${formatDate(endDate)}`}
                        </span>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionPanel className="text-sm text-muted-foreground mt-1">
                <div>{description}</div>
                {details && (
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                        {details.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                )}
            </AccordionPanel>
        </AccordionItem>
    )
}

function ProjectLinks({ github, website }: { github?: string; website?: string }) {
    return (
        <div className="flex items-center gap-2 ml-2">
            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="View on GitHub"
                >
                    <GithubIcon className="size-4" />
                </a>
            )}
            {website && (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Visit website"
                >
                    <ExternalLink className="size-4" />
                </a>
            )}
        </div>
    )
}

function formatDate(dateStr: string) {
    if (dateStr === "Present") return "Present"
    const date = new Date(dateStr)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    return `${month} ${year}`
}
