/**
 *
 * DatePicker is a form component to work with dates.
 *
 *
 * @module datepickerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DatePickerClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-datepicker',
    /**
     * Class name of the input element
     */
    pcInput = 'rs-datepicker-input',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-datepicker-dropdown',
    /**
     * Class name of the input icon container element
     */
    inputIconContainer = 'rs-datepicker-input-icon-container',
    /**
     * Class name of the input icon element
     */
    inputIcon = 'rs-datepicker-input-icon',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-datepicker-clear-icon',
    /**
     * Class name of the panel element
     */
    panel = 'rs-datepicker-panel',
    /**
     * Class name of the calendar container element
     */
    calendarContainer = 'rs-datepicker-calendar-container',
    /**
     * Class name of the calendar element
     */
    calendar = 'rs-datepicker-calendar',
    /**
     * Class name of the header element
     */
    header = 'rs-datepicker-header',
    /**
     * Class name of the previous button element
     */
    pcPrevButton = 'rs-datepicker-prev-button',
    /**
     * Class name of the title element
     */
    title = 'rs-datepicker-title',
    /**
     * Class name of the select month element
     */
    selectMonth = 'rs-datepicker-select-month',
    /**
     * Class name of the select year element
     */
    selectYear = 'rs-datepicker-select-year',
    /**
     * Class name of the decade element
     */
    decade = 'rs-datepicker-decade',
    /**
     * Class name of the next button element
     */
    pcNextButton = 'rs-datepicker-next-button',
    /**
     * Class name of the day view element
     */
    dayView = 'rs-datepicker-day-view',
    /**
     * Class name of the week header element
     */
    weekHeader = 'rs-datepicker-weekheader',
    /**
     * Class name of the week number element
     */
    weekNumber = 'rs-datepicker-weeknumber',
    /**
     * Class name of the week label container element
     */
    weekLabelContainer = 'rs-datepicker-weeklabel-container',
    /**
     * Class name of the week day cell element
     */
    weekDayCell = 'rs-datepicker-weekday-cell',
    /**
     * Class name of the week day element
     */
    weekDay = 'rs-datepicker-weekday',
    /**
     * Class name of the day cell element
     */
    dayCell = 'rs-datepicker-day-cell',
    /**
     * Class name of the day element
     */
    day = 'rs-datepicker-day',
    /**
     * Class name of the month view element
     */
    monthView = 'rs-datepicker-month-view',
    /**
     * Class name of the month element
     */
    month = 'rs-datepicker-month',
    /**
     * Class name of the year view element
     */
    yearView = 'rs-datepicker-year-view',
    /**
     * Class name of the year element
     */
    year = 'rs-datepicker-year',
    /**
     * Class name of the time picker element
     */
    timePicker = 'rs-datepicker-time-picker',
    /**
     * Class name of the hour picker element
     */
    hourPicker = 'rs-datepicker-hour-picker',
    /**
     * Class name of the increment button element
     */
    pcIncrementButton = 'rs-datepicker-increment-button',
    /**
     * Class name of the decrement button element
     */
    pcDecrementButton = 'rs-datepicker-decrement-button',
    /**
     * Class name of the separator element
     */
    separator = 'rs-datepicker-separator',
    /**
     * Class name of the minute picker element
     */
    minutePicker = 'rs-datepicker-minute-picker',
    /**
     * Class name of the second picker element
     */
    secondPicker = 'rs-datepicker-second-picker',
    /**
     * Class name of the ampm picker element
     */
    ampmPicker = 'rs-datepicker-ampm-picker',
    /**
     * Class name of the buttonbar element
     */
    buttonbar = 'rs-datepicker-buttonbar',
    /**
     * Class name of the today button element
     */
    pcTodayButton = 'rs-datepicker-today-button',
    /**
     * Class name of the clear button element
     */
    pcClearButton = 'rs-datepicker-clear-button'
}

export interface DatePickerStyle extends BaseStyle {}

declare const style: DatePickerStyle;
export default style;
