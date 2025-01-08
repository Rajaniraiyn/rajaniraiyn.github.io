import {
  getAccessToken,
  getArtists,
  getCurrentlyPlayingTrack,
} from "@/lib/spotify";
import { ActionError, defineAction } from "astro:actions";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from "astro:env/server";
import { z } from "astro:schema";

export const spotify = {
  getCurrentlyPlayingTrack: defineAction({
    input: z.object({}).optional(),
    handler: async () => {
      try {
        const accessToken = await getAccessToken({
          clientId: SPOTIFY_CLIENT_ID,
          clientSecret: SPOTIFY_CLIENT_SECRET,
          refreshToken: SPOTIFY_REFRESH_TOKEN,
        });

        const currentlyPlaying = await getCurrentlyPlayingTrack(accessToken);

        return currentlyPlaying;
      } catch (error) {
        if (error instanceof Error) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            stack: error.stack,
          });
        }
      }
      return null;
    },
  }),
  getArtists: defineAction({
    input: z.string().array(),
    handler: async (ids) => {
      try {
        if (ids.length === 0) {
          return [];
        }
        const accessToken = await getAccessToken({
          clientId: SPOTIFY_CLIENT_ID,
          clientSecret: SPOTIFY_CLIENT_SECRET,
          refreshToken: SPOTIFY_REFRESH_TOKEN,
        });

        const { artists } = await getArtists(accessToken, ids);

        return artists;
      } catch (error) {
        if (error instanceof Error) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            stack: error.stack,
          });
        }
      }
      return null;
    },
  }),
};
