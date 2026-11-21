export type OptionResolver = string | ((option: unknown) => unknown);

export interface ProcessedOption {
    key: string;
    option: unknown;
    index: number;
    level: number;
    parentKey: string;
    parent: ProcessedOption | Record<string, never>;
    children: ProcessedOption[];
    selected?: boolean;
}

export interface ProcessedOptionEvent {
    processedOption?: ProcessedOption;
    originalEvent?: Event;
    isFocus?: boolean;
    isHide?: boolean;
    preventSelection?: boolean;
    type?: 'hover';
}
