import { COMPANIES } from '@/data/works'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod/mini'
import { works } from '@/data/works'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { BuildingIcon, ExternalLink, CalendarIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const validateParams = z.object({
    company: z.enum(COMPANIES),
})

export const Route = createFileRoute('/work/@{$company}')({
    beforeLoad: ({ params }) => validateParams.parse(params),
    loader: async ({ context }) => works[context.company],
    component: RouteComponent,
})

function RouteComponent() {
    const work = Route.useLoaderData()

    const formatDate = (dateStr: string) => {
        if (dateStr === "Present") return "Present"
        const date = new Date(dateStr)
        const month = date.toLocaleString('default', { month: 'short' })
        const year = date.getFullYear()
        return `${month} ${year}`
    }

    return (
        <div className='space-y-8 scroll-pt-1 px-2'>
            {/* Header Section */}
            <section className='space-y-6'>
                <div className='flex flex-col items-center space-y-4 text-center'>
                    <Avatar className="size-20 sm:size-24 rounded-2xl bg-muted border-2 border-border">
                        <AvatarImage src={work.icon} alt={work.company} />
                        <AvatarFallback className="rounded-2xl">
                            <BuildingIcon className="size-8" />
                        </AvatarFallback>
                    </Avatar>

                    <div className='space-y-2'>
                        <h1 className='text-2xl font-bold font-departure-mono uppercase tracking-tight sm:text-4xl'>
                            with {work.company}
                        </h1>
                        <p className='text-lg font-semibold text-muted-foreground'>
                            {work.title}
                        </p>
                        <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                            <CalendarIcon className="size-4" />
                            <time dateTime={work.startDate}>{formatDate(work.startDate)}</time>
                            <span>-</span>
                            <time dateTime={work.endDate}>{formatDate(work.endDate)}</time>
                            <Link
                                to={work.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 ml-2 text-primary hover:text-primary/80 transition-colors"
                            >
                                <ExternalLink className="size-3" />
                                Visit
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Company Description */}
                <Card className='max-w-2xl mx-auto border-none bg-card/50'>
                    <CardContent className='p-6'>
                        <div className="prose dark:prose-invert prose-sm max-w-none text-center">
                            {work.company === 'portal' && (
                                <p className="text-muted-foreground leading-relaxed">
                                    Building the future of web interaction through AI-powered browsing.
                                    Portal combines advanced RAG systems, multi-agent architectures, and
                                    seamless UX design to transform how users interact with the web.
                                </p>
                            )}
                            {work.company === 'santa' && (
                                <p className="text-muted-foreground leading-relaxed">
                                    Crafting privacy-focused browsers with cutting-edge performance.
                                    Santa Browser delivers Chromium-powered browsing with enhanced
                                    security, custom features, and a delightful user experience.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Timeline Section */}
            <section className='space-y-6'>
                <h2 className='text-xl font-bold font-departure-mono uppercase tracking-tight text-center'>
                    Journey Timeline
                </h2>

                <div className="relative mx-auto max-w-4xl">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-8">
                        {work.timeline.map((entry, index) => (
                            <div key={index} className="relative flex gap-6">
                                {/* Timeline dot */}
                                <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm">
                                    <div className="size-3 rounded-full bg-primary" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3 pb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <h3 className="text-lg font-semibold tracking-tight">
                                            {entry.title}
                                        </h3>
                                        <Badge variant="secondary" className="w-fit shrink-0">
                                            {entry.date}
                                        </Badge>
                                    </div>

                                    <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
                                        <CardContent className="p-4">
                                            <div
                                                className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: entry.content }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
