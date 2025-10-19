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
    JUMP_VELOCITY: 700,       // px/sec impulse up
    CHARACTER_WIDTH: 40,
    CHARACTER_HEIGHT: 75,
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

export enum GameSoundEvent {
    LAND = "land",
    JUMP = "jump",
    FALL = "fall",
    FOOTSTEP = "footstep",
    COLLIDE = "collide",
}

export enum GameSurface {
    DEFAULT = "default",
    WOOD = "wood",
    METAL = "metal",
    GLASS = "glass",
    CARPET = "carpet",
    CONCRETE = "concrete",
    GRASS = "grass",
    SNOW = "snow",
    BELL = "bell",
    PLATE = "plate",
}

export interface GameSoundSupport {
    element: HTMLElement;
    type: GameElement;
    rect: GameRect;
    surface: GameSurface;
}

export interface GameSoundPayload {
    type: GameSoundEvent;
    dt: number;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    intensity?: number;
    support: GameSoundSupport | null;
    meta?: Record<string, unknown>;
}

export type GameSoundHandler = (event: GameSoundEvent, payload: GameSoundPayload) => void;

export interface GameSoundSpec {
    src: string;
    volume?: number;
    playbackRate?: number;
}

export type GameSoundDefinition =
    | string
    | HTMLAudioElement
    | GameSoundSpec
    | ((event: GameSoundEvent, payload: GameSoundPayload) => void);

export type GameSoundMap = Partial<Record<GameSoundEvent, GameSoundDefinition>>;

export interface GameOptions {
    footstepInterval?: number;
    onSound?: GameSoundHandler;
    soundMap?: GameSoundMap;
}

export type GameElementEventPayload = {
    element: HTMLElement;
    direction?: "left" | "right" | "top" | "bottom";
    speed?: number;
    metadata?: Record<string, unknown>;
};

export type GameElementEventHandler = (payload: GameElementEventPayload) => void;

export type GameElementEvents = {
    onPlayerEnter?: GameElementEventHandler;
    onPlayerLeave?: GameElementEventHandler;
    onPlayerCollide?: GameElementEventHandler;
};

export type GameElementRegistration = {
    type: GameElement;
    collisionSides?: CollisionSides;
    collisionMask?: CollisionMask;
    passThrough?: PassThroughConfig;
    solid?: boolean;
    metadata?: Record<string, unknown>;
    surface?: GameSurface;
    events?: GameElementEvents;
};

const DEFAULT_FOOTSTEP_INTERVAL = 0.32;
const NOOP_SOUND: GameSoundHandler = () => { };

type ResolvedSound = GameSoundHandler | HTMLAudioElement;

export function createGameSoundHandler(
    map: GameSoundMap,
    options: { preload?: boolean } = {},
): GameSoundHandler {
    const audioCache = new Map<GameSoundEvent, HTMLAudioElement>();
    const { preload = true } = options;

    const resolveAudio = (event: GameSoundEvent, spec: GameSoundDefinition): ResolvedSound => {
        if (typeof spec === "function") return spec as GameSoundHandler;
        if (isAudioElement(spec)) return spec;
        if (isSoundSpec(spec)) {
            let audio = audioCache.get(event);
            if (!audio) {
                audio = new Audio(spec.src);
                audioCache.set(event, audio);
            }
            if (spec.volume !== undefined) audio.volume = spec.volume;
            if (spec.playbackRate !== undefined) audio.playbackRate = spec.playbackRate;
            return audio;
        }
        let audio = audioCache.get(event);
        if (!audio) {
            audio = new Audio(spec);
            audioCache.set(event, audio);
        }
        return audio;
    };

    if (preload) {
        for (const [eventKey, spec] of Object.entries(map) as [GameSoundEvent, GameSoundDefinition][]) {
            if (!spec) continue;
            resolveAudio(eventKey, spec);
        }
    }

    return (event, payload) => {
        const definition = map[event];
        if (!definition) return;

        const resolved = resolveAudio(event, definition);
        playResolvedSound(resolved, payload);
    };
}

function isAudioElement(definition: GameSoundDefinition): definition is HTMLAudioElement {
    return typeof HTMLAudioElement !== "undefined" && definition instanceof HTMLAudioElement;
}

