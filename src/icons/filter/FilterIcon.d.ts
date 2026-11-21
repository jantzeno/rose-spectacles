import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class FilterIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterIcon: DefineComponent<FilterIcon>;
    }
}

export default FilterIcon;
