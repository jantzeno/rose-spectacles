import type { DefaultPassThrough, PassThrough } from 'rose-spectacles/core';
import type { PrimeVueCSPOptions, PrimeVueLocaleOptions, PrimeVueZIndexOptions } from 'rose-spectacles/core/config';
import type { AccordionPassThroughOptions } from 'rose-spectacles/accordion';
import type { AccordionContentPassThroughOptions } from 'rose-spectacles/accordioncontent';
import type { AccordionHeaderPassThroughOptions } from 'rose-spectacles/accordionheader';
import type { AccordionPanelPassThroughOptions } from 'rose-spectacles/accordionpanel';
import type { AccordionTabPassThroughOptions } from 'rose-spectacles/accordiontab';
import type { AnimateOnScrollDirectivePassThroughOptions } from 'rose-spectacles/animateonscroll';
import type { AutoCompletePassThroughOptions } from 'rose-spectacles/autocomplete';
import type { AvatarPassThroughOptions } from 'rose-spectacles/avatar';
import type { AvatarGroupPassThroughOptions } from 'rose-spectacles/avatargroup';
import type { BadgePassThroughOptions } from 'rose-spectacles/badge';
import type { BadgeDirectivePassThroughOptions } from 'rose-spectacles/badgedirective';
import type { BlockUIPassThroughOptions } from 'rose-spectacles/blockui';
import type { BreadcrumbPassThroughOptions } from 'rose-spectacles/breadcrumb';
import type { ButtonPassThroughOptions } from 'rose-spectacles/button';
import type { ButtonGroupPassThroughOptions } from 'rose-spectacles/buttongroup';
import type { CalendarPassThroughOptions } from 'rose-spectacles/calendar';
import type { CardPassThroughOptions } from 'rose-spectacles/card';
import type { CarouselPassThroughOptions } from 'rose-spectacles/carousel';
import type { CascadeSelectPassThroughOptions } from 'rose-spectacles/cascadeselect';
import type { ChartPassThroughOptions } from 'rose-spectacles/chart';
import type { CheckboxPassThroughOptions } from 'rose-spectacles/checkbox';
import type { CheckboxGroupPassThroughOptions } from 'rose-spectacles/checkboxgroup';
import type { ChipPassThroughOptions } from 'rose-spectacles/chip';
import type { ChipsPassThroughOptions } from 'rose-spectacles/chips';
import type { ColorPickerPassThroughOptions } from 'rose-spectacles/colorpicker';
import type { ColumnPassThroughOptions } from 'rose-spectacles/column';
import type { ColumnGroupPassThroughOptions } from 'rose-spectacles/columngroup';
import type { ConfirmDialogPassThroughOptions } from 'rose-spectacles/confirmdialog';
import type { ConfirmPopupPassThroughOptions } from 'rose-spectacles/confirmpopup';
import type { ContextMenuPassThroughOptions } from 'rose-spectacles/contextmenu';
import type { DataTablePassThroughOptions } from 'rose-spectacles/datatable';
import type { DataViewPassThroughOptions } from 'rose-spectacles/dataview';
import type { DatePickerPassThroughOptions } from 'rose-spectacles/datepicker';
import type { DeferredContentPassThroughOptions } from 'rose-spectacles/deferredcontent';
import type { DialogPassThroughOptions } from 'rose-spectacles/dialog';
import type { DividerPassThroughOptions } from 'rose-spectacles/divider';
import type { DockPassThroughOptions } from 'rose-spectacles/dock';
import type { DrawerPassThroughOptions } from 'rose-spectacles/drawer';
import type { DropdownPassThroughOptions } from 'rose-spectacles/dropdown';
import type { EditorPassThroughOptions } from 'rose-spectacles/editor';
import type { FieldsetPassThroughOptions } from 'rose-spectacles/fieldset';
import type { FileUploadPassThroughOptions } from 'rose-spectacles/fileupload';
import type { FloatLabelPassThroughOptions } from 'rose-spectacles/floatlabel';
import type { FluidPassThroughOptions } from 'rose-spectacles/fluid';
import type { FocusTrapDirectivePassThroughOptions } from 'rose-spectacles/focustrap';
import type { GalleriaPassThroughOptions } from 'rose-spectacles/galleria';
import type { IconFieldPassThroughOptions } from 'rose-spectacles/iconfield';
import type { IftaLabelPassThroughOptions } from 'rose-spectacles/iftalabel';
import type { ImagePassThroughOptions } from 'rose-spectacles/image';
import type { ImageComparePassThroughOptions } from 'rose-spectacles/imagecompare';
import type { InlineMessagePassThroughOptions } from 'rose-spectacles/inlinemessage';
import type { InplacePassThroughOptions } from 'rose-spectacles/inplace';
import type { InputChipsPassThroughOptions } from 'rose-spectacles/inputchips';
import type { InputGroupPassThroughOptions } from 'rose-spectacles/inputgroup';
import type { InputGroupAddonPassThroughOptions } from 'rose-spectacles/inputgroupaddon';
import type { InputIconPassThroughOptions } from 'rose-spectacles/inputicon';
import type { InputMaskPassThroughOptions } from 'rose-spectacles/inputmask';
import type { InputNumberPassThroughOptions } from 'rose-spectacles/inputnumber';
import type { InputOtpPassThroughOptions } from 'rose-spectacles/inputotp';
import type { InputSwitchPassThroughOptions } from 'rose-spectacles/inputswitch';
import type { InputTextPassThroughOptions } from 'rose-spectacles/inputtext';
import type { KeyFilterDirectivePassThroughOptions } from 'rose-spectacles/keyfilter';
import type { KnobPassThroughOptions } from 'rose-spectacles/knob';
import type { ListboxPassThroughOptions } from 'rose-spectacles/listbox';
import type { MegaMenuPassThroughOptions } from 'rose-spectacles/megamenu';
import type { MenuPassThroughOptions } from 'rose-spectacles/menu';
import type { MenubarPassThroughOptions } from 'rose-spectacles/menubar';
import type { MessagePassThroughOptions } from 'rose-spectacles/message';
import type { MeterGroupPassThroughOptions } from 'rose-spectacles/metergroup';
import type { MultiSelectPassThroughOptions } from 'rose-spectacles/multiselect';
import type { OrderListPassThroughOptions } from 'rose-spectacles/orderlist';
import type { OrganizationChartPassThroughOptions } from 'rose-spectacles/organizationchart';
import type { OverlayBadgePassThroughOptions } from 'rose-spectacles/overlaybadge';
import type { OverlayPanelPassThroughOptions } from 'rose-spectacles/overlaypanel';
import type { PaginatorPassThroughOptions } from 'rose-spectacles/paginator';
import type { PanelPassThroughOptions } from 'rose-spectacles/panel';
import type { PanelMenuPassThroughOptions } from 'rose-spectacles/panelmenu';
import type { PassThroughOptions } from 'rose-spectacles/passthrough';
import type { PasswordPassThroughOptions } from 'rose-spectacles/password';
import type { PickListPassThroughOptions } from 'rose-spectacles/picklist';
import type { PopoverPassThroughOptions } from 'rose-spectacles/popover';
import type { ProgressBarPassThroughOptions } from 'rose-spectacles/progressbar';
import type { ProgressSpinnerPassThroughOptions } from 'rose-spectacles/progressspinner';
import type { RadioButtonPassThroughOptions } from 'rose-spectacles/radiobutton';
import type { RadioButtonGroupPassThroughOptions } from 'rose-spectacles/radiobuttongroup';
import type { RatingPassThroughOptions } from 'rose-spectacles/rating';
import type { RippleDirectivePassThroughOptions } from 'rose-spectacles/ripple';
import type { RowPassThroughOptions } from 'rose-spectacles/row';
import type { ScrollPanelPassThroughOptions } from 'rose-spectacles/scrollpanel';
import type { ScrollTopPassThroughOptions } from 'rose-spectacles/scrolltop';
import type { SelectPassThroughOptions } from 'rose-spectacles/select';
import type { SelectButtonPassThroughOptions } from 'rose-spectacles/selectbutton';
import type { SidebarPassThroughOptions } from 'rose-spectacles/sidebar';
import type { SkeletonPassThroughOptions } from 'rose-spectacles/skeleton';
import type { SliderPassThroughOptions } from 'rose-spectacles/slider';
import type { SpeedDialPassThroughOptions } from 'rose-spectacles/speeddial';
import type { SplitButtonPassThroughOptions } from 'rose-spectacles/splitbutton';
import type { SplitterPassThroughOptions } from 'rose-spectacles/splitter';
import type { SplitterPanelPassThroughOptions } from 'rose-spectacles/splitterpanel';
import type { StepPassThroughOptions } from 'rose-spectacles/step';
import type { StepItemPassThroughOptions } from 'rose-spectacles/stepitem';
import type { StepListPassThroughOptions } from 'rose-spectacles/steplist';
import type { StepPanelPassThroughOptions } from 'rose-spectacles/steppanel';
import type { StepPanelsPassThroughOptions } from 'rose-spectacles/steppanels';
import type { StepperPassThroughOptions } from 'rose-spectacles/stepper';
import type { StepsPassThroughOptions } from 'rose-spectacles/steps';
import type { StyleClassDirectivePassThroughOptions } from 'rose-spectacles/styleclass';
import type { TabPassThroughOptions } from 'rose-spectacles/tab';
import type { TabListPassThroughOptions } from 'rose-spectacles/tablist';
import type { TabMenuPassThroughOptions } from 'rose-spectacles/tabmenu';
import type { TabPanelPassThroughOptions } from 'rose-spectacles/tabpanel';
import type { TabPanelsPassThroughOptions } from 'rose-spectacles/tabpanels';
import type { TabsPassThroughOptions } from 'rose-spectacles/tabs';
import type { TabViewPassThroughOptions } from 'rose-spectacles/tabview';
import type { TagPassThroughOptions } from 'rose-spectacles/tag';
import type { TerminalPassThroughOptions } from 'rose-spectacles/terminal';
import type { TextareaPassThroughOptions } from 'rose-spectacles/textarea';
import type { TieredMenuPassThroughOptions } from 'rose-spectacles/tieredmenu';
import type { TimelinePassThroughOptions } from 'rose-spectacles/timeline';
import type { ToastPassThroughOptions } from 'rose-spectacles/toast';
import type { ToggleButtonPassThroughOptions } from 'rose-spectacles/togglebutton';
import type { ToggleSwitchPassThroughOptions } from 'rose-spectacles/toggleswitch';
import type { ToolbarPassThroughOptions } from 'rose-spectacles/toolbar';
import type { TooltipDirectivePassThroughOptions } from 'rose-spectacles/tooltip';
import type { TreePassThroughOptions } from 'rose-spectacles/tree';
import type { TreeSelectPassThroughOptions } from 'rose-spectacles/treeselect';
import type { TreeTablePassThroughOptions } from 'rose-spectacles/treetable';
import type { VirtualScrollerPassThroughOptions } from 'rose-spectacles/virtualscroller';

