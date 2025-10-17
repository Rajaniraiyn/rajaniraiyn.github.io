import manCartwheelingMediumDarkSrc from "@/assets/animated/man_cartwheeling_medium-dark.png"
import manDancingMediumDarkSrc from "@/assets/animated/man_dancing_medium-dark.png"
import manRunningFacingRightMediumDarkSrc from "@/assets/animated/man_running_facing_right_medium-dark.png"
import manRunningMediumDarkSrc from "@/assets/animated/man_running_medium-dark.png"
import manStandingMediumDarkSrc from "@/assets/animated/man_standing_medium-dark.png"
import manWalkingFacingRightMediumDarkSrc from "@/assets/animated/man_walking_facing_right_medium-dark.png"
import manWalkingMediumDarkSrc from "@/assets/animated/man_walking_medium-dark.png"
import { useCallback, useEffect, useRef, useState } from "react"

// Constants
const Man = {
    CARTWHEELING: manCartwheelingMediumDarkSrc,
    DANCING: manDancingMediumDarkSrc,
    RUNNING_RIGHT: manRunningFacingRightMediumDarkSrc,
    RUNNING_LEFT: manRunningMediumDarkSrc,
    STANDING: manStandingMediumDarkSrc,
    WALKING_RIGHT: manWalkingFacingRightMediumDarkSrc,
    WALKING_LEFT: manWalkingMediumDarkSrc,
} as const;

const GAME_CONFIG = {
    GRAVITY: 9.81,
    ACCELERATION: 20,
    FRICTION: 0.9,
    RUNNING_THRESHOLD: 5,
    VELOCITY_STOP_THRESHOLD: 0.1,
    COLLISION_WIDTH_RATIO: 0.5, // Use center 50% of character width for collision
} as const;

// Types
type CharacterState = {
    action: string;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
};

type KeysPressed = {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
};

// Game Engine Architecture
class GameEngine {
    private floors: DOMRect[] = [];
    private characterRect: DOMRect | null = null;

    // Update floor positions (call this when DOM might change)
    updateFloorPositions() {
        this.floors = Array.from(document.querySelectorAll('[data-game="floor"]'))
            .map(elem => elem.getBoundingClientRect());
    }

    // Update character position in screen coordinates
    updateCharacterRect(characterElement: HTMLImageElement | null) {
        this.characterRect = characterElement?.getBoundingClientRect() || null;
    }

    // Convert logical position to screen position
    logicalToScreen(x: number, y: number) {
        const dpr = window.devicePixelRatio || 1;
        return {
            screenX: x / dpr,
            screenY: y / dpr
        };
    }

    // Check if character is currently grounded (touching a floor)
    isGrounded(): boolean {
        if (!this.characterRect) return false;

        const characterBottom = this.characterRect.bottom;
        const characterWidth = this.characterRect.width;
        const characterCenterX = this.characterRect.left + characterWidth / 2;
        const collisionWidth = characterWidth * GAME_CONFIG.COLLISION_WIDTH_RATIO;

        // Only check the center portion of the character
        const collisionLeft = characterCenterX - collisionWidth / 2;
        const collisionRight = characterCenterX + collisionWidth / 2;

        for (const floor of this.floors) {
            // Check horizontal overlap with center collision area
            const horizontalOverlap = collisionRight > floor.left && collisionLeft < floor.right;

            if (horizontalOverlap) {
                // Check if character bottom is touching or very close to floor top
                const tolerance = 2; // pixels
                if (Math.abs(characterBottom - floor.top) <= tolerance) {
                    return true;
                }
            }
        }

        return false;
    }

    // Check floor collision using predicted position
    checkFloorCollision(
        currentX: number,
        currentY: number,
        newVelocityX: number,
        newVelocityY: number,
        characterWidth: number,
        characterHeight: number
    ): { collided: boolean; floorY?: number } {
        // Only check collision when falling
        if (newVelocityY <= 0) {
            return { collided: false };
        }

        // Calculate predicted position
        const predictedX = currentX + newVelocityX;
        const predictedY = currentY + newVelocityY;

        // Convert to screen coordinates for collision check
        const screenPos = this.logicalToScreen(predictedX, predictedY);
        const characterBottom = screenPos.screenY + characterHeight;
        const characterCenterX = screenPos.screenX + characterWidth / 2;
        const collisionWidth = characterWidth * GAME_CONFIG.COLLISION_WIDTH_RATIO;

        // Only check the center portion of the character
        const collisionLeft = characterCenterX - collisionWidth / 2;
        const collisionRight = characterCenterX + collisionWidth / 2;

        for (const floor of this.floors) {
            // Check horizontal overlap with center collision area
            const horizontalOverlap = collisionRight > floor.left && collisionLeft < floor.right;

            if (horizontalOverlap) {
                // Check if predicted position would intersect with floor
                if (characterBottom >= floor.top) {
                    return {
                        collided: true,
                        floorY: floor.top - characterHeight // Position character exactly on floor
                    };
                }
            }
        }

        return { collided: false };
    }

    // Apply gravity (always active)
    applyGravity(velocityY: number): number {
        return velocityY + GAME_CONFIG.GRAVITY * 0.1;
    }

    // Apply horizontal velocity updates
    applyHorizontalMovement(velocityX: number, keysPressed: KeysPressed): number {
        let newVelocity = velocityX;

        if (keysPressed.right) {
            newVelocity += GAME_CONFIG.ACCELERATION * 0.1;
        }
        if (keysPressed.left) {
            newVelocity -= GAME_CONFIG.ACCELERATION * 0.1;
        }

        // Apply friction when no keys are pressed
        if (!keysPressed.left && !keysPressed.right) {
            newVelocity *= GAME_CONFIG.FRICTION;
            if (Math.abs(newVelocity) < GAME_CONFIG.VELOCITY_STOP_THRESHOLD) {
                newVelocity = 0;
            }
        }

        return newVelocity;
    }

