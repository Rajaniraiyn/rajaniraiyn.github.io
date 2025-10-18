import manCartwheelingMediumDarkSrc from "@/assets/animated/man_cartwheeling_medium-dark.png"
import manDancingMediumDarkSrc from "@/assets/animated/man_dancing_medium-dark.png"
import manRunningFacingRightMediumDarkSrc from "@/assets/animated/man_running_facing_right_medium-dark.png"
import manRunningMediumDarkSrc from "@/assets/animated/man_running_medium-dark.png"
import manStandingMediumDarkSrc from "@/assets/animated/man_standing_medium-dark.png"
import manWalkingFacingRightMediumDarkSrc from "@/assets/animated/man_walking_facing_right_medium-dark.png"
import manWalkingMediumDarkSrc from "@/assets/animated/man_walking_medium-dark.png"
import { cancelFrame, frame, type FrameData } from "motion"

export const Man = {
    CARTWHEELING: manCartwheelingMediumDarkSrc,
    DANCING: manDancingMediumDarkSrc,
    RUNNING_RIGHT: manRunningFacingRightMediumDarkSrc,
    RUNNING_LEFT: manRunningMediumDarkSrc,
    STANDING: manStandingMediumDarkSrc,
    WALKING_RIGHT: manWalkingFacingRightMediumDarkSrc,
    WALKING_LEFT: manWalkingMediumDarkSrc,
} as const;

export enum GameElement {
    PLATFORM = "platform",
}

export const COLLISION = {
    NONE: 0,
    TOP: 1 << 0,
    BOTTOM: 1 << 1,
    LEFT: 1 << 2,
    RIGHT: 1 << 3,
    VERTICAL: (1 << 0) | (1 << 1),
    HORIZONTAL: (1 << 2) | (1 << 3),
    ALL: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
} as const;

export type CollisionMask =
    (typeof COLLISION)[keyof typeof COLLISION];

export type CollisionSides = Partial<{
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}>;

export interface PassThroughConfig {
    upward?: boolean;
    downward?: boolean;
    leftward?: boolean;
    rightward?: boolean;
}

interface GameElementBehavior {
    solid: boolean;
    collisionMask: CollisionMask;
    passThrough: PassThroughConfig;
}

const ELEMENT_BEHAVIOR: Record<GameElement, GameElementBehavior> = {
    [GameElement.PLATFORM]: {
        solid: true,
        collisionMask: COLLISION.TOP,
        passThrough: {
            upward: true,
        },
    },
};

const DEFAULT_BEHAVIOR: GameElementBehavior = {
    solid: false,
    collisionMask: COLLISION.NONE,
    passThrough: {},
};

export const GAME = {
    GRAVITY: 1920,             // px/sec^2
    TERMINAL_VELOCITY: 2800,   // px/sec downward cap
    ACCELERATION: 720,         // px/sec^2 when walking
    AIR_ACCELERATION: 480,     // px/sec^2 when airborne
    FRICTION: 960,             // px/sec^2 ground braking
    AIR_DRAG: 120,             // px/sec^2 air braking
    MAX_RUN_SPEED: 260,        // px/sec maximum running
    MAX_WALK_SPEED: 120,       // px/sec maximum walking
    WALK_THRESHOLD: 18,        // px/sec to be considered walking
    RUN_THRESHOLD: 150,        // px/sec to be considered running
    JUMP_VELOCITY: 1000,       // px/sec impulse up
    CHARACTER_WIDTH: 80,
    CHARACTER_HEIGHT: 80,
    GROUND_OFFSET: 80,         // px spacing from bottom of document
};

const MAX_FRAME_STEP = 0.033; // seconds (30 FPS cap)
const COLLISION_EPSILON = 1;
const MIN_SUPPORT_OVERLAP = 4;
const MIN_SIDE_OVERLAP = 4;

type PlayerState =
    | "STANDING"
    | "WALKING_LEFT"
    | "WALKING_RIGHT"
    | "RUNNING_LEFT"
    | "RUNNING_RIGHT"
    | "JUMPING_LEFT"
    | "JUMPING_RIGHT"
    | "JUMPING";

export interface GameRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GameElementRegistration {
    type: GameElement;
    collisionSides?: CollisionSides;
    collisionMask?: CollisionMask;
    passThrough?: PassThroughConfig;
    solid?: boolean;
    metadata?: Record<string, unknown>;
}

