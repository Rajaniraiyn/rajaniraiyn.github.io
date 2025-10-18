import {
    createGameSoundHandler,
    GameSoundEvent,
    GameSurface,
    type GameSoundHandler,
    type GameSoundMap,
} from "@/lib/mario-game";

import footstepCarpet000Url from "../assets/audio/footstep_carpet_000.ogg?url";
import footstepCarpet001Url from "../assets/audio/footstep_carpet_001.ogg?url";
import footstepCarpet002Url from "../assets/audio/footstep_carpet_002.ogg?url";
import footstepCarpet003Url from "../assets/audio/footstep_carpet_003.ogg?url";
import footstepCarpet004Url from "../assets/audio/footstep_carpet_004.ogg?url";

import footstepConcrete000Url from "../assets/audio/footstep_concrete_000.ogg?url";
import footstepConcrete001Url from "../assets/audio/footstep_concrete_001.ogg?url";
import footstepConcrete002Url from "../assets/audio/footstep_concrete_002.ogg?url";
import footstepConcrete003Url from "../assets/audio/footstep_concrete_003.ogg?url";
import footstepConcrete004Url from "../assets/audio/footstep_concrete_004.ogg?url";

import footstepGrass000Url from "../assets/audio/footstep_grass_000.ogg?url";
import footstepGrass001Url from "../assets/audio/footstep_grass_001.ogg?url";
import footstepGrass002Url from "../assets/audio/footstep_grass_002.ogg?url";
import footstepGrass003Url from "../assets/audio/footstep_grass_003.ogg?url";
import footstepGrass004Url from "../assets/audio/footstep_grass_004.ogg?url";

import footstepSnow000Url from "../assets/audio/footstep_snow_000.ogg?url";
import footstepSnow001Url from "../assets/audio/footstep_snow_001.ogg?url";
import footstepSnow002Url from "../assets/audio/footstep_snow_002.ogg?url";
import footstepSnow003Url from "../assets/audio/footstep_snow_003.ogg?url";
import footstepSnow004Url from "../assets/audio/footstep_snow_004.ogg?url";

import footstepWood000Url from "../assets/audio/footstep_wood_000.ogg?url";
import footstepWood001Url from "../assets/audio/footstep_wood_001.ogg?url";
import footstepWood002Url from "../assets/audio/footstep_wood_002.ogg?url";
import footstepWood003Url from "../assets/audio/footstep_wood_003.ogg?url";
import footstepWood004Url from "../assets/audio/footstep_wood_004.ogg?url";

import impactBellHeavy000Url from "../assets/audio/impactBell_heavy_000.ogg?url";
import impactBellHeavy001Url from "../assets/audio/impactBell_heavy_001.ogg?url";
import impactBellHeavy002Url from "../assets/audio/impactBell_heavy_002.ogg?url";
import impactBellHeavy003Url from "../assets/audio/impactBell_heavy_003.ogg?url";
import impactBellHeavy004Url from "../assets/audio/impactBell_heavy_004.ogg?url";

import impactGenericLight000Url from "../assets/audio/impactGeneric_light_000.ogg?url";
import impactGenericLight001Url from "../assets/audio/impactGeneric_light_001.ogg?url";
import impactGenericLight002Url from "../assets/audio/impactGeneric_light_002.ogg?url";
import impactGenericLight003Url from "../assets/audio/impactGeneric_light_003.ogg?url";
import impactGenericLight004Url from "../assets/audio/impactGeneric_light_004.ogg?url";

import impactGlassMedium000Url from "../assets/audio/impactGlass_medium_000.ogg?url";
import impactGlassMedium001Url from "../assets/audio/impactGlass_medium_001.ogg?url";
import impactGlassMedium002Url from "../assets/audio/impactGlass_medium_002.ogg?url";
import impactGlassMedium003Url from "../assets/audio/impactGlass_medium_003.ogg?url";
import impactGlassMedium004Url from "../assets/audio/impactGlass_medium_004.ogg?url";

import impactMetalMedium000Url from "../assets/audio/impactMetal_medium_000.ogg?url";
import impactMetalMedium001Url from "../assets/audio/impactMetal_medium_001.ogg?url";
import impactMetalMedium002Url from "../assets/audio/impactMetal_medium_002.ogg?url";
import impactMetalMedium003Url from "../assets/audio/impactMetal_medium_003.ogg?url";
import impactMetalMedium004Url from "../assets/audio/impactMetal_medium_004.ogg?url";

import impactPlateMedium000Url from "../assets/audio/impactPlate_medium_000.ogg?url";
import impactPlateMedium001Url from "../assets/audio/impactPlate_medium_001.ogg?url";
import impactPlateMedium002Url from "../assets/audio/impactPlate_medium_002.ogg?url";
import impactPlateMedium003Url from "../assets/audio/impactPlate_medium_003.ogg?url";
import impactPlateMedium004Url from "../assets/audio/impactPlate_medium_004.ogg?url";

