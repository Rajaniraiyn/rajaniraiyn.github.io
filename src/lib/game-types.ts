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
    element: HTMLElement | SVGElement;
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
    element: HTMLElement | SVGElement;
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