interface RegisteredElement {
    element: HTMLElement;
    type: GameElement;
    rect: GameRect;
    segments: GameRect[];
    behavior: GameElementBehavior;
    config: GameElementRegistration;
}

interface SupportInfo {
    entry: RegisteredElement;
    segmentIndex: number;
}

interface ControlsState {
    left: boolean;
    right: boolean;
    walk: boolean;
    jump: boolean;
}

const MOVEMENT_KEYS = new Set([
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    " ",
    "Space",
    "a",
    "A",
    "d",
    "D",
    "w",
    "W",
    "Shift",
    "ShiftLeft",
    "ShiftRight",
]);

export class MarioGame {
    private vx = 0; // horizontal velocity (px/sec)
    private vy = 0; // vertical velocity (px/sec)
    private x = 80; // horizontal position (px)
    private y = 0;  // vertical position (px)
    private grounded = false;

    private controls: ControlsState = { left: false, right: false, walk: false, jump: false };
    private jumpQueued = false;

    private disposables = new Set<() => void>();
    private lastState: PlayerState | null = null;

    private elementRegistry = new Map<HTMLElement, RegisteredElement>();
    private world = { width: 0, height: 0, groundTop: 0 };
    private dirtyElements = new Set<HTMLElement>();
    private worldDirty = true;
    private currentSupport: SupportInfo | null = null;

    public element: { [key in GameElement]: Set<HTMLElement> } = {
        [GameElement.PLATFORM]: new Set(),
    };

    constructor(private readonly playerEl: HTMLImageElement) {
        this.playerEl.style.position = "absolute";
        this.playerEl.style.top = "0px";
        this.playerEl.style.left = "0px";
        this.playerEl.src = Man.STANDING;

        this.measureWorld();
        this.worldDirty = false;
        this.y = this.world.groundTop - GAME.CHARACTER_HEIGHT;
        this.clampPositionToWorld();

        this.installInput();
        this.installEnvironmentObservers();
        const process = frame.preRender(this.tick, true);
        this.disposables.add(() => cancelFrame(process));
        this.layOut();
    }

    addElement(dom: HTMLElement, options: GameElementRegistration) {
        const behavior = this.resolveBehavior(options);
        const measurements = measureElement(dom);
        const entry: RegisteredElement = {
            element: dom,
            type: options.type,
            behavior,
            config: options,
            rect: measurements.rect,
            segments: measurements.segments,
        };

        this.elementRegistry.set(dom, entry);
        this.element[options.type].add(dom);
        this.markWorldDirty();
        this.markAllElementsDirty();
        this.markElementDirty(dom);

        const resizeObserver = new ResizeObserver(() => {
            this.markElementDirty(dom);
        });
        resizeObserver.observe(dom);

        const intersectionObserver = new IntersectionObserver(() => {
            this.markElementDirty(dom);
        });
        intersectionObserver.observe(dom);

        const cleanup = () => {
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            this.element[options.type].delete(dom);
            this.elementRegistry.delete(dom);
            this.dirtyElements.delete(dom);
            this.markWorldDirty();
            this.markAllElementsDirty();
            if (this.currentSupport?.entry.element === dom) {
                this.currentSupport = null;
            }
            this.disposables.delete(cleanup);
        };

        this.disposables.add(cleanup);
        return cleanup;
    }

    private resolveBehavior(config: GameElementRegistration): GameElementBehavior {
        const base = ELEMENT_BEHAVIOR[config.type] ?? DEFAULT_BEHAVIOR;
        const maskFromSides = collisionMaskFromSides(config.collisionSides);
        const collisionMask = config.collisionMask ?? maskFromSides ?? base.collisionMask;
        const passThrough = mergePassThrough(base.passThrough, config.passThrough);
        const solid = config.solid ?? base.solid ?? collisionMask !== COLLISION.NONE;

        return {
            solid,
            collisionMask,
            passThrough,
        };
    }

    private markElementDirty(element: HTMLElement) {
        if (this.elementRegistry.has(element)) {
            this.dirtyElements.add(element);
        }
    }

    private markAllElementsDirty() {
        for (const element of this.elementRegistry.keys()) {
            this.dirtyElements.add(element);
        }
    }

