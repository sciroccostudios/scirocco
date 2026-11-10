/**
 * react-simple-maps v3 ships no type declarations and has no @types package.
 * Minimal surface covering only what WorldMap.tsx uses.
 */
declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode } from 'react';

  export interface Geo {
    rsmKey: string;
    id: string;
    properties: Record<string, any>;
    geometry: unknown;
  }

  export const ComposableMap: ComponentType<{
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    className?: string;
    style?: Record<string, unknown>;
    role?: string;
    'aria-label'?: string;
    children?: ReactNode;
  }>;

  export const Geographies: ComponentType<{
    geography: string | Record<string, unknown>;
    children: (args: { geographies: Geo[] }) => ReactNode;
  }>;

  export const Geography: ComponentType<{
    geography: Geo;
    style?: Record<string, Record<string, unknown>>;
    onMouseEnter?: () => void;
    onMouseMove?: (evt: React.MouseEvent) => void;
    onMouseLeave?: () => void;
    onClick?: (evt: React.MouseEvent) => void;
  }>;

  export const ZoomableGroup: ComponentType<{
    zoom?: number;
    center?: [number, number];
    minZoom?: number;
    maxZoom?: number;
    filterZoomEvent?: (evt: unknown) => boolean;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }>;
}