import impactSoftMedium000Url from "../assets/audio/impactSoft_medium_000.ogg?url";
import impactSoftMedium001Url from "../assets/audio/impactSoft_medium_001.ogg?url";
import impactSoftMedium002Url from "../assets/audio/impactSoft_medium_002.ogg?url";
import impactSoftMedium003Url from "../assets/audio/impactSoft_medium_003.ogg?url";
import impactSoftMedium004Url from "../assets/audio/impactSoft_medium_004.ogg?url";

import impactWoodMedium000Url from "../assets/audio/impactWood_medium_000.ogg?url";
import impactWoodMedium001Url from "../assets/audio/impactWood_medium_001.ogg?url";
import impactWoodMedium002Url from "../assets/audio/impactWood_medium_002.ogg?url";
import impactWoodMedium003Url from "../assets/audio/impactWood_medium_003.ogg?url";
import impactWoodMedium004Url from "../assets/audio/impactWood_medium_004.ogg?url";

type SurfaceSoundVariant = {
    src: string;
    volume?: number;
    playbackRate?: number | [number, number];
};

export type SurfaceSoundEventMap = Partial<Record<GameSoundEvent, SurfaceSoundVariant[]>>;
export type SurfaceSoundLibrary = Partial<Record<GameSurface, SurfaceSoundEventMap>>;

const audioPool = new Map<string, HTMLAudioElement[]>();

const footstepCarpet = createVariants(
    [footstepCarpet000Url, footstepCarpet001Url, footstepCarpet002Url, footstepCarpet003Url, footstepCarpet004Url],
    { volume: 0.5, playbackRate: [0.95, 1.05] },
);

const footstepConcrete = createVariants(
    [footstepConcrete000Url, footstepConcrete001Url, footstepConcrete002Url, footstepConcrete003Url, footstepConcrete004Url],
    { volume: 0.6, playbackRate: [0.95, 1.05] },
);

const footstepGrass = createVariants(
    [footstepGrass000Url, footstepGrass001Url, footstepGrass002Url, footstepGrass003Url, footstepGrass004Url],
    { volume: 0.55, playbackRate: [0.9, 1.05] },
);

const footstepSnow = createVariants(
    [footstepSnow000Url, footstepSnow001Url, footstepSnow002Url, footstepSnow003Url, footstepSnow004Url],
    { volume: 0.6, playbackRate: [0.9, 1.1] },
);

const footstepWood = createVariants(
    [footstepWood000Url, footstepWood001Url, footstepWood002Url, footstepWood003Url, footstepWood004Url],
    { volume: 0.6, playbackRate: [0.95, 1.05] },
);

const impactBell = createVariants(
    [impactBellHeavy000Url, impactBellHeavy001Url, impactBellHeavy002Url, impactBellHeavy003Url, impactBellHeavy004Url],
    { volume: 0.7, playbackRate: [0.9, 1.05] },
);

const impactConcrete = createVariants(
    [impactGenericLight000Url, impactGenericLight001Url, impactGenericLight002Url, impactGenericLight003Url, impactGenericLight004Url],
    { volume: 0.65, playbackRate: [0.9, 1.05] },
);

const impactGlass = createVariants(
    [impactGlassMedium000Url, impactGlassMedium001Url, impactGlassMedium002Url, impactGlassMedium003Url, impactGlassMedium004Url],
    { volume: 0.6, playbackRate: [0.95, 1.1] },
);

const impactMetal = createVariants(
    [impactMetalMedium000Url, impactMetalMedium001Url, impactMetalMedium002Url, impactMetalMedium003Url, impactMetalMedium004Url],
    { volume: 0.6, playbackRate: [0.9, 1.1] },
);

const impactPlate = createVariants(
    [impactPlateMedium000Url, impactPlateMedium001Url, impactPlateMedium002Url, impactPlateMedium003Url, impactPlateMedium004Url],
    { volume: 0.65, playbackRate: [0.9, 1.1] },
);

const impactSoft = createVariants(
    [impactSoftMedium000Url, impactSoftMedium001Url, impactSoftMedium002Url, impactSoftMedium003Url, impactSoftMedium004Url],
    { volume: 0.55, playbackRate: [0.9, 1.05] },
);

const impactSnow = createVariants(
    [impactSoftMedium000Url, impactSoftMedium001Url, impactSoftMedium002Url, impactSoftMedium003Url, impactSoftMedium004Url],
    { volume: 0.5, playbackRate: [0.85, 1.05] },
);

const impactWood = createVariants(
    [impactWoodMedium000Url, impactWoodMedium001Url, impactWoodMedium002Url, impactWoodMedium003Url, impactWoodMedium004Url],
    { volume: 0.7, playbackRate: [0.95, 1.05] },
);