    private updateDirtyElementRects() {
        if (this.dirtyElements.size === 0) return;

        for (const element of this.dirtyElements) {
            const entry = this.elementRegistry.get(element);
            if (!entry) continue;
            if (!element.isConnected) {
                this.element[entry.type].delete(element);
                this.elementRegistry.delete(element);
                if (this.currentSupport?.entry.element === element) {
                    this.currentSupport = null;
                }
                continue;
            }
            const measurements = measureElement(element);
            entry.rect = measurements.rect;
            entry.segments = measurements.segments;
            if (this.currentSupport?.entry === entry && this.currentSupport.segmentIndex >= entry.segments.length) {
                this.currentSupport = null;
            }
        }

        this.dirtyElements.clear();
    }

    private markWorldDirty() {
        this.worldDirty = true;
    }

    private installEnvironmentObservers() {
        const handleEnvironmentChange = () => {
            this.markWorldDirty();
            this.markAllElementsDirty();
        };

        window.addEventListener("resize", handleEnvironmentChange, { passive: true });
        window.addEventListener("scroll", handleEnvironmentChange, { passive: true });

        const docResizeObserver = new ResizeObserver(handleEnvironmentChange);
        docResizeObserver.observe(document.documentElement);

        this.disposables.add(() => {
            window.removeEventListener("resize", handleEnvironmentChange);
            window.removeEventListener("scroll", handleEnvironmentChange);
            docResizeObserver.disconnect();
        });
    }

    dispose() {
        for (const dispose of this.disposables) {
            dispose();
        }
        this.disposables.clear();
        this.elementRegistry.clear();
        this.currentSupport = null;
        this.resetControls();
    }

    tick = (frameData: FrameData) => {
        const dt = Math.min(frameData.delta / 1000, MAX_FRAME_STEP);

        if (this.worldDirty) {
            this.measureWorld();
            this.worldDirty = false;
        }
        this.updateDirtyElementRects();

        this.handleInput(dt);
        this.handleJump();
        this.applyGravity(dt);

        const solids = this.getSolidElements();
        this.resolveHorizontalMotion(dt, solids);
        this.resolveVerticalMotion(dt, solids);

        this.clampPositionToWorld();
        this.layOut();
    };

    private handleInput(dt: number) {
        const desiredDir = (this.controls.left ? -1 : 0) + (this.controls.right ? 1 : 0);
        const targetMaxSpeed = this.controls.walk ? GAME.MAX_WALK_SPEED : GAME.MAX_RUN_SPEED;
        const acceleration = this.grounded ? GAME.ACCELERATION : GAME.AIR_ACCELERATION;

        if (desiredDir !== 0) {
            const targetVx = desiredDir * targetMaxSpeed;
            const accelStep = desiredDir * acceleration * dt;
            this.vx += accelStep;

            if (desiredDir > 0 && this.vx > targetVx) {
                this.vx = targetVx;
            } else if (desiredDir < 0 && this.vx < targetVx) {
                this.vx = targetVx;
            }
        } else {
            this.applyFriction(dt);
        }

        const absoluteMax = GAME.MAX_RUN_SPEED;
        this.vx = clamp(this.vx, -absoluteMax, absoluteMax);
    }

    private handleJump() {
        if (this.jumpQueued && this.grounded) {
            this.vy = -GAME.JUMP_VELOCITY;
            this.grounded = false;
            this.currentSupport = null;
            this.jumpQueued = false;
        }

        if (!this.controls.jump) {
            this.jumpQueued = false;
        }
    }

    private applyGravity(dt: number) {
        this.vy += GAME.GRAVITY * dt;
        this.vy = Math.min(this.vy, GAME.TERMINAL_VELOCITY);
    }

    private applyFriction(dt: number) {
        const friction = this.grounded ? GAME.FRICTION : GAME.AIR_DRAG;
        if (this.vx > 0) {
            this.vx = Math.max(0, this.vx - friction * dt);
        } else if (this.vx < 0) {
            this.vx = Math.min(0, this.vx + friction * dt);
        }
    }

