import santaBrowserFaviconSrc from '@/assets/images/santabrowser-favicon.svg'
import gameTowerPixelArtSrc from '@/assets/wallpapers/game-tower.jpeg'
import naturePixelArtSrc from '@/assets/wallpapers/nature.jpeg'
import { Game } from '@/components/cheats/game'
import { TextHighlighter, type TextHighlighterRef } from "@/components/fancy/text/text-highlighter"
import { GitHubContributions } from '@/components/github-contributions'
import { DevToIcon, GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from '@/components/icons'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/contexts/theme'
import { projects, type Project, type Project as ProjectItem } from "@/data/projects"
import { stack, type Stack } from "@/data/stack"
import { works, type Work } from "@/data/works"
import { useGameElement } from '@/hooks/use-game-element'
import { useStorage } from '@/hooks/use-storage'
import { GameElement, GameSurface } from '@/lib/mario-game'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import confetti from "canvas-confetti"
import { BuildingIcon, ExternalLink, GithubIcon as GithubIconLucide } from 'lucide-react'
import type { Transition } from "motion"
import type { ComponentProps, ReactNode } from 'react'
import { Children, useCallback, useState } from 'react'
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
    const techStackRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, bottom: true, left: true, right: true },
    })
    const connectTitleRef = useGameElement<HTMLHeadingElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, bottom: true, left: true, right: true },
    })
    const connectDescriptionRef = useGameElement<HTMLParagraphElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, },
    })

    const connectLinksRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, },
    })
    const connectFooterRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, },
    })

    return (
        <div className='space-y-10 scroll-pt-1'>
            <section className='px-2'>
                <h2 className='text-2xl font-bold sr-only'>About</h2>
                <About />
            </section>
            <section className='space-y-4 px-2 max-w-3xl mx-auto'>
                <h2 ref={workExperienceTitleRef} className='text-2xl font-bold font-departure-mono uppercase w-fit'>Work Experience</h2>
                <Accordion className='flex flex-col gap-4 md:px-5' multiple>
                    {Object.entries(works).map(([key, work]) => (
                        <WorkExperience
                            key={key}
                            {...work}
                        />
                    ))}
                </Accordion>

            </section>
            <section className='space-y-4 px-2'>
                <h2 ref={projectsTitleRef} className='text-2xl font-bold font-departure-mono uppercase w-fit'>Projects</h2>
                <Accordion className='flex flex-col gap-4 md:px-5' multiple={false}>
                    {Object.entries(projects).map(([key, project]) => (
                        <ProjectItem key={key} {...project} />
                    ))}
                </Accordion>
            </section>
            <section className='space-y-4 px-2 max-w-screen md:max-w-3xl mx-auto overflow-x-scroll'>
                <GitHubContributions />
            </section>
            <section className='space-y-4 px-2'>
                <h2 ref={techStackRef} className='text-2xl font-bold font-departure-mono uppercase w-fit'>Stack</h2>
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(3rem,1fr))] gap-2">
                    {Object.entries(stack).map(([key, stack]) => (
                        <TechStackItem key={key} stack={stack} />
                    ))}
                </div>
            </section>
            <section className="space-y-4 px-2">
                <div className="relative z-10 space-y-3 text-center">
                    <h2 ref={connectTitleRef} className="text-xl w-fit font-medium lg:text-2xl font-departure-mono uppercase">Connect</h2>
                    <p ref={connectDescriptionRef} className="text-muted-foreground mx-auto max-w-3xl font-light text-sm md:text-md">
                        You can find me on everywhere with handle @rajaniraiyn Also see all
                        social links in here
                    </p>
                </div>
                <div className="mx-auto max-w-4xl backdrop-blur-3xl [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
                    <div ref={connectLinksRef} className="bg-background gap-x-6 grid md:grid-cols-2 dark:bg-muted/50 rounded-xl border px-6 py-3 shadow-xl">
                        <SocialLink
                            icon={<GithubIcon />}
                            name="Github"
                            link="https://github.com/rajaniraiyn"
                            description="Explore my open-source projects and code repositories."
                        />
                        <SocialLink
                            icon={<LinkedinIcon />}
                            name="LinkedIn"
                            link="https://www.linkedin.com/in/rajaniraiyn/"
                            description="Connect with me professionally and explore my career journey."
                        />
                        <SocialLink
                            icon={<XIcon />}
                            name="X"
                            link="https://x.com/rajaniraiyn"
                            description="Follow me for design insights, tech updates, and creative content."
                        />
                        <SocialLink
                            icon={<InstagramIcon />}
                            name="Instagram"
                            link="https://www.instagram.com/rajaniraiyn/"
                            description="Visual stories, behind-the-scenes, and creative inspiration."
                        />
                        <SocialLink
                            icon={<YoutubeIcon />}
                            name="Youtube"
                            link="https://www.youtube.com/@rajaniraiyn"
                            description="Watch tutorials, design processes, and creative content."
                        />
                        <SocialLink
                            icon={<DevToIcon />}
                            name="Dev.to"
                            link="https://dev.to/rajaniraiyn"
                            description="Watch tutorials, design processes, and creative content."
                        />
                    </div>
                </div>
                <p ref={connectFooterRef} className="text-muted-foreground max-w-lg mx-auto text-center font-light text-sm md:text-md">
                    For partnerships, collaborations, sponsorships, commissions, events,
                    you can reach out to me at{" "}
                    <a className="hover:underline text-primary font-semibold" href="mailto:rajaniraiyn@gmail.com">rajaniraiyn@gmail.com</a>
                </p>
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
        className: "rounded-sm px-px mix-blend-multiply",
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