    // Apply velocity updates with collision response
    updatePosition(
        x: number,
        y: number,
        velocityX: number,
        velocityY: number,
        keysPressed: KeysPressed
    ): { newX: number; newY: number; newVelocityX: number; newVelocityY: number } {

        // Apply horizontal movement first
        let newVelocityX = this.applyHorizontalMovement(velocityX, keysPressed);

        // Apply gravity only if not grounded
        let newVelocityY = velocityY;
        if (!this.isGrounded()) {
            newVelocityY = this.applyGravity(velocityY);
        }

        // Get character dimensions for collision detection
        const characterWidth = this.characterRect?.width || 80;
        const characterHeight = this.characterRect?.height || 80;

        // Check floor collision using predicted position (only when falling)
        const collision = this.checkFloorCollision(
            x, y, newVelocityX, newVelocityY, characterWidth, characterHeight
        );

        // Calculate new positions
        let newX = x + newVelocityX;
        let newY = y + newVelocityY;

        // Resolve collision if detected
        if (collision.collided && collision.floorY !== undefined) {
            // Convert floorY from screen coordinates back to logical coordinates
            const dpr = window.devicePixelRatio || 1;
            newY = collision.floorY * dpr; // Convert screen Y back to logical Y
            newVelocityY = 0; // Stop falling completely
        }

        return { newX, newY, newVelocityX, newVelocityY };
    }
}

// Global game engine instance
const gameEngine = new GameEngine();

// Utility functions
const applyDPRScaling = (value: number): number => {
    return value / (window.devicePixelRatio || 1);
};

const getActionFromVelocity = (velocityX: number): string => {
    const speed = Math.abs(velocityX);
    if (speed === 0) return Man.STANDING;
    if (speed > GAME_CONFIG.RUNNING_THRESHOLD) {
        return velocityX > 0 ? Man.RUNNING_RIGHT : Man.RUNNING_LEFT;
    }
    return velocityX > 0 ? Man.WALKING_RIGHT : Man.WALKING_LEFT;
};


// Custom hooks
const useGameState = (initialState: CharacterState) => {
    const [state, setState] = useState<CharacterState>(initialState);

    const updateState = useCallback((updater: (prev: CharacterState) => CharacterState) => {
        setState(updater);
    }, []);

    return [state, updateState] as const;
};

const useKeyboardControls = () => {
    const [keysPressed, setKeysPressed] = useState<KeysPressed>({
        left: false,
        right: false,
        up: false,
        down: false,
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, left: true }));
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, right: true }));
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, up: true }));
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, down: true }));
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, left: false }));
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, right: false }));
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, up: false }));
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    setKeysPressed(prev => ({ ...prev, down: false }));
                    break;
            }
        };

        const controller = new AbortController();
        document.addEventListener("keydown", handleKeyDown, { signal: controller.signal });
        document.addEventListener("keyup", handleKeyUp, { signal: controller.signal });

        return () => controller.abort();
    }, []);

    return keysPressed;
};

const useGameLoop = (
    characterRef: React.RefObject<HTMLImageElement | null>,
    keysPressed: KeysPressed,
    updateState: (updater: (prev: CharacterState) => CharacterState) => void
) => {
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const gameLoop = () => {
            updateState(prevState => {
                // Update floor positions every frame for accurate collision detection
                gameEngine.updateFloorPositions();

                // Update character rect for collision detection
                gameEngine.updateCharacterRect(characterRef.current);

                // Use game engine to calculate new position with physics
                const { newX, newY, newVelocityX, newVelocityY } = gameEngine.updatePosition(
                    prevState.x,
                    prevState.y,
                    prevState.velocityX,
                    prevState.velocityY,
                    keysPressed
                );

                // Determine new action based on horizontal velocity
                const newAction = getActionFromVelocity(newVelocityX);

                // Update DOM element position directly (smooth via 60fps updates)
                if (characterRef.current) {
                    characterRef.current.style.transform = `translate(${applyDPRScaling(newX)}px, ${applyDPRScaling(newY)}px)`;

                    // Update sprite if action changed
                    if (prevState.action !== newAction) {
                        characterRef.current.src = newAction;
                    }
                }

                return {
                    ...prevState,
                    x: newX,
                    y: newY,
                    velocityX: newVelocityX,
                    velocityY: newVelocityY,
                    action: newAction,
                };
            });

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        // Initialize floor positions
        gameEngine.updateFloorPositions();

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [keysPressed, updateState]);

    return animationFrameRef;
};

// Main component
export function Game() {
    const characterRef = useRef<HTMLImageElement>(null);
    const [characterState, updateCharacterState] = useGameState({
        action: Man.STANDING,
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
    });

    const keysPressed = useKeyboardControls();

    // Initialize character
    useEffect(() => {
        const character = characterRef.current;
        if (!character) return;

        character.src = characterState.action;
        character.style.transformOrigin = "bottom center";
        // Set initial position without CSS custom properties since we're using element.animate()
        character.style.transform = `translate(0px, 0px)`;
    }, []); // Only run once on mount

    // Update sprite when action changes
    useEffect(() => {
        const character = characterRef.current;
        if (!character) return;

        character.src = characterState.action;
    }, [characterState.action]);

    // Start game loop
    useGameLoop(characterRef, keysPressed, updateCharacterState);

    return (
        <img
            className="size-20 absolute top-0 left-0"
            ref={characterRef}
            alt="Character"
        />
    );
}