export const DEFAULT_SURFACE_SOUND_LIBRARY: SurfaceSoundLibrary = {
    [GameSurface.DEFAULT]: {
        [GameSoundEvent.FOOTSTEP]: footstepWood,
        [GameSoundEvent.LAND]: impactWood,
        [GameSoundEvent.COLLIDE]: impactWood,
    },
    [GameSurface.WOOD]: {
        [GameSoundEvent.FOOTSTEP]: footstepWood,
        [GameSoundEvent.LAND]: impactWood,
        [GameSoundEvent.COLLIDE]: impactWood,
    },
    [GameSurface.CARPET]: {
        [GameSoundEvent.FOOTSTEP]: footstepCarpet,
        [GameSoundEvent.LAND]: impactSoft,
        [GameSoundEvent.COLLIDE]: impactSoft,
    },
    [GameSurface.CONCRETE]: {
        [GameSoundEvent.FOOTSTEP]: footstepConcrete,
        [GameSoundEvent.LAND]: impactConcrete,
        [GameSoundEvent.COLLIDE]: impactConcrete,
    },
    [GameSurface.GRASS]: {
        [GameSoundEvent.FOOTSTEP]: footstepGrass,
        [GameSoundEvent.LAND]: impactSoft,
        [GameSoundEvent.COLLIDE]: impactSoft,
    },
    [GameSurface.SNOW]: {
        [GameSoundEvent.FOOTSTEP]: footstepSnow,
        [GameSoundEvent.LAND]: impactSnow,
        [GameSoundEvent.COLLIDE]: impactSnow,
    },
    [GameSurface.METAL]: {
        [GameSoundEvent.FOOTSTEP]: footstepConcrete,
        [GameSoundEvent.LAND]: impactMetal,
        [GameSoundEvent.COLLIDE]: impactMetal,
    },
    [GameSurface.GLASS]: {
        [GameSoundEvent.FOOTSTEP]: footstepConcrete,
        [GameSoundEvent.LAND]: impactGlass,
        [GameSoundEvent.COLLIDE]: impactGlass,
    },
    [GameSurface.PLATE]: {
        [GameSoundEvent.FOOTSTEP]: footstepConcrete,
        [GameSoundEvent.LAND]: impactPlate,
        [GameSoundEvent.COLLIDE]: impactPlate,
    },
    [GameSurface.BELL]: {
        [GameSoundEvent.LAND]: impactBell,
        [GameSoundEvent.COLLIDE]: impactBell,
    },
};

const defaultFallbackMap: GameSoundMap = {};
if (impactConcrete[0]) {
    defaultFallbackMap[GameSoundEvent.JUMP] = impactConcrete[0].src;
}
const fallFallback = impactConcrete[1] ?? impactConcrete[0] ?? impactWood[0];
if (fallFallback) {
    defaultFallbackMap[GameSoundEvent.FALL] = fallFallback.src;
}

export const DEFAULT_FALLBACK_MAP = defaultFallbackMap;

export function createSurfaceSoundHandler(
    library: SurfaceSoundLibrary,
    fallbackMap: GameSoundMap = DEFAULT_FALLBACK_MAP,
): GameSoundHandler {
    const fallbackHandler = fallbackMap ? createGameSoundHandler(fallbackMap, { preload: false }) : null;

    return (event, payload) => {
        const surface = payload.support?.surface ?? GameSurface.DEFAULT;
        const eventMap = library[surface] ?? library[GameSurface.DEFAULT];
        const variants = eventMap?.[event];

        if (variants && variants.length > 0) {
            const variant = variants[Math.floor(Math.random() * variants.length)];
            playVariant(variant, payload);
            return;
        }

        fallbackHandler?.(event, payload);
    };
}

export function createDefaultMarioSoundHandler(): GameSoundHandler {
    return createSurfaceSoundHandler(DEFAULT_SURFACE_SOUND_LIBRARY);
}

function createVariants(sources: string[], defaults: Omit<SurfaceSoundVariant, "src"> = {}): SurfaceSoundVariant[] {
    return sources.map((src) => ({
        src,
        ...defaults,
    }));
}

function randomBetween(range: number | [number, number] | undefined) {
    if (!range) return 1;
    if (typeof range === "number") return range;
    const [min, max] = range;
    return min + Math.random() * (max - min);
}

function clampVolume(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function acquireAudio(src: string) {
    const bucket = audioPool.get(src);
    if (!bucket) {
        const audio = new Audio(src);
        audioPool.set(src, [audio]);
        return audio;
    }
    const reusable = bucket.find((media) => media.paused || media.ended);
    if (reusable) return reusable;
    const clone = bucket[0].cloneNode() as HTMLAudioElement;
    bucket.push(clone);
    return clone;
}

function playVariant(variant: SurfaceSoundVariant, payload: Parameters<GameSoundHandler>[1]) {
    const audio = acquireAudio(variant.src);
    audio.currentTime = 0;
    const baseVolume = variant.volume ?? 1;
    const intensityVolume = payload.intensity !== undefined ? clampVolume(baseVolume * payload.intensity) : baseVolume;
    audio.volume = intensityVolume;
    audio.playbackRate = randomBetween(variant.playbackRate);
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
    }
}
