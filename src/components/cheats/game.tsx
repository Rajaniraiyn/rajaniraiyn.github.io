import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGame } from "@/contexts/game";
import { Man } from "@/lib/mario-game";
import { useNavigate } from '@tanstack/react-router';
import { Gamepad2, Loader2, Music, Play, Square, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Game() {
    const characterRef = useRef<HTMLImageElement>(null);
    const { addPlayer, isRunning, startGame, stopGame, soundEnabled, musicEnabled, toggleSound, toggleMusic } = useGame();
    const navigate = useNavigate();
    const [isGameDialogOpen, setIsGameDialogOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const handleStartGame = useCallback(() => {
        startGame();
        setIsGameDialogOpen(false);
        navigate({ to: '/', search: { game: true }, replace: true });
    }, [startGame, navigate]);

    const handleStopGame = useCallback(() => {
        stopGame();
        navigate({ to: '/', search: {}, replace: true, resetScroll: false });
    }, [stopGame, navigate]);

    // Preload all sprite images
    useEffect(() => {
        if (!isGameDialogOpen) {
            setIsLoading(true);
            setLoadingProgress(0);
            return;
        }

        const spriteUrls = Object.values(Man);
        let loadedCount = 0;
        const totalSprites = spriteUrls.length;

        const loadImage = (url: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    setLoadingProgress(Math.round((loadedCount / totalSprites) * 100));
                    resolve();
                };
                img.onerror = reject;
                img.src = url;
            });
        };

        Promise.all(spriteUrls.map(loadImage))
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load sprites:', error);
                setIsLoading(false);
            });
    }, [isGameDialogOpen]);

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

            {/* Instructions Dialog */}
            <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
                <DialogPopup className="max-w-md">
                    <DialogHeader className="text-center space-y-3 pb-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Gamepad2 className="size-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl font-bold font-departure-mono">Platform Game</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed">
                            Navigate through this interactive portfolio using platformer controls
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="space-y-4 py-6">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Loader2 className="size-8 animate-spin text-primary" />
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Loading assets...</span>
                                        <span>{loadingProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
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
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            onClick={handleStartGame}
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            <Play className="size-4 mr-2" />
                            Start Game
                        </Button>
                    </DialogFooter>
                </DialogPopup>
            </Dialog>

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