import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class SearchPlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SearchPlusIcon: DefineComponent<SearchPlusIcon>;
    }
}

export default SearchPlusIcon;