function WorkExperience({ title, company, companyUrl, icon, startDate, endDate, className, ...props }: React.ComponentProps<typeof Card> & Work) {
    const platformRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.CONCRETE,
    })


    return (
        <Card
            ref={platformRef}
            className={cn(
                'p-2 gap-1 last:border-b-1',
                'supports-[corner-shape:squircle]:corner-shape-squircle supports-[corner-shape:squircle]:rounded-4xl',
                'before:supports-[corner-shape:squircle]:corner-shape-squircle before:supports-[corner-shape:squircle]:rounded-4xl',
                className,
            )}
            {...props}
        >
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

function ProjectItem({ name, github, website, startDate, endDate, description, details }: Project) {
    const platformRef = useGameElement<HTMLDivElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
    })

    return (
        <AccordionItem
            render={<div ref={platformRef} />}
            className={cn(
                'px-2 py-1 gap-1 border border-border/60 bg-card/60 last:border-b-1',
                'supports-[corner-shape:squircle]:corner-shape-squircle supports-[corner-shape:squircle]:rounded-2xl',
                'before:supports-[corner-shape:squircle]:corner-shape-squircle before:supports-[corner-shape:squircle]:rounded-2xl'
            )}
        >
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
                        {Children.toArray(details).map((item, i) => (
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
                    <GithubIconLucide className="size-4" />
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

function TechStackItem({ stack }: { stack: Stack }) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)
    const [isPlayerIn, setIsPlayerIn] = useState(false)
    const platformRef = useGameElement<SVGSVGElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true },
        events: {
            onPlayerEnter: () => { setIsPlayerIn(true); setIsTooltipOpen(true) },
            onPlayerLeave: () => { setIsPlayerIn(false); setIsTooltipOpen(false) },
        }
    })
    return (
        <Tooltip delay={0} closeDelay={0} hoverable={false} trackCursorAxis={isPlayerIn ? 'none' : 'x'} open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger render={<stack.icon ref={platformRef} />} tabIndex={0} className="size-full cursor-help" />
            <TooltipPopup
                side={isPlayerIn ? 'bottom' : 'top'}
                // sideOffset={isPlayerIn ? -25 : undefined}
                align={isPlayerIn ? 'start' : 'center'}
                className='max-w-3xs flex-col gap-2'
            >
                <div>
                    <h3 className="text-lg font-medium">{stack.name}</h3>
                    <p className="text-balance">{stack.description}</p>
                </div>
                <Progress value={stack.proficiency * 100} className="w-full">
                    <ProgressTrack>
                        <ProgressIndicator className="bg-gradient-to-t from-secondary to-primary rounded" />
                    </ProgressTrack>
                </Progress>
            </TooltipPopup>
        </Tooltip>
    )
}

const SocialLink = ({
    icon,
    name,
    link,
    description,
}: {
    icon: React.ReactNode;
    name: string;
    link: string;
    description: string;
}) => {
    const platformRef = useGameElement<HTMLAnchorElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true, },
    })
    return (
        <Link
            ref={platformRef}
            target="_blank"
            to={link}
            className="grid hover:bg-secondary hover:rounded-xl grid-cols-[auto_1fr_auto] items-center rounded-b-none gap-3 border-b border-dashed p-3 last:border-b-0"
        >
            <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
                {icon}
            </div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                    {description}
                </p>
            </div>
        </Link>
    );
};
