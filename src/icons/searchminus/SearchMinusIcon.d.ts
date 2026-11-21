import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class SearchMinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SearchMinusIcon: DefineComponent<SearchMinusIcon>;
    }
}

export default SearchMinusIcon;
