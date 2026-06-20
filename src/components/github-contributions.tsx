import { useTheme } from "@/contexts/use-theme";
import GitHubCalendar from "react-github-calendar";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";
import { GameElement, GameSurface } from "@/lib/game-types";
import { useGameElement } from "@/hooks/use-game-element";

type Activity = {
    date: string;
    count: number;
    level: number;
};

export function GitHubContributions() {
    const { resolvedTheme } = useTheme()
    return (
        <GitHubCalendar
            username="rajaniraiyn"
            colorScheme={resolvedTheme}
            showWeekdayLabels
            weekStart={1}
            renderBlock={(block, activity) => (
                <ContributionBlock block={block} activity={activity} />
            )}
            renderColorLegend={renderColorLegend}
        />
    )
}

function ContributionBlock({ block, activity }: { block: React.ReactNode; activity: Activity }) {
    const platformRef = useGameElement<SVGSVGElement>({
        type: GameElement.PLATFORM,
        surface: GameSurface.WOOD,
        collisionSides: { top: true },
    })
    return (
        <Tooltip delay={0} closeDelay={0} hoverable={false} trackCursorAxis="both">
            <TooltipTrigger render={<g ref={platformRef} />}>
                {block}
            </TooltipTrigger>
            <TooltipPopup>
                {levelToText(activity.level)}
                {" • "}
                {activity.count}
                {" • "}
                {activity.date}
            </TooltipPopup>
        </Tooltip>
    )
}

function renderColorLegend(block: React.ReactNode, level: number) {
    return (
        <Tooltip delay={0} closeDelay={0} hoverable={false} trackCursorAxis="x">
            <TooltipTrigger render={<g />} >
                {block}
            </TooltipTrigger>
            <TooltipPopup>
                {levelToText(level)}
            </TooltipPopup>
        </Tooltip>
    )
}

function levelToText(level: number) {
    switch (level) {
        case 0:
            return '😴 Sleepy'
        case 1:
            return '🛋️ Lazy'
        case 2:
            return '🏃 Active'
        case 3:
            return '🧑‍💻 Busy'
        case 4:
            return '🤩 Crazy'
    }
    return '❓ Unknown'
}