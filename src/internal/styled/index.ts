export { default as Theme } from './config';
export { default as ThemeService } from './service';
export { default as ThemeUtils } from './utils/themeUtils';
export * from './utils/sharedUtils';
export * from './helpers/css';
export * from './helpers/dt';
export * from './helpers/t';
export { default as toVariables } from './helpers/toVariables';
export type StyleType = string | ((options: { dt: typeof import('./helpers/dt').dt }) => string);
export type StyleOptions = Record<string, unknown>;
export type ThemeOptions = {
    prefix?: string;
    darkModeSelector?: string | false;
    cssLayer?: boolean | { name?: string; order?: string };
};
