import type { CalculateMetadataFunction } from "remotion";

// Kept as a single source of truth for the composition's timing.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const INTRO_FRAMES = 130;
export const FEATURES_FROM = 112;
export const FEATURES_FRAMES = 122;
export const OUTRO_FROM = 226;
export const OUTRO_FRAMES = 134;
export const TOTAL_FRAMES = 360;

export const calculateMetadata: CalculateMetadataFunction<Record<string, never>> =
  () => ({
    durationInFrames: TOTAL_FRAMES,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
  });
