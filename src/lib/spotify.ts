import { TtlCache } from "@std/cache/ttl-cache";

/**
 * Interface for the Spotify token response.
 */
interface SpotifyTokenResponse {
  access_token: string; // The new access token
  token_type: string; // Token type, e.g., "Bearer"
  expires_in: number; // Token expiration time in seconds
  scope?: string; // The scope(s) for which the token is valid
}

const cache = new TtlCache<string, string>(0); // Default TTL is 0, values will not expire unless explicitly set

/**
 * Refreshes and retrieves a valid Spotify access token, using TtlCache for token caching.
 *
 * @returns A promise resolving to a valid Spotify access token.
 * @throws An error if the token refresh fails.
 */
export async function getAccessToken({
  clientId,
  clientSecret,
  refreshToken,
}: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<string> {
  const cachedToken = cache.get("accessToken");

  // Return cached token if available and valid
  if (cachedToken) {
    return cachedToken;
  }

  // Prepare the token request
  const url = "https://accounts.spotify.com/api/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
  };

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  // Fetch a new access token
  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  // Handle potential errors
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Failed to refresh access token. Status: ${response.status} - ${
        errorBody.error || response.statusText
      }`,
    );
  }

  // Parse response
  const tokenData: SpotifyTokenResponse = await response.json();
  const newAccessToken = tokenData.access_token;
  const ttl = tokenData.expires_in * 1000; // Convert expiration to milliseconds

  // Cache the new token with TTL
  cache.set("accessToken", newAccessToken, ttl);

  return newAccessToken;
}

/**
 * Represents a device.
 */
interface Device {
  /** The device ID. */
  id: string;
  /** Whether the device is active. */
  is_active: boolean;
  /** Whether the device is in a private session. */
  is_private_session: boolean;
  /** Whether the device is restricted. */
  is_restricted: boolean;
  /** The name of the device. */
  name: string;
  /** The type of the device. */
  type: string;
  /** The volume percentage of the device. */
  volume_percent: number;
  /** Whether the device supports volume control. */
  supports_volume: boolean;
}

/**
 * Represents external URLs.
 */
interface ExternalUrls {
  /** The Spotify URL. */
  spotify: string;
}

/**
 * Represents the context.
 */
interface Context {
  /** The type of the context. */
  type: string;
  /** The href of the context. */
  href: string;
  /** The external URLs of the context. */
  external_urls: ExternalUrls;
  /** The URI of the context. */
  uri: string;
}

/**
 * Represents an image.
 */
interface Image {
  /** The URL of the image. */
  url: string;
  /** The height of the image. */
  height: number;
  /** The width of the image. */
  width: number;
}

/**
 * Represents restrictions.
 */
interface Restrictions {
  /** The reason for the restrictions. */
  reason: string;
}

/**
 * Represents an artist.
 */
interface AlbumArtist {
  /** The external URLs of the artist. */
  external_urls: ExternalUrls;
  /** The href of the artist. */
  href: string;
  /** The ID of the artist. */
  id: string;
  /** The name of the artist. */
  name: string;
  /** The type of the artist. */
  type: string;
  /** The URI of the artist. */
  uri: string;
}

/**
 * Represents an album.
 */
interface Album {
  /** The type of the album. */
  album_type: string;
  /** The total number of tracks in the album. */
  total_tracks: number;
  /** The available markets for the album. */
  available_markets: string[];
  /** The external URLs of the album. */
  external_urls: ExternalUrls;
  /** The href of the album. */
  href: string;
  /** The ID of the album. */
  id: string;
  /** The images of the album. */
  images: Image[];
  /** The name of the album. */
  name: string;
  /** The release date of the album. */
  release_date: string;
  /** The precision of the release date. */
  release_date_precision: string;
  /** The restrictions of the album. */
  restrictions: Restrictions;
  /** The type of the album. */
  type: string;
  /** The URI of the album. */
  uri: string;
  /** The artists of the album. */
  artists: AlbumArtist[];
}

/**
 * Represents external IDs.
 */
interface ExternalIds {
  /** The ISRC of the item. */
  isrc: string;
  /** The EAN of the item. */
  ean: string;
  /** The UPC of the item. */
  upc: string;
}

/**
 * Represents an item.
 */
interface Item {
  /** The album of the item. */
  album: Album;
  /** The artists of the item. */
  artists: AlbumArtist[];
  /** The available markets for the item. */
  available_markets: string[];
  /** The disc number of the item. */
  disc_number: number;
  /** The duration of the item in milliseconds. */
  duration_ms: number;
  /** Whether the item is explicit. */
  explicit: boolean;
  /** The external IDs of the item. */
  external_ids: ExternalIds;
  /** The external URLs of the item. */
  external_urls: ExternalUrls;
  /** The href of the item. */
  href: string;
  /** The ID of the item. */
  id: string;
  /** Whether the item is playable. */
  is_playable: boolean;
  /** The linked from information of the item. */
  linked_from: Record<string, unknown>;
  /** The restrictions of the item. */
  restrictions: Restrictions;
  /** The name of the item. */
  name: string;
  /** The popularity of the item. */
  popularity: number;
  /** The preview URL of the item. */
  preview_url: string;
  /** The track number of the item. */
  track_number: number;
  /** The type of the item. */
  type: string;
  /** The URI of the item. */
  uri: string;
  /** Whether the item is local. */
  is_local: boolean;
}

/**
 * Represents actions.
 */
interface Actions {
  /** Whether interrupting playback is allowed. */
  interrupting_playback: boolean;
  /** Whether pausing is allowed. */
  pausing: boolean;
  /** Whether resuming is allowed. */
  resuming: boolean;
  /** Whether seeking is allowed. */
  seeking: boolean;
  /** Whether skipping to the next track is allowed. */
  skipping_next: boolean;
  /** Whether skipping to the previous track is allowed. */
  skipping_prev: boolean;
  /** Whether toggling repeat context is allowed. */
  toggling_repeat_context: boolean;
  /** Whether toggling shuffle is allowed. */
  toggling_shuffle: boolean;
  /** Whether toggling repeat track is allowed. */
  toggling_repeat_track: boolean;
  /** Whether transferring playback is allowed. */
  transferring_playback: boolean;
}

/**
 * Represents the example output.
 */
interface CurrentlyPlayingResponse {
  /** The device information. */
  device: Device;
  /** The repeat state. */
  repeat_state: string;
  /** The shuffle state. */
  shuffle_state: boolean;
  /** The context information. */
  context: Context;
  /** The timestamp. */
  timestamp: number;
  /** The progress in milliseconds. */
  progress_ms: number;
  /** Whether the item is playing. */
  is_playing: boolean;
  /** The item information. */
  item: Item;
  /** The currently playing type. */
  currently_playing_type: string;
  /** The actions information. */
  actions: Actions;
}

/**
 * Interface for Spotify error responses.
 */
interface SpotifyErrorResponse {
  error: {
    status: number; // HTTP status code
    message: string; // Description of the error
  };
}

/**
 * Get the currently playing track on the user's Spotify account.
 *
 * @param accessToken - The OAuth 2.0 access token.
 * @param market - An ISO 3166-1 alpha-2 country code (optional).
 * @param additionalTypes - A comma-separated list of item types that your client supports besides the default track type (optional).
 * @returns A promise resolving to information about the currently playing track or null if nothing is playing.
 * @throws An error with appropriate status code and message if the request fails.
 */
export async function getCurrentlyPlayingTrack(
  accessToken: string,
  market?: string,
  additionalTypes?: string,
): Promise<CurrentlyPlayingResponse | null> {
  const url = new URL("https://api.spotify.com/v1/me/player/currently-playing");
  if (market) url.searchParams.append("market", market);
  if (additionalTypes)
    url.searchParams.append("additional_types", additionalTypes);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) {
    // No content (nothing is playing)
    return null;
  }

  if (!response.ok) {
    const errorResponse: SpotifyErrorResponse = await response.json();
    throw new Error(
      `Error ${errorResponse.error.status}: ${errorResponse.error.message}`,
    );
  }

  return response.json();
}

export interface Artist {
  external_urls: { spotify: string };
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface ArtistsResponse {
  artists: Artist[];
}

export async function getArtists(
  accessToken: string,
  ids: string[],
): Promise<ArtistsResponse> {
  const url = new URL("https://api.spotify.com/v1/artists");
  url.searchParams.append("ids", ids.join(","));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorResponse: SpotifyErrorResponse = await response.json();
    throw new Error(
      `Error ${errorResponse.error.status}: ${errorResponse.error.message}`,
    );
  }

  return response.json();
}