function isSoundSpec(definition: GameSoundDefinition): definition is GameSoundSpec {
    return (
        typeof definition === "object" &&
        definition !== null &&
        !isAudioElement(definition) &&
        "src" in definition &&
        typeof (definition as GameSoundSpec).src === "string"
    );
}

function playResolvedSound(resolved: ResolvedSound, payload: GameSoundPayload) {
    if (typeof resolved === "function") {
        resolved(payload.type, payload);
        return;
    }

    try {
        resolved.currentTime = 0;
        const playPromise = resolved.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => { });
        }
    } catch {
        // ignore playback errors
    }
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

interface HorizontalCollision {
    support: SupportInfo | null;
    direction: "left" | "right";
    speed: number;
}

type EmitSoundExtras = Partial<Omit<GameSoundPayload, "type" | "support" | "dt">> & {
    support?: SupportInfo | null;
    dt?: number;
};

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
    private lastDt = 0;

    private elementRegistry = new Map<HTMLElement, RegisteredElement>();
    private world = { width: 0, height: 0, groundTop: 0 };
    private dirtyElements = new Set<HTMLElement>();
    private worldDirty = true;
    private currentSupport: SupportInfo | null = null;
    private options = { footstepInterval: DEFAULT_FOOTSTEP_INTERVAL };
    private soundHandler: GameSoundHandler = NOOP_SOUND;
    private hasSoundHandler = false;
    private soundState = {
        footstepTimer: 0,
    };

    public element: { [key in GameElement]: Set<HTMLElement> } = {
        [GameElement.PLATFORM]: new Set(),
    };

    constructor(private readonly playerEl: HTMLImageElement, options: GameOptions = {}) {
        this.playerEl.style.position = "absolute";
        this.playerEl.style.top = "0px";
        this.playerEl.style.left = "0px";
        this.playerEl.src = Man.STANDING;

        this.configureOptions(options);

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
        const resolvedConfig: GameElementRegistration = {
            ...options,
            surface: options.surface ?? GameSurface.DEFAULT,
        };
        const behavior = this.resolveBehavior(resolvedConfig);
        const measurements = measureElement(dom);
        const entry: RegisteredElement = {
            element: dom,
            type: options.type,
            behavior,
            config: resolvedConfig,
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

    private emitElementEvent(eventType: keyof GameElementEvents, element: HTMLElement, payload: Omit<GameElementEventPayload, 'element'> = {}) {
        const entry = this.elementRegistry.get(element);
        if (!entry?.config.events?.[eventType]) return;

        const eventPayload: GameElementEventPayload = {
            element,
            metadata: entry.config.metadata,
            ...payload,
        };

        entry.config.events[eventType]!(eventPayload);
    }

    private updateGroundStateEvents(prevSupport: SupportInfo | null) {
        const currentSupport = this.currentSupport;

        // Check if support changed (player started/stopped being grounded on a platform)
        if (prevSupport?.entry.element !== currentSupport?.entry.element) {
            // Player left previous platform (stopped being grounded)
            if (prevSupport?.entry) {
                this.emitElementEvent('onPlayerLeave', prevSupport.entry.element);
            }

            // Player entered new platform (started being grounded)
            if (currentSupport?.entry) {
                this.emitElementEvent('onPlayerEnter', currentSupport.entry.element);
            }
        }
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

    updateOptions(options: GameOptions) {
        this.configureOptions(options);
    }

    private configureOptions(options: GameOptions = {}) {
        if (options.footstepInterval !== undefined) {
            const interval = Math.max(0.05, options.footstepInterval);
            this.options.footstepInterval = interval;
        }

        if (options.onSound !== undefined) {
            if (options.onSound) {
                this.soundHandler = options.onSound;
                this.hasSoundHandler = true;
            } else {
                this.soundHandler = NOOP_SOUND;
                this.hasSoundHandler = false;
            }
        } else if (options.soundMap !== undefined) {
            if (options.soundMap) {
                this.soundHandler = createGameSoundHandler(options.soundMap);
                this.hasSoundHandler = true;
            } else {
                this.soundHandler = NOOP_SOUND;
                this.hasSoundHandler = false;
            }
        }

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
        this.lastDt = dt;

        const prevGrounded = this.grounded;
        const prevSupport = this.currentSupport;

        if (this.worldDirty) {
            this.measureWorld();
            this.worldDirty = false;
        }
        this.updateDirtyElementRects();

        this.handleInput(dt);
        this.handleJump();
        this.applyGravity(dt);
        const vyBeforeResolve = this.vy;

        const solids = this.getSolidElements();
        const horizontalCollision = this.resolveHorizontalMotion(dt, solids);
        this.resolveVerticalMotion(dt, solids);

        const beforeClampX = this.x;
        this.clampPositionToWorld();
        const hitBounds = beforeClampX !== this.x ? (this.x <= 0 ? "left" : "right") : null;

        this.updateSoundState(prevGrounded, prevSupport, dt, vyBeforeResolve, horizontalCollision, hitBounds);

        // Update ground state events based on support changes
        this.updateGroundStateEvents(prevSupport);

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
            const jumpSupport = this.currentSupport;
            this.vy = -GAME.JUMP_VELOCITY;
            this.grounded = false;
            const intensity = clamp(Math.abs(this.vx) / GAME.MAX_RUN_SPEED, 0.3, 1);
            this.emitSound(GameSoundEvent.JUMP, { support: jumpSupport, intensity });
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

    private resolveHorizontalMotion(dt: number, solids: RegisteredElement[]): HorizontalCollision | null {
        if (this.vx === 0) return null;

        const nextX = this.x + this.vx * dt;
        const playerTop = this.y;
        const playerBottom = this.y + GAME.CHARACTER_HEIGHT;
        const speedBefore = Math.abs(this.vx);

        if (this.vx > 0) {
            let resolvedX = nextX;
            let collision = false;
            let collisionSupport: SupportInfo | null = null;

            for (const entry of solids) {
                const { behavior } = entry;
                if (!(behavior.collisionMask & COLLISION.LEFT)) continue;
                if (behavior.passThrough.rightward) continue;

                entry.segments.forEach((segment, segmentIndex) => {
                    const overlapY = overlapAmount(playerTop, playerBottom, segment.y, segment.y + segment.height);
                    if (overlapY < MIN_SIDE_OVERLAP) return;

                    const obstacleLeft = segment.x;
                    const previousRight = this.x + GAME.CHARACTER_WIDTH;
                    const futureRight = nextX + GAME.CHARACTER_WIDTH;

                    if (previousRight <= obstacleLeft && futureRight > obstacleLeft) {
                        const candidate = obstacleLeft - GAME.CHARACTER_WIDTH;
                        if (!collision || candidate < resolvedX) {
                            resolvedX = candidate;
                            collisionSupport = { entry, segmentIndex };
                        }
                        collision = true;
                    }
                });
            }

            if (collision) {
                this.x = resolvedX;
                this.vx = 0;
                if (collisionSupport) {
                    this.emitElementEvent('onPlayerCollide', (collisionSupport as SupportInfo).entry.element, {
                        direction: "right",
                        speed: speedBefore,
                    });
                }
                return {
                    support: collisionSupport,
                    direction: "right",
                    speed: speedBefore,
                };
            }

            this.x = nextX;
            return null;
        }

        let resolvedX = nextX;
        let collision = false;
        let collisionSupport: SupportInfo | null = null;

        for (const entry of solids) {
            const { behavior } = entry;
            if (!(behavior.collisionMask & COLLISION.RIGHT)) continue;
            if (behavior.passThrough.leftward) continue;

            entry.segments.forEach((segment, segmentIndex) => {
                const overlapY = overlapAmount(playerTop, playerBottom, segment.y, segment.y + segment.height);
                if (overlapY < MIN_SIDE_OVERLAP) return;

                const obstacleRight = segment.x + segment.width;
                const previousLeft = this.x;
                const futureLeft = nextX;

                if (previousLeft >= obstacleRight && futureLeft < obstacleRight) {
                    const candidate = obstacleRight;
                    if (!collision || candidate > resolvedX) {
                        resolvedX = candidate;
                        collisionSupport = { entry, segmentIndex };
                    }
                    collision = true;
                }
            });
        }

        if (collision) {
            this.x = resolvedX;
            this.vx = 0;
            if (collisionSupport) {
                this.emitElementEvent('onPlayerCollide', (collisionSupport as SupportInfo).entry.element, {
                    direction: "left",
                    speed: speedBefore,
                });
            }
            return {
                support: collisionSupport,
                direction: "left",
                speed: speedBefore,
            };
        }

        this.x = nextX;
        return null;
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
                if (landingSupport) {
                    this.emitElementEvent('onPlayerCollide', (landingSupport as SupportInfo).entry.element, {
                        direction: "top",
                        speed: Math.abs(this.vy),
                    });
                }
            }
        } else if (this.vy < 0) {
            let ceiling = Number.NEGATIVE_INFINITY;
            let ceilingEntry: RegisteredElement | null = null;

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
                        if (platformBottom > ceiling) {
                            ceiling = platformBottom;
                            ceilingEntry = entry;
                        }
                    }
                }
            }

            if (ceiling !== Number.NEGATIVE_INFINITY) {
                nextY = ceiling;
                this.vy = 0;
                if (ceilingEntry) {
                    this.emitElementEvent('onPlayerCollide', ceilingEntry.element, {
                        direction: "bottom",
                        speed: Math.abs(this.vy),
                    });
                }
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

    private updateSoundState(
        prevGrounded: boolean,
        prevSupport: SupportInfo | null,
        dt: number,
        vyBeforeResolve: number,
        horizontalCollision: HorizontalCollision | null,
        boundaryCollision: "left" | "right" | null,
    ) {
        if (!this.hasSoundHandler) return;

        if (!prevGrounded && this.grounded && this.currentSupport) {
            const intensity = clamp(Math.abs(vyBeforeResolve) / GAME.JUMP_VELOCITY, 0.2, 1);
            this.emitSound(GameSoundEvent.LAND, { support: this.currentSupport, intensity });
        } else if (prevGrounded && !this.grounded) {
            const intensity = clamp(Math.abs(vyBeforeResolve) / GAME.TERMINAL_VELOCITY, 0.1, 1);
            this.emitSound(GameSoundEvent.FALL, { support: prevSupport, intensity });
            this.soundState.footstepTimer = 0;
        }

        if (horizontalCollision) {
            const intensity = clamp(horizontalCollision.speed / GAME.MAX_RUN_SPEED, 0.1, 1);
            this.emitSound(GameSoundEvent.COLLIDE, {
                support: horizontalCollision.support,
                intensity,
                meta: { axis: "x", direction: horizontalCollision.direction },
            });
        } else if (boundaryCollision) {
            const intensity = clamp(Math.abs(this.vx) / GAME.MAX_RUN_SPEED, 0.2, 1);
            this.emitSound(GameSoundEvent.COLLIDE, {
                support: null,
                intensity,
                meta: { axis: "x", direction: boundaryCollision, kind: "boundary" },
            });
        }

        if (this.grounded && Math.abs(this.vx) >= GAME.WALK_THRESHOLD) {
            const speedRatio = clamp(Math.abs(this.vx) / GAME.MAX_RUN_SPEED, 0, 1);
            const cadence = 0.5 + speedRatio;
            this.soundState.footstepTimer += dt * cadence;
            if (this.soundState.footstepTimer >= this.options.footstepInterval) {
                this.soundState.footstepTimer = 0;
                this.emitSound(GameSoundEvent.FOOTSTEP, {
                    support: this.currentSupport,
                    intensity: speedRatio,
                    meta: { speed: Math.abs(this.vx) },
                });
            }
        } else {
            this.soundState.footstepTimer = 0;
        }
    }

    private emitSound(event: GameSoundEvent, extras: EmitSoundExtras = {}) {
        if (!this.hasSoundHandler) return;

        const supportInfo = extras.support ?? this.currentSupport;
        let supportPayload: GameSoundSupport | null = null;
        if (supportInfo) {
            const segment = supportInfo.entry.segments[supportInfo.segmentIndex] ?? supportInfo.entry.rect;
            supportPayload = {
                element: supportInfo.entry.element,
                type: supportInfo.entry.type,
                rect: segment,
                surface: supportInfo.entry.config.surface ?? GameSurface.DEFAULT,
            };
        }

        const payload: GameSoundPayload = {
            type: event,
            dt: extras.dt ?? this.lastDt,
            position: extras.position ?? { x: this.x, y: this.y },
            velocity: extras.velocity ?? { x: this.vx, y: this.vy },
            intensity: extras.intensity ?? 1,
            meta: extras.meta,
            support: supportPayload,
        };

        this.soundHandler(event, payload);
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
        this.playerEl.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })

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
