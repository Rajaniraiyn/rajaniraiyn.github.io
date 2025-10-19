import { useGame } from "@/contexts/game";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardFooter } from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipPopup } from "@/components/ui/tooltip";
import { Square, Gamepad2, Volume2, VolumeX, Play, Music } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useCallback, useState } from "react";

export function Game() {
    const characterRef = useRef<HTMLImageElement>(null);
    const { addPlayer, isRunning, startGame, stopGame, soundEnabled, musicEnabled, toggleSound, toggleMusic } = useGame();
    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(true);

    const handleStartGame = useCallback(() => {
        setShowInstructions(false);
        startGame();
    }, [startGame]);

    const handleStopGame = useCallback(() => {
        stopGame();
        setShowInstructions(true);
        navigate({ to: '/' });
    }, [stopGame, navigate]);

    useEffect(() => {
        if (!characterRef.current) return;

        const game = addPlayer(characterRef.current);
        return () => game?.dispose();
    }, [addPlayer]);

    return (
        <>
            {/* Game Character - only visible when running */}
            <img
                className={`size-20 -left-6! z-100 will-change-transform transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                ref={characterRef}
                alt="Character"
                style={{ transform: 'translateX(-50%)' }}
            />

            {/* Fullscreen Instructions Dialog */}
            {showInstructions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-md">
                        <Card className="shadow-2xl">
                            <CardHeader className="text-center space-y-3 pb-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Gamepad2 className="size-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-departure-mono">Platform Game</h2>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Navigate through this interactive portfolio using platformer controls
                                </p>
                            </CardHeader>

                            <CardPanel className="space-y-6">
                                {/* Goal */}
                                <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-accent-foreground/80">
                                        Objective
                                    </h3>
                                    <p className="text-sm text-accent-foreground/70 leading-relaxed">
                                        Reach the pinnacle of this world (page) and discover what's at the top!
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground/80">
                                        Controls
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-muted-foreground text-sm">Move Left/Right</span>
                                            <KbdGroup>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">A</Kbd>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">D</Kbd>
                                                <span className="text-muted-foreground mx-1 text-xs">or</span>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">←</Kbd>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">→</Kbd>
                                            </KbdGroup>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-muted-foreground text-sm">Jump</span>
                                            <KbdGroup>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">W</Kbd>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">↑</Kbd>
                                                <Kbd className="bg-muted hover:bg-muted/80 transition-colors">Space</Kbd>
                                            </KbdGroup>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-muted-foreground text-sm">Walk (slower)</span>
                                            <Kbd className="bg-muted hover:bg-muted/80 transition-colors">Shift</Kbd>
                                        </div>
                                    </div>
                                </div>
                            </CardPanel>

                            <CardFooter>
                                <Button
                                    onClick={handleStartGame}
                                    className="w-full"
                                    size="lg"
                                >
                                    <Play className="size-4 mr-2" />
                                    Start Game
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}

            {/* Game Controls Overlay - when game is running */}
            {isRunning && (
                <>
                    {/* Top Controls */}
                    <div className="fixed top-4 right-4 z-50 flex gap-2">
                        <TooltipProvider delay={0}>
                            {/* Music Toggle */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        onClick={toggleMusic}
                                        variant="outline"
                                        size="sm"
                                        className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg hover:bg-accent transition-colors"
                                    >
                                        <Music className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipPopup>
                                    {musicEnabled ? 'Disable Background Music' : 'Enable Background Music'}
                                </TooltipPopup>
                            </Tooltip>

                            {/* Sound Toggle */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        onClick={toggleSound}
                                        variant="outline"
                                        size="sm"
                                        className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg hover:bg-accent transition-colors"
                                    >
                                        {soundEnabled ? (
                                            <Volume2 className="size-4" />
                                        ) : (
                                            <VolumeX className="size-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipPopup>
                                    {soundEnabled ? 'Disable Game Sounds' : 'Enable Game Sounds'}
                                </TooltipPopup>
                            </Tooltip>

                            {/* Stop Button */}
                            <Button
                                onClick={handleStopGame}
                                variant="destructive"
                                size="sm"
                                className="bg-destructive/95 backdrop-blur-sm shadow-lg hover:bg-destructive/90 transition-colors"
                            >
                                <Square className="size-4 mr-2" />
                                Stop Game
                            </Button>
                        </TooltipProvider>
                    </div>

                    {/* Bottom Controls Hint */}
                    <div className="fixed inset-x-0 bottom-0 z-50 p-3">
                        <div className="mx-auto max-w-4xl">
                            <Card className="bg-card/95 border-border/60 shadow-lg py-2 px-4">
                                <div className="flex items-center justify-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Kbd className="bg-muted/80 hover:bg-muted text-xs px-1.5 py-0.5 min-w-[24px] text-center">A</Kbd>
                                        <Kbd className="bg-muted/80 hover:bg-muted text-xs px-1.5 py-0.5 min-w-[24px] text-center">D</Kbd>
                                        <span className="text-xs text-muted-foreground">Move</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Kbd className="bg-muted/80 hover:bg-muted text-xs px-1.5 py-0.5 min-w-[24px] text-center">W</Kbd>
                                        <span className="text-xs text-muted-foreground">Jump</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Kbd className="bg-muted/80 hover:bg-muted text-xs px-1.5 py-0.5 min-w-[28px] text-center">Shift</Kbd>
                                        <span className="text-xs text-muted-foreground">Walk</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Kbd className="bg-muted/80 hover:bg-muted text-xs px-1.5 py-0.5 min-w-[36px] text-center">Space</Kbd>
                                        <span className="text-xs text-muted-foreground">Jump</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}