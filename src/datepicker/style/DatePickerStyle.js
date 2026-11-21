import { style } from '../../internal/styles/datepicker/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: ({ props }) => ({ position: props.appendTo === 'self' || props.showClear ? 'relative' : undefined })
};

const classes = {
    root: ({ instance, state }) => [
        'rs-datepicker rs-component rs-inputwrapper',
        {
            'rs-invalid': instance.$invalid,
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': state.focused || state.overlayVisible,
            'rs-focus': state.focused || state.overlayVisible,
            'rs-datepicker-fluid': instance.$fluid
        }
    ],
    pcInputText: 'rs-datepicker-input',
    clearIcon: 'rs-datepicker-clear-icon',
    dropdown: 'rs-datepicker-dropdown',
    inputIconContainer: 'rs-datepicker-input-icon-container',
    inputIcon: 'rs-datepicker-input-icon',
    panel: ({ props }) => [
        'rs-datepicker-panel rs-component',
        {
            'rs-datepicker-panel-inline': props.inline,
            'rs-disabled': props.disabled,
            'rs-datepicker-timeonly': props.timeOnly
        }
    ],
    calendarContainer: 'rs-datepicker-calendar-container',
    calendar: 'rs-datepicker-calendar',
    header: 'rs-datepicker-header',
    pcPrevButton: 'rs-datepicker-prev-button',
    title: 'rs-datepicker-title',
    selectMonth: 'rs-datepicker-select-month',
    selectYear: 'rs-datepicker-select-year',
    decade: 'rs-datepicker-decade',
    pcNextButton: 'rs-datepicker-next-button',
    dayView: 'rs-datepicker-day-view',
    weekHeader: 'rs-datepicker-weekheader rs-disabled',
    weekNumber: 'rs-datepicker-weeknumber',
    weekLabelContainer: 'rs-datepicker-weeklabel-container rs-disabled',
    weekDayCell: 'rs-datepicker-weekday-cell',
    weekDay: 'rs-datepicker-weekday',
    dayCell: ({ date }) => [
        'rs-datepicker-day-cell',
        {
            'rs-datepicker-other-month': date.otherMonth,
            'rs-datepicker-today': date.today
        }
    ],
    day: ({ instance, props, state, date }) => {
        let selectedDayClass = '';

        if (instance.isRangeSelection() && instance.isSelected(date) && date.selectable) {
            const start = typeof state.rawValue[0] === 'string' ? instance.parseValue(state.rawValue[0])[0] : state.rawValue[0];
            const end = typeof state.rawValue[1] === 'string' ? instance.parseValue(state.rawValue[1])[0] : state.rawValue[1];

            selectedDayClass = instance.isDateEquals(start, date) || instance.isDateEquals(end, date) ? 'rs-datepicker-day-selected' : 'rs-datepicker-day-selected-range';
        }

        return [
            'rs-datepicker-day',
            {
                'rs-datepicker-day-selected': !instance.isRangeSelection() && instance.isSelected(date) && date.selectable,
                'rs-disabled': props.disabled || !date.selectable
            },
            selectedDayClass
        ];
    },
    monthView: 'rs-datepicker-month-view',
    month: ({ instance, props, month, index }) => [
        'rs-datepicker-month',
        {
            'rs-datepicker-month-selected': instance.isMonthSelected(index),
            'rs-disabled': props.disabled || !month.selectable
        }
    ],
    yearView: 'rs-datepicker-year-view',
    year: ({ instance, props, year }) => [
        'rs-datepicker-year',
        {
            'rs-datepicker-year-selected': instance.isYearSelected(year.value),
            'rs-disabled': props.disabled || !year.selectable
        }
    ],
    timePicker: 'rs-datepicker-time-picker',
    hourPicker: 'rs-datepicker-hour-picker',
    pcIncrementButton: 'rs-datepicker-increment-button',
    pcDecrementButton: 'rs-datepicker-decrement-button',
    separator: 'rs-datepicker-separator',
    minutePicker: 'rs-datepicker-minute-picker',
    secondPicker: 'rs-datepicker-second-picker',
    ampmPicker: 'rs-datepicker-ampm-picker',
    buttonbar: 'rs-datepicker-buttonbar',
    pcTodayButton: 'rs-datepicker-today-button',
    pcClearButton: 'rs-datepicker-clear-button'
};

export default BaseStyle.extend({
    name: 'datepicker',
    style,
    classes,
    inlineStyles
});