    private resolveHorizontalMotion(dt: number, solids: RegisteredElement[]) {
        if (this.vx === 0) return;

        const nextX = this.x + this.vx * dt;
        const playerTop = this.y;
        const playerBottom = this.y + GAME.CHARACTER_HEIGHT;

        if (this.vx > 0) {
            let resolvedX = nextX;
            let collision = false;

            for (const entry of solids) {
                const { behavior } = entry;
                if (!(behavior.collisionMask & COLLISION.LEFT)) continue;
                if (behavior.passThrough.rightward) continue;

                for (const segment of entry.segments) {
                    const overlapY = overlapAmount(playerTop, playerBottom, segment.y, segment.y + segment.height);
                    if (overlapY < MIN_SIDE_OVERLAP) continue;

                    const obstacleLeft = segment.x;
                    const previousRight = this.x + GAME.CHARACTER_WIDTH;
                    const futureRight = nextX + GAME.CHARACTER_WIDTH;

                    if (previousRight <= obstacleLeft && futureRight > obstacleLeft) {
                        resolvedX = Math.min(resolvedX, obstacleLeft - GAME.CHARACTER_WIDTH);
                        collision = true;
                    }
                }
            }

            if (collision) {
                this.x = resolvedX;
                this.vx = 0;
            } else {
                this.x = nextX;
            }
        } else {
            let resolvedX = nextX;
            let collision = false;

            for (const entry of solids) {
                const { behavior } = entry;
                if (!(behavior.collisionMask & COLLISION.RIGHT)) continue;
                if (behavior.passThrough.leftward) continue;

                for (const segment of entry.segments) {
                    const overlapY = overlapAmount(playerTop, playerBottom, segment.y, segment.y + segment.height);
                    if (overlapY < MIN_SIDE_OVERLAP) continue;

                    const obstacleRight = segment.x + segment.width;
                    const previousLeft = this.x;
                    const futureLeft = nextX;

                    if (previousLeft >= obstacleRight && futureLeft < obstacleRight) {
                        resolvedX = Math.max(resolvedX, obstacleRight);
                        collision = true;
                    }
                }
            }

            if (collision) {
                this.x = resolvedX;
                this.vx = 0;
            } else {
                this.x = nextX;
            }
        }
    }

    private resolveVerticalMotion(dt: number, solids: RegisteredElement[]) {
        const startY = this.y;
        let nextY = startY + this.vy * dt;
        let grounded = false;

        const playerLeft = this.x;
        const playerRight = this.x + GAME.CHARACTER_WIDTH;

        let landingSupport: SupportInfo | null = null;

        if (this.vy > 0) {
            let landingSpot = Number.POSITIVE_INFINITY;

            for (const entry of solids) {
                const { behavior } = entry;
                if (!(behavior.collisionMask & COLLISION.TOP)) continue;
                if (behavior.passThrough.downward) continue;

                entry.segments.forEach((segment, segmentIndex) => {
                    const overlapX = overlapAmount(playerLeft, playerRight, segment.x, segment.x + segment.width);
                    if (overlapX < MIN_SUPPORT_OVERLAP) {
                        return;
                    }

                    const platformTop = segment.y;
                    const previousBottom = startY + GAME.CHARACTER_HEIGHT;
                    const futureBottom = nextY + GAME.CHARACTER_HEIGHT;

                    if (previousBottom <= platformTop && futureBottom >= platformTop) {
                        const candidate = platformTop - GAME.CHARACTER_HEIGHT;
                        if (candidate < landingSpot) {
                            landingSpot = candidate;
                            landingSupport = { entry, segmentIndex };
                        }
                    }
                });
            }

            if (landingSpot !== Number.POSITIVE_INFINITY) {
                nextY = landingSpot;
                this.vy = 0;
                grounded = true;
                this.currentSupport = landingSupport;
            }
        } else if (this.vy < 0) {
            let ceiling = Number.NEGATIVE_INFINITY;

            for (const entry of solids) {
                const { behavior } = entry;
                if (!(behavior.collisionMask & COLLISION.BOTTOM)) continue;
                if (behavior.passThrough.upward) continue;

                for (const segment of entry.segments) {
                    const overlapX = overlapAmount(playerLeft, playerRight, segment.x, segment.x + segment.width);
                    if (overlapX < MIN_SUPPORT_OVERLAP) {
                        continue;
                    }

                    const platformBottom = segment.y + segment.height;
                    const previousTop = startY;
                    const futureTop = nextY;

                    if (previousTop >= platformBottom && futureTop <= platformBottom) {
                        ceiling = Math.max(ceiling, platformBottom);
                    }
                }
            }

            if (ceiling !== Number.NEGATIVE_INFINITY) {
                nextY = ceiling;
                this.vy = 0;
            }
        }

        const groundTop = this.world.groundTop;
        const groundY = groundTop - GAME.CHARACTER_HEIGHT;

        if (nextY > groundY) {
            nextY = groundY;
            this.vy = 0;
            grounded = true;
            this.currentSupport = null;
        }

        this.y = nextY;
        if (!grounded) {
            grounded = this.isStandingOnSupport(solids);
        }
        this.grounded = grounded;
        if (!grounded) {
            this.currentSupport = null;
        }
    }

