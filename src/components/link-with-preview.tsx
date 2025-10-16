import { ThemedImg } from '@/components/themed-img'
import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from '@/components/ui/preview-card'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Link2Icon } from 'lucide-react'

export interface LinkWithPreviewProps extends React.ComponentProps<typeof Link> {
    previewUrl?: string | React.ComponentProps<typeof ThemedImg>['src']
}

export function LinkWithPreview({ to, previewUrl, children, className, ...props }: LinkWithPreviewProps) {

    const LinkTarget = ({ ref, ...renderProps }: React.ComponentProps<typeof Link>) => {
        return (
            <Link
                to={to}
                className={cn('inline-block hover:underline hover:decoration-dashed focus-within:decoration-wavy active:decoration-wavy', className)}
                ref={ref}
                {...renderProps}
                {...props}
            >
                {({ isActive, isTransitioning }) => (
                    <>
                        {children}
                        <Link2Icon className={cn('size-3 inline-block', {
                            "text-primary": isActive,
                            "animate-pulse": isTransitioning,
                        })} />
                    </>
                )}
            </Link>
        )
    }

    if (!previewUrl) {
        return <LinkTarget {...props} />
    }

    return (
        <PreviewCard>
            <PreviewCardTrigger render={LinkTarget} />
            <PreviewCardPopup className='p-px border rounded-md overflow-clip' >
                {typeof previewUrl === 'string' ? <img className='rounded-md' src={previewUrl} /> : <ThemedImg className='rounded-md' src={previewUrl} />}
            </PreviewCardPopup>
        </PreviewCard>
    )
}