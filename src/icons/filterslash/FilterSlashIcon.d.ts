import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class FilterSlashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterSlashIcon: DefineComponent<FilterSlashIcon>;
    }
}

export default FilterSlashIcon;