    private isStandingOnSupport(solids: RegisteredElement[]) {
        const playerBottom = this.y + GAME.CHARACTER_HEIGHT;
        const playerLeft = this.x;
        const playerRight = this.x + GAME.CHARACTER_WIDTH;

        if (this.currentSupport) {
            const { entry, segmentIndex } = this.currentSupport;
            if (!this.elementRegistry.has(entry.element)) {
                this.currentSupport = null;
            } else if (segmentIndex < entry.segments.length && this.canStandOn(entry, segmentIndex, playerLeft, playerRight, playerBottom)) {
                return true;
            } else {
                this.currentSupport = null;
            }
        }

        for (const entry of solids) {
            for (let i = 0; i < entry.segments.length; i++) {
                if (this.canStandOn(entry, i, playerLeft, playerRight, playerBottom)) {
                    this.currentSupport = { entry, segmentIndex: i };
                    return true;
                }
            }
        }

        this.currentSupport = null;
        return almostEqual(playerBottom, this.world.groundTop, COLLISION_EPSILON);
    }

    private canStandOn(entry: RegisteredElement, segmentIndex: number, playerLeft: number, playerRight: number, playerBottom: number) {
        const { behavior, segments } = entry;
        const segment = segments[segmentIndex];
        if (!segment) return false;
        if (!(behavior.collisionMask & COLLISION.TOP)) return false;
        if (behavior.passThrough.downward) return false;
        const overlapX = overlapAmount(playerLeft, playerRight, segment.x, segment.x + segment.width);
        if (overlapX < MIN_SUPPORT_OVERLAP) return false;
        return almostEqual(playerBottom, segment.y, COLLISION_EPSILON);
    }

    private handleJumpQueueOnKeyDown() {
        if (!this.controls.jump) {
            this.jumpQueued = true;
        }
        this.controls.jump = true;
    }

