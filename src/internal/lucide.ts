import {
    ArrowDown,
    ArrowDownWideNarrow,
    ArrowUp,
    ArrowUpDown,
    ArrowUpNarrowWide,
    Ban,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsDown,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUp,
    ChevronUp,
    CircleX,
    Eye,
    EyeOff,
    Funnel,
    FunnelX,
    Info,
    LoaderCircle,
    Maximize2,
    Menu,
    Minimize2,
    Minus,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Star,
    Trash2,
    TriangleAlert,
    Undo2,
    Upload,
    X,
    ZoomIn,
    ZoomOut,
    type LucideIcon
} from '@lucide/vue';
import { getCurrentInstance, h, mergeProps, type FunctionalComponent } from 'vue';

function componentIcon(icon: LucideIcon, fill?: string) {
    const ComponentIcon: FunctionalComponent<{ spin?: boolean; unstyled?: boolean }> = ({ spin, unstyled }, { attrs }) => {
        const styled = !(unstyled ?? getCurrentInstance()?.appContext.config.globalProperties.$primevue?.config.unstyled);
        return h(
            icon,
            mergeProps(
                {
                    size: 14,
                    ...(fill && { fill }),
                    'aria-hidden': !attrs['aria-label'] && !attrs['aria-labelledby'] && !attrs.role ? 'true' : undefined,
                    class: styled ? ['rs-icon', { 'rs-icon-spin': spin }] : undefined
                },
                attrs
            )
        );
    };

    ComponentIcon.props = { spin: Boolean, unstyled: { type: Boolean, default: undefined } };
    ComponentIcon.inheritAttrs = false;

    return ComponentIcon;
}

export const AngleDoubleDownIcon = /* @__PURE__ */ componentIcon(ChevronsDown);
export const AngleDoubleLeftIcon = /* @__PURE__ */ componentIcon(ChevronsLeft);
export const AngleDoubleRightIcon = /* @__PURE__ */ componentIcon(ChevronsRight);
export const AngleDoubleUpIcon = /* @__PURE__ */ componentIcon(ChevronsUp);
export const ArrowDownIcon = /* @__PURE__ */ componentIcon(ArrowDown);
export const ArrowUpIcon = /* @__PURE__ */ componentIcon(ArrowUp);
export const BanIcon = /* @__PURE__ */ componentIcon(Ban);
export const BarsIcon = /* @__PURE__ */ componentIcon(Menu);
export const CalendarIcon = /* @__PURE__ */ componentIcon(Calendar);
export const CheckIcon = /* @__PURE__ */ componentIcon(Check);
export const ChevronDownIcon = /* @__PURE__ */ componentIcon(ChevronDown);
export const ChevronLeftIcon = /* @__PURE__ */ componentIcon(ChevronLeft);
export const ChevronRightIcon = /* @__PURE__ */ componentIcon(ChevronRight);
export const ChevronUpIcon = /* @__PURE__ */ componentIcon(ChevronUp);
export const AngleDownIcon = ChevronDownIcon;
export const AngleLeftIcon = ChevronLeftIcon;
export const AngleRightIcon = ChevronRightIcon;
export const AngleUpIcon = ChevronUpIcon;
export const ExclamationTriangleIcon = /* @__PURE__ */ componentIcon(TriangleAlert);
export const EyeIcon = /* @__PURE__ */ componentIcon(Eye);
export const EyeSlashIcon = /* @__PURE__ */ componentIcon(EyeOff);
export const FilterIcon = /* @__PURE__ */ componentIcon(Funnel);
export const FilterFillIcon = /* @__PURE__ */ componentIcon(Funnel, 'currentColor');
export const FilterSlashIcon = /* @__PURE__ */ componentIcon(FunnelX);
export const InfoCircleIcon = /* @__PURE__ */ componentIcon(Info);
export const MinusIcon = /* @__PURE__ */ componentIcon(Minus);
export const PencilIcon = /* @__PURE__ */ componentIcon(Pencil);
export const PlusIcon = /* @__PURE__ */ componentIcon(Plus);
export const RefreshIcon = /* @__PURE__ */ componentIcon(RefreshCw);
export const SearchIcon = /* @__PURE__ */ componentIcon(Search);
export const SearchMinusIcon = /* @__PURE__ */ componentIcon(ZoomOut);
export const SearchPlusIcon = /* @__PURE__ */ componentIcon(ZoomIn);
export const SortAltIcon = /* @__PURE__ */ componentIcon(ArrowUpDown);
export const SortAmountDownIcon = /* @__PURE__ */ componentIcon(ArrowDownWideNarrow);
export const SortAmountUpAltIcon = /* @__PURE__ */ componentIcon(ArrowUpNarrowWide);
export const SpinnerIcon = /* @__PURE__ */ componentIcon(LoaderCircle);
export const StarIcon = /* @__PURE__ */ componentIcon(Star);
export const StarFillIcon = /* @__PURE__ */ componentIcon(Star, 'currentColor');
export const TimesIcon = /* @__PURE__ */ componentIcon(X);
export const TimesCircleIcon = /* @__PURE__ */ componentIcon(CircleX);
export const TrashIcon = /* @__PURE__ */ componentIcon(Trash2);
export const UndoIcon = /* @__PURE__ */ componentIcon(Undo2);
export const UploadIcon = /* @__PURE__ */ componentIcon(Upload);
export const WindowMaximizeIcon = /* @__PURE__ */ componentIcon(Maximize2);
export const WindowMinimizeIcon = /* @__PURE__ */ componentIcon(Minimize2);
