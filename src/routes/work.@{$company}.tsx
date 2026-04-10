import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { COMPANIES, works } from '@/data/works'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BuildingIcon, CalendarIcon, ExternalLink } from 'lucide-react'
import { z } from 'zod/mini'

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
            </section>

            <section className='space-y-6'>
                <h2 className='text-xl font-bold font-departure-mono uppercase tracking-tight text-center'>
                    Journey Timeline
                </h2>

                <div className="relative mx-auto max-w-4xl">
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border sm:left-[27px]" aria-hidden />

                    <div className="space-y-6">
                        {work.timeline.map((entry, index) => (
                            <article key={`${entry.date}-${index}`} className="grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
                                <div className="relative flex items-start justify-center pt-1">
                                    <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm">
                                        <div className="size-3 rounded-full bg-primary" />
                                    </div>
                                </div>

                                <div className="space-y-3 pb-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <h3 className="text-lg font-semibold tracking-tight">
                                            {entry.title}
                                        </h3>
                                        <Badge variant="secondary" className="w-fit shrink-0">
                                            {entry.date}
                                        </Badge>
                                    </div>

                                    <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
                                        <CardContent className="p-4">
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {entry.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