    private installInput() {
        const controller = new AbortController();

        const onKeyDown = (event: KeyboardEvent) => {
            if (MOVEMENT_KEYS.has(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case "a":
                case "A":
                case "ArrowLeft":
                    this.controls.left = true;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    this.controls.right = true;
                    break;
                case "Shift":
                case "ShiftLeft":
                case "ShiftRight":
                    this.controls.walk = true;
                    break;
                case "w":
                case "W":
                case "ArrowUp":
                case " ":
                case "Space":
                    this.handleJumpQueueOnKeyDown();
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (MOVEMENT_KEYS.has(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case "a":
                case "A":
                case "ArrowLeft":
                    this.controls.left = false;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    this.controls.right = false;
                    break;
                case "Shift":
                case "ShiftLeft":
                case "ShiftRight":
                    this.controls.walk = false;
                    break;
                case "w":
                case "W":
                case "ArrowUp":
                case " ":
                case "Space":
                    this.controls.jump = false;
                    break;
            }
        };

        const onBlur = () => {
            this.resetControls();
        };

        document.addEventListener("keydown", onKeyDown, { signal: controller.signal });
        document.addEventListener("keyup", onKeyUp, { signal: controller.signal });
        window.addEventListener("blur", onBlur, { signal: controller.signal });

        this.disposables.add(() => controller.abort());
    }

    private measureWorld() {
        const doc = document.documentElement;
        this.world.width = doc.scrollWidth;
        this.world.height = doc.scrollHeight;
        const groundTop = Math.max(this.world.height - GAME.GROUND_OFFSET, GAME.CHARACTER_HEIGHT);
        this.world.groundTop = groundTop;
    }

    private clampPositionToWorld() {
        const maxX = Math.max(0, this.world.width - GAME.CHARACTER_WIDTH);
        this.x = clamp(this.x, 0, maxX);
        const groundY = this.world.groundTop - GAME.CHARACTER_HEIGHT;
        this.y = clamp(this.y, 0, Math.max(groundY, 0));
    }

    private getSolidElements() {
        const solids: RegisteredElement[] = [];
        for (const entry of this.elementRegistry.values()) {
            if (entry.behavior.solid) {
                solids.push(entry);
            }
        }
        return solids;
    }

    private getPlayerState(): PlayerState {
        if (!this.grounded) {
            if (this.vx < 0) return "JUMPING_LEFT";
            if (this.vx > 0) return "JUMPING_RIGHT";
            return "JUMPING";
        }

        const absVx = Math.abs(this.vx);
        if (absVx < GAME.WALK_THRESHOLD) {
            return "STANDING";
        }
        if (absVx < GAME.RUN_THRESHOLD) {
            return this.vx < 0 ? "WALKING_LEFT" : "WALKING_RIGHT";
        }
        return this.vx < 0 ? "RUNNING_LEFT" : "RUNNING_RIGHT";
    }

    layOut() {
        this.playerEl.style.transform = `translate(${this.x}px, ${this.y}px)`;

        const playerState = this.getPlayerState();
        if (playerState !== this.lastState) {
            let newSrc: string;
            switch (playerState) {
                case "STANDING":
                    newSrc = Man.STANDING;
                    break;
                case "WALKING_LEFT":
                    newSrc = Man.WALKING_LEFT;
                    break;
                case "WALKING_RIGHT":
                    newSrc = Man.WALKING_RIGHT;
                    break;
                case "RUNNING_LEFT":
                    newSrc = Man.RUNNING_LEFT;
                    break;
                case "RUNNING_RIGHT":
                    newSrc = Man.RUNNING_RIGHT;
                    break;
                case "JUMPING_LEFT":
                    newSrc = Man.RUNNING_LEFT;
                    break;
                case "JUMPING_RIGHT":
                    newSrc = Man.RUNNING_RIGHT;
                    break;
                case "JUMPING":
                    newSrc = Man.STANDING;
                    break;
                default:
                    newSrc = Man.STANDING;
            }

            if (this.playerEl.src !== newSrc) {
                this.playerEl.src = newSrc;
            }

            this.lastState = playerState;
        }
    }

    private resetControls() {
        this.controls.left = false;
        this.controls.right = false;
        this.controls.walk = false;
        this.controls.jump = false;
        this.jumpQueued = false;
    }
}

function measureElement(element: HTMLElement): { rect: GameRect; segments: GameRect[] } {
    const bounding = element.getBoundingClientRect();
    const rect = toGameRect(bounding);
    const segments = Array.from(element.getClientRects())
        .map(toGameRect)
        .filter(segment => segment.width > 0 && segment.height > 0);

    if (segments.length === 0) {
        segments.push(rect);
    }

    return { rect, segments };
}

function toGameRect(domRect: DOMRect): GameRect {
    return {
        x: domRect.left + window.scrollX,
        y: domRect.top + window.scrollY,
        width: domRect.width,
        height: domRect.height,
    };
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function almostEqual(a: number, b: number, epsilon: number) {
    return Math.abs(a - b) <= epsilon;
}

function collisionMaskFromSides(sides?: CollisionSides): CollisionMask | undefined {
    if (!sides) return undefined;
    let mask = COLLISION.NONE;
    if (sides.top) mask |= COLLISION.TOP;
    if (sides.bottom) mask |= COLLISION.BOTTOM;
    if (sides.left) mask |= COLLISION.LEFT;
    if (sides.right) mask |= COLLISION.RIGHT;
    return mask;
}

function mergePassThrough(base: PassThroughConfig, override?: PassThroughConfig): PassThroughConfig {
    if (!override) return base;
    return {
        upward: override.upward ?? base.upward,
        downward: override.downward ?? base.downward,
        leftward: override.leftward ?? base.leftward,
        rightward: override.rightward ?? base.rightward,
    };
}

function overlapAmount(aStart: number, aEnd: number, bStart: number, bEnd: number) {
    const start = Math.max(aStart, bStart);
    const end = Math.min(aEnd, bEnd);
    return Math.max(0, end - start);
}
