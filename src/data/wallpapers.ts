import cityLightsPortraitUrl from "@/assets/wallpapers/city-lights-portrait.jpeg?url";
import coastalCliffsLandscapeUrl from "@/assets/wallpapers/coastal-cliffs-landscape.jpeg?url";
import forestGreeneryLandscapeUrl from "@/assets/wallpapers/forest-greenery-landscape.jpeg?url";
import forestPathLandscapeUrl from "@/assets/wallpapers/forest-path-landscape.jpeg?url";
import forestTrailPortraitUrl from "@/assets/wallpapers/forest-trail-portrait.jpeg?url";
import gameTowerUrl from "@/assets/wallpapers/game-tower.jpeg?url";
import mountainPeakPortraitUrl from "@/assets/wallpapers/mountain-peak-portrait.jpeg?url";
import mountainValleyLandscapeUrl from "@/assets/wallpapers/mountain-valley-landscape.jpeg?url";
import natureUrl from "@/assets/wallpapers/nature.jpeg?url";
import nightCityPortraitUrl from "@/assets/wallpapers/night-city-portrait.jpeg?url";
import nightCityscapeLandscapeUrl from "@/assets/wallpapers/night-cityscape-landscape.jpeg?url";
import nightForestPortraitUrl from "@/assets/wallpapers/night-forest-portrait.jpeg?url";
import nightMountainLandscapeUrl from "@/assets/wallpapers/night-mountain-landscape.jpeg?url";
import oceanWavesLandscapeUrl from "@/assets/wallpapers/ocean-waves-landscape.jpeg?url";
import sunsetHillsLandscapeUrl from "@/assets/wallpapers/sunset-hills-landscape.jpeg?url";
import sunsetUrl from "@/assets/wallpapers/sunset.jpeg?url";
import urbanSkyscrapersPortraitUrl from "@/assets/wallpapers/urban-skyscrapers-portrait.jpeg?url";
import waterfallPortraitUrl from "@/assets/wallpapers/waterfall-portrait.jpeg?url";
import winterLandscapePortraitUrl from "@/assets/wallpapers/winter-landscape-portrait.jpeg?url";
import { useStorage } from "@/hooks/use-storage";

export const WALLPAPER_STORAGE_KEY = "favorite-wallpaper";

export const wallpapers = [
    coastalCliffsLandscapeUrl,
    cityLightsPortraitUrl,
    forestGreeneryLandscapeUrl,
    forestPathLandscapeUrl,
    forestTrailPortraitUrl,
    gameTowerUrl,
    mountainPeakPortraitUrl,
    mountainValleyLandscapeUrl,
    natureUrl,
    nightCityPortraitUrl,
    nightCityscapeLandscapeUrl,
    nightForestPortraitUrl,
    nightMountainLandscapeUrl,
    oceanWavesLandscapeUrl,
    sunsetHillsLandscapeUrl,
    sunsetUrl,
    urbanSkyscrapersPortraitUrl,
    waterfallPortraitUrl,
    winterLandscapePortraitUrl,
];

export function useFavoriteWallpaper() {
    return useStorage<string | null>(WALLPAPER_STORAGE_KEY, { defaultValue: null });
}
