import type { PluginCreator } from 'postcss';

export declare const ZOOM_MIN: 50;
export declare const ZOOM_MAX: 250;
export declare const ZOOM_STEP: 10;

export declare function zoomLevels(): number[];
export declare function scaleMediaParams(params: string, factor: number): string;

declare const postcssZoomMedia: PluginCreator<Record<string, never>>;
export default postcssZoomMedia;
