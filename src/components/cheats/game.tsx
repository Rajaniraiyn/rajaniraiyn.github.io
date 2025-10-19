import { useGame } from "@/contexts/game";
import { useEffect, useRef } from "react";

export function Game() {
    const characterRef = useRef<HTMLImageElement>(null);
    const { addPlayer } = useGame();

    useEffect(() => {
        if (!characterRef.current) return

        const game = addPlayer(characterRef.current);
        return () => game?.dispose();
    }, [addPlayer]);

    return (
        <img className="size-20 -left-6! z-100 scroll-mt-[25vh]" ref={characterRef} alt="Character" style={{ transform: 'translateX(-50%)' }} />
    );
}