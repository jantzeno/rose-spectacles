import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class FilterFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterFillIcon: DefineComponent<FilterFillIcon>;
    }
}

export default FilterFillIcon;
