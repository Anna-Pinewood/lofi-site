/** Hour (0–23) when day mode starts */
export const DAY_START_HOUR = 5;

/** Hour (0–23) when night mode starts */
export const NIGHT_START_HOUR = 18;

/** How often to rotate the video (ms) */
export const ROTATION_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

/** How often to check if day/night mode changed (ms) */
export const MODE_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

/** Static images for day/night modes */
export const STATIC_IMAGES = {
  day: "/static_pics/static_day.png",
  night: "/static_pics/static_night.png",
} as const;