export * from 'rose-spectacles/core/config';
export { default } from 'rose-spectacles/core/config';

export interface PrimeVueConfiguration {
    ripple?: boolean;
    /**
     * @deprecated since v4.0. Use 'inputVariant' instead.
     */
    inputStyle?: 'filled' | 'outlined' | undefined;
    inputVariant?: 'filled' | 'outlined' | undefined;
    locale?: PrimeVueLocaleOptions;
    filterMatchModeOptions?: any;
    zIndex?: PrimeVueZIndexOptions;
    theme?: any;
    unstyled?: boolean;
    pt?: PassThrough<PrimeVuePTOptions>;
    ptOptions?: PassThroughOptions;
    csp?: PrimeVueCSPOptions;
}

export interface PrimeVuePTOptions {
    accordion?: DefaultPassThrough<AccordionPassThroughOptions>;
    accordionpanel?: DefaultPassThrough<AccordionPanelPassThroughOptions>;
    accordionheader?: DefaultPassThrough<AccordionHeaderPassThroughOptions>;
    accordioncontent?: DefaultPassThrough<AccordionContentPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Accordion instead.
     */
    accordiontab?: DefaultPassThrough<AccordionTabPassThroughOptions>;
    autocomplete?: DefaultPassThrough<AutoCompletePassThroughOptions>;
    avatar?: DefaultPassThrough<AvatarPassThroughOptions>;
    avatargroup?: DefaultPassThrough<AvatarGroupPassThroughOptions>;
    badge?: DefaultPassThrough<BadgePassThroughOptions>;
    blockui?: DefaultPassThrough<BlockUIPassThroughOptions>;
    breadcrumb?: DefaultPassThrough<BreadcrumbPassThroughOptions>;
    button?: DefaultPassThrough<ButtonPassThroughOptions>;
    buttongroup?: DefaultPassThrough<ButtonGroupPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of DatePicker instead.
     */
    calendar?: DefaultPassThrough<CalendarPassThroughOptions>;
    card?: DefaultPassThrough<CardPassThroughOptions>;
    carousel?: DefaultPassThrough<CarouselPassThroughOptions>;
    cascadeselect?: DefaultPassThrough<CascadeSelectPassThroughOptions>;
    chart?: DefaultPassThrough<ChartPassThroughOptions>;
    checkbox?: DefaultPassThrough<CheckboxPassThroughOptions>;
    checkboxgroup?: DefaultPassThrough<CheckboxGroupPassThroughOptions>;
    chip?: DefaultPassThrough<ChipPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of InputChips instead.
     */
    chips?: DefaultPassThrough<ChipsPassThroughOptions>;
    colorpicker?: DefaultPassThrough<ColorPickerPassThroughOptions>;
    column?: DefaultPassThrough<ColumnPassThroughOptions>;
    columngroup?: DefaultPassThrough<ColumnGroupPassThroughOptions>;
    confirmdialog?: DefaultPassThrough<ConfirmDialogPassThroughOptions>;
    confirmpopup?: DefaultPassThrough<ConfirmPopupPassThroughOptions>;
    contextmenu?: DefaultPassThrough<ContextMenuPassThroughOptions>;
    datatable?: DefaultPassThrough<DataTablePassThroughOptions>;
    dataview?: DefaultPassThrough<DataViewPassThroughOptions>;
    datepicker?: DefaultPassThrough<DatePickerPassThroughOptions>;
    deferredcontent?: DefaultPassThrough<DeferredContentPassThroughOptions>;
    divider?: DefaultPassThrough<DividerPassThroughOptions>;
    dialog?: DefaultPassThrough<DialogPassThroughOptions>;
    dock?: DefaultPassThrough<DockPassThroughOptions>;
    drawer?: DefaultPassThrough<DrawerPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Select instead.
     */
    dropdown?: DefaultPassThrough<DropdownPassThroughOptions>;
    dynamicdialog?: DefaultPassThrough<DialogPassThroughOptions>;
    editor?: DefaultPassThrough<EditorPassThroughOptions>;
    fieldset?: DefaultPassThrough<FieldsetPassThroughOptions>;
    fileupload?: DefaultPassThrough<FileUploadPassThroughOptions>;
    floatlabel?: DefaultPassThrough<FloatLabelPassThroughOptions>;
    fluid?: DefaultPassThrough<FluidPassThroughOptions>;
    galleria?: DefaultPassThrough<GalleriaPassThroughOptions>;
    iconfield?: DefaultPassThrough<IconFieldPassThroughOptions>;
    iftalabel?: DefaultPassThrough<IftaLabelPassThroughOptions>;
    image?: DefaultPassThrough<ImagePassThroughOptions>;
    imagecompare?: DefaultPassThrough<ImageComparePassThroughOptions>;
    inlinemessage?: DefaultPassThrough<InlineMessagePassThroughOptions>;
    inplace?: DefaultPassThrough<InplacePassThroughOptions>;
    inputchips?: DefaultPassThrough<InputChipsPassThroughOptions>;
    inputgroup?: DefaultPassThrough<InputGroupPassThroughOptions>;
    inputgroupaddon?: DefaultPassThrough<InputGroupAddonPassThroughOptions>;
    inputicon?: DefaultPassThrough<InputIconPassThroughOptions>;
    inputmask?: DefaultPassThrough<InputMaskPassThroughOptions>;
    inputnumber?: DefaultPassThrough<InputNumberPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of ToggleSwitch instead.
     */
    inputotp?: DefaultPassThrough<InputOtpPassThroughOptions>;
    inputswitch?: DefaultPassThrough<InputSwitchPassThroughOptions>;
    inputtext?: DefaultPassThrough<InputTextPassThroughOptions>;
    knob?: DefaultPassThrough<KnobPassThroughOptions>;
    listbox?: DefaultPassThrough<ListboxPassThroughOptions>;
    megamenu?: DefaultPassThrough<MegaMenuPassThroughOptions>;
    menu?: DefaultPassThrough<MenuPassThroughOptions>;
    menubar?: DefaultPassThrough<MenubarPassThroughOptions>;
    message?: DefaultPassThrough<MessagePassThroughOptions>;
    metergroup?: DefaultPassThrough<MeterGroupPassThroughOptions>;
    multiselect?: DefaultPassThrough<MultiSelectPassThroughOptions>;
    orderlist?: DefaultPassThrough<OrderListPassThroughOptions>;
    organizationchart?: DefaultPassThrough<OrganizationChartPassThroughOptions>;
    overlaybadge?: DefaultPassThrough<OverlayBadgePassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Popover instead.
     */
    overlaypanel?: DefaultPassThrough<OverlayPanelPassThroughOptions>;
    paginator?: DefaultPassThrough<PaginatorPassThroughOptions>;
    panel?: DefaultPassThrough<PanelPassThroughOptions>;
    panelmenu?: DefaultPassThrough<PanelMenuPassThroughOptions>;
    password?: DefaultPassThrough<PasswordPassThroughOptions>;
    picklist?: DefaultPassThrough<PickListPassThroughOptions>;
    popover?: DefaultPassThrough<PopoverPassThroughOptions>;
    progressbar?: DefaultPassThrough<ProgressBarPassThroughOptions>;
    progressspinner?: DefaultPassThrough<ProgressSpinnerPassThroughOptions>;
    radiobutton?: DefaultPassThrough<RadioButtonPassThroughOptions>;
    radiobuttongroup?: DefaultPassThrough<RadioButtonGroupPassThroughOptions>;
    rating?: DefaultPassThrough<RatingPassThroughOptions>;
    row?: DefaultPassThrough<RowPassThroughOptions>;
    scrollpanel?: DefaultPassThrough<ScrollPanelPassThroughOptions>;
    scrolltop?: DefaultPassThrough<ScrollTopPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Drawer instead.
     */
    sidebar?: DefaultPassThrough<SidebarPassThroughOptions>;
    skeleton?: DefaultPassThrough<SkeletonPassThroughOptions>;
    slider?: DefaultPassThrough<SliderPassThroughOptions>;
    speeddial?: DefaultPassThrough<SpeedDialPassThroughOptions>;
    selectbutton?: DefaultPassThrough<SelectButtonPassThroughOptions>;
    select?: DefaultPassThrough<SelectPassThroughOptions>;
    splitbutton?: DefaultPassThrough<SplitButtonPassThroughOptions>;
    splitter?: DefaultPassThrough<SplitterPassThroughOptions>;
    splitterpanel?: DefaultPassThrough<SplitterPanelPassThroughOptions>;
    step?: DefaultPassThrough<StepPassThroughOptions>;
    stepitem?: DefaultPassThrough<StepItemPassThroughOptions>;
    steplist?: DefaultPassThrough<StepListPassThroughOptions>;
    steppanel?: DefaultPassThrough<StepPanelPassThroughOptions>;
    steppanels?: DefaultPassThrough<StepPanelsPassThroughOptions>;
    stepper?: DefaultPassThrough<StepperPassThroughOptions>;
    steps?: DefaultPassThrough<StepsPassThroughOptions>;
    tabmenu?: DefaultPassThrough<TabMenuPassThroughOptions>;
    tabs?: DefaultPassThrough<TabsPassThroughOptions>;
    tablist?: DefaultPassThrough<TabListPassThroughOptions>;
    tab?: DefaultPassThrough<TabPassThroughOptions>;
    tabpanels?: DefaultPassThrough<TabPanelsPassThroughOptions>;
    tabpanel?: DefaultPassThrough<TabPanelPassThroughOptions>;
    /**
     * @deprecated since v4. Use tabs instead.
     */
    tabview?: DefaultPassThrough<TabViewPassThroughOptions>;
    tag?: DefaultPassThrough<TagPassThroughOptions>;
    terminal?: DefaultPassThrough<TerminalPassThroughOptions>;
    textarea?: DefaultPassThrough<TextareaPassThroughOptions>;
    tieredmenu?: DefaultPassThrough<TieredMenuPassThroughOptions>;
    timeline?: DefaultPassThrough<TimelinePassThroughOptions>;
    toast?: DefaultPassThrough<ToastPassThroughOptions>;
    togglebutton?: DefaultPassThrough<ToggleButtonPassThroughOptions>;
    toggleswitch?: DefaultPassThrough<ToggleSwitchPassThroughOptions>;
    toolbar?: DefaultPassThrough<ToolbarPassThroughOptions>;
    tree?: DefaultPassThrough<TreePassThroughOptions>;
    treeselect?: DefaultPassThrough<TreeSelectPassThroughOptions>;
    treetable?: DefaultPassThrough<TreeTablePassThroughOptions>;
    virtualscroller?: DefaultPassThrough<VirtualScrollerPassThroughOptions>;
    directives?: {
        animate?: AnimateOnScrollDirectivePassThroughOptions;
        badge?: BadgeDirectivePassThroughOptions;
        focustrap?: FocusTrapDirectivePassThroughOptions;
        keyfilter?: KeyFilterDirectivePassThroughOptions;
        ripple?: RippleDirectivePassThroughOptions;
        styleclass?: StyleClassDirectivePassThroughOptions;
        tooltip?: TooltipDirectivePassThroughOptions;
    };
    global?: {
        css?: ((options: any) => string | undefined) | string | undefined;
    };
}
