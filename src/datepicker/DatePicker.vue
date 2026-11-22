<template>
    <span ref="container" :id="$id" :class="cx('root')" :style="sx('root')" :data-p="containerDataP" v-bind="ptmi('root')">
        <InputText
            v-if="!inline"
            :ref="inputRef"
            :id="inputId"
            role="combobox"
            :class="[inputClass, cx('pcInputText')]"
            :style="inputStyle"
            :defaultValue="inputFieldValue"
            :placeholder="placeholder"
            :name="name"
            :size="size"
            :invalid="invalid"
            :variant="variant"
            :fluid="fluid"
            :required="required"
            :unstyled="unstyled"
            autocomplete="off"
            aria-autocomplete="none"
            aria-haspopup="dialog"
            :aria-expanded="overlayVisible"
            :aria-controls="overlayVisible ? panelId : undefined"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            inputmode="none"
            :disabled="disabled"
            :readonly="!manualInput || readonly"
            :tabindex="0"
            @input="onInput"
            @click="onInputClick"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            :data-p-has-dropdown="showIcon && iconDisplay === 'button' && !inline"
            :data-p-has-e-icon="showIcon && iconDisplay === 'input' && !inline"
            :pt="ptm('pcInputText')"
        />
        <slot v-if="showClear && !inline" name="clearicon" :class="cx('clearIcon')" :clearCallback="onClearClick">
            <TimesIcon ref="clearIcon" :class="[cx('clearIcon')]" @click="onClearClick" v-bind="ptm('clearIcon')" />
        </slot>
        <slot v-if="showIcon && iconDisplay === 'button' && !inline" name="dropdownbutton" :toggleCallback="onButtonClick">
            <button
                :class="cx('dropdown')"
                :disabled="disabled"
                @click="onButtonClick"
                type="button"
                :aria-label="locale.chooseDate"
                aria-haspopup="dialog"
                :aria-expanded="overlayVisible"
                :aria-controls="panelId"
                v-bind="ptm('dropdown')"
            >
                <slot name="dropdownicon" :class="icon">
                    <component :is="icon ? 'span' : 'CalendarIcon'" :class="icon" v-bind="ptm('dropdownIcon')" />
                </slot>
            </button>
        </slot>
        <template v-else-if="showIcon && iconDisplay === 'input' && !inline">
            <span v-if="$slots.inputicon || showIcon" :class="cx('inputIconContainer')" :data-p="inputIconDataP" v-bind="ptm('inputIconContainer')">
                <slot name="inputicon" :class="cx('inputIcon')" :clickCallback="onButtonClick">
                    <component :is="icon ? 'i' : 'CalendarIcon'" :class="[icon, cx('inputIcon')]" @click="onButtonClick" v-bind="ptm('inputicon')" />
                </slot>
            </span>
        </template>
        <Portal :appendTo="appendTo" :disabled="inline">
            <transition
                name="rs-anchored-overlay"
                @enter="onOverlayEnter($event)"
                @after-enter="onOverlayEnterComplete"
                @after-leave="onOverlayAfterLeave"
                @leave="onOverlayLeave"
                v-bind="ptm('transition')"
            >
                <div
                    v-if="inline || overlayVisible"
                    :ref="overlayRef"
                    :id="panelId"
                    :class="[cx('panel'), panelClass]"
                    :style="panelStyle"
                    :role="inline ? undefined : 'dialog'"
                    :aria-modal="inline ? undefined : true"
                    :aria-label="locale.chooseDate"
                    @click="onOverlayClick"
                    @keydown="onOverlayKeyDown"
                    @mouseup="onOverlayMouseUp"
                    :data-p="panelDataP"
                    v-bind="ptm('panel')"
                >
                    <template v-if="!timeOnly">
                        <div :class="cx('calendarContainer')" v-bind="ptm('calendarContainer')">
                            <div v-for="(month, groupIndex) of months" :key="month.month + month.year" :class="cx('calendar')" v-bind="ptm('calendar')">
                                <div :class="cx('header')" v-bind="ptm('header')">
                                    <slot name="header"></slot>
                                    <slot
                                        name="prevbutton"
                                        :actionCallback="(event: Event) => onPrevButtonClick(event)"
                                        :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                                        :ariaLabel="prevButtonAriaLabel"
                                    >
                                        <Button
                                            v-show="groupIndex === 0"
                                            :ref="previousButtonRef"
                                            :class="cx('pcPrevButton')"
                                            :disabled="disabled"
                                            :aria-label="prevButtonAriaLabel"
                                            :unstyled="unstyled"
                                            @click="onPrevButtonClick"
                                            @keydown="onContainerButtonKeydown"
                                            v-bind="navigatorButtonProps"
                                            :pt="ptm('pcPrevButton')"
                                            data-pc-group-section="navigator"
                                        >
                                            <template #icon="slotProps">
                                                <slot name="previcon">
                                                    <component
                                                        :is="prevIcon ? 'span' : 'ChevronLeftIcon'"
                                                        :class="[prevIcon, slotProps.class]"
                                                        v-bind="ptm('pcPrevButton')['icon']"
                                                    />
                                                </slot>
                                            </template>
                                        </Button>
                                    </slot>
                                    <div :class="cx('title')" v-bind="ptm('title')">
                                        <template v-if="locale.showMonthAfterYear">
                                            <button
                                                v-if="currentView !== 'year'"
                                                type="button"
                                                @click="switchToYearView"
                                                @keydown="onContainerButtonKeydown"
                                                :class="cx('selectYear')"
                                                :disabled="switchViewButtonDisabled"
                                                :aria-label="locale.chooseYear"
                                                v-bind="ptm('selectYear')"
                                                data-pc-group-section="view"
                                            >
                                                {{ getYear(month) }}
                                            </button>
                                            <button
                                                v-if="currentView === 'date'"
                                                type="button"
                                                @click="switchToMonthView"
                                                @keydown="onContainerButtonKeydown"
                                                :class="cx('selectMonth')"
                                                :disabled="switchViewButtonDisabled"
                                                :aria-label="locale.chooseMonth"
                                                v-bind="ptm('selectMonth')"
                                                data-pc-group-section="view"
                                            >
                                                {{ getMonthName(month.month) }}
                                            </button>
                                        </template>
                                        <template v-else>
                                            <button
                                                v-if="currentView === 'date'"
                                                type="button"
                                                @click="switchToMonthView"
                                                @keydown="onContainerButtonKeydown"
                                                :class="cx('selectMonth')"
                                                :disabled="switchViewButtonDisabled"
                                                :aria-label="locale.chooseMonth"
                                                v-bind="ptm('selectMonth')"
                                                data-pc-group-section="view"
                                            >
                                                {{ getMonthName(month.month) }}
                                            </button>
                                            <button
                                                v-if="currentView !== 'year'"
                                                type="button"
                                                @click="switchToYearView"
                                                @keydown="onContainerButtonKeydown"
                                                :class="cx('selectYear')"
                                                :disabled="switchViewButtonDisabled"
                                                :aria-label="locale.chooseYear"
                                                v-bind="ptm('selectYear')"
                                                data-pc-group-section="view"
                                            >
                                                {{ getYear(month) }}
                                            </button>
                                        </template>
                                        <span v-if="currentView === 'year'" :class="cx('decade')" v-bind="ptm('decade')">
                                            <slot name="decade" :years="yearPickerValues">
                                                {{ yearPickerValues[0].value }} - {{ yearPickerValues[yearPickerValues.length - 1].value }}
                                            </slot>
                                        </span>
                                    </div>
                                    <slot
                                        name="nextbutton"
                                        :actionCallback="(event: Event) => onNextButtonClick(event)"
                                        :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                                        :ariaLabel="nextButtonAriaLabel"
                                    >
                                        <Button
                                            v-show="numberOfMonths === 1 ? true : groupIndex === numberOfMonths - 1"
                                            :ref="nextButtonRef"
                                            :class="cx('pcNextButton')"
                                            :disabled="disabled"
                                            :aria-label="nextButtonAriaLabel"
                                            :unstyled="unstyled"
                                            @click="onNextButtonClick"
                                            @keydown="onContainerButtonKeydown"
                                            v-bind="navigatorButtonProps"
                                            :pt="ptm('pcNextButton')"
                                            data-pc-group-section="navigator"
                                        >
                                            <template #icon="slotProps">
                                                <slot name="nexticon">
                                                    <component
                                                        :is="nextIcon ? 'span' : 'ChevronRightIcon'"
                                                        :class="[nextIcon, slotProps.class]"
                                                        v-bind="ptm('pcNextButton')['icon']"
                                                    />
                                                </slot>
                                            </template>
                                        </Button>
                                    </slot>
                                </div>
                                <table v-if="currentView === 'date'" :class="cx('dayView')" role="grid" v-bind="ptm('dayView')">
                                    <thead v-bind="ptm('tableHeader')">
                                        <tr v-bind="ptm('tableHeaderRow')">
                                            <th
                                                v-if="showWeek"
                                                scope="col"
                                                :class="cx('weekHeader')"
                                                v-bind="ptm('weekHeader', { context: { disabled: showWeek } })"
                                                :data-p-disabled="showWeek"
                                                data-pc-group-section="tableheadercell"
                                            >
                                                <slot name="weekheaderlabel">
                                                    <span
                                                        v-bind="ptm('weekHeaderLabel', { context: { disabled: showWeek } })"
                                                        data-pc-group-section="tableheadercelllabel"
                                                    >
                                                        {{ weekHeaderLabel }}
                                                    </span>
                                                </slot>
                                            </th>
                                            <th
                                                v-for="weekDay of weekDays"
                                                :key="weekDay"
                                                scope="col"
                                                :abbr="weekDay"
                                                v-bind="ptm('tableHeaderCell')"
                                                data-pc-group-section="tableheadercell"
                                                :class="cx('weekDayCell')"
                                            >
                                                <span :class="cx('weekDay')" v-bind="ptm('weekDay')" data-pc-group-section="tableheadercelllabel">{{
                                                    weekDay
                                                }}</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-bind="ptm('tableBody')">
                                        <tr v-for="(week, i) of month.dates" :key="week[0].day + '' + week[0].month" v-bind="ptm('tableBodyRow')">
                                            <td v-if="showWeek" :class="cx('weekNumber')" v-bind="ptm('weekNumber')" data-pc-group-section="tablebodycell">
                                                <span
                                                    :class="cx('weekLabelContainer')"
                                                    v-bind="ptm('weekLabelContainer', { context: { disabled: showWeek } })"
                                                    :data-p-disabled="showWeek"
                                                    data-pc-group-section="tablebodycelllabel"
                                                >
                                                    <slot name="weeklabel" :weekNumber="month.weekNumbers[i]">
                                                        <span v-if="month.weekNumbers[i] < 10" style="visibility: hidden" v-bind="ptm('weekLabel')">0</span>
                                                        {{ month.weekNumbers[i] }}
                                                    </slot>
                                                </span>
                                            </td>
                                            <td
                                                v-for="date of week"
                                                :key="date.day + '' + date.month"
                                                :aria-label="String(date.day)"
                                                :class="cx('dayCell', { date })"
                                                v-bind="
                                                    ptm('dayCell', {
                                                        context: {
                                                            date,
                                                            today: date.today,
                                                            otherMonth: date.otherMonth,
                                                            selected: isSelected(date),
                                                            disabled: !date.selectable
                                                        }
                                                    })
                                                "
                                                :data-p-today="date.today"
                                                :data-p-other-month="date.otherMonth"
                                                data-pc-group-section="tablebodycell"
                                            >
                                                <span
                                                    v-if="showOtherMonths || !date.otherMonth"
                                                    v-ripple
                                                    :class="cx('day', { date })"
                                                    @click="onDateSelect($event, date)"
                                                    draggable="false"
                                                    @keydown="onDateCellKeydown($event, date, groupIndex)"
                                                    :aria-selected="isSelected(date)"
                                                    :aria-disabled="!date.selectable"
                                                    v-bind="
                                                        ptm('day', {
                                                            context: {
                                                                date,
                                                                today: date.today,
                                                                otherMonth: date.otherMonth,
                                                                selected: isSelected(date),
                                                                disabled: !date.selectable
                                                            }
                                                        })
                                                    "
                                                    :data-p="dayDataP(date)"
                                                    data-pc-group-section="tablebodycelllabel"
                                                >
                                                    <slot name="date" :date="date">{{ date.day }}</slot>
                                                </span>
                                                <div
                                                    v-if="isSelected(date)"
                                                    class="rs-hidden-accessible"
                                                    aria-live="polite"
                                                    v-bind="ptm('hiddenSelectedDay')"
                                                    :data-p-hidden-accessible="true"
                                                >
                                                    {{ date.day }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-if="currentView === 'month'" :class="cx('monthView')" v-bind="ptm('monthView')">
                            <span
                                v-for="(m, i) of monthPickerValues"
                                :key="i"
                                v-ripple
                                @click="onMonthSelect($event, { month: m, index: i })"
                                @keydown="onMonthCellKeydown($event, { month: m, index: i })"
                                :class="cx('month', { month: m, index: i })"
                                v-bind="
                                    ptm('month', {
                                        context: {
                                            month: m,
                                            monthIndex: i,
                                            selected: isMonthSelected(i),
                                            disabled: !m.selectable
                                        }
                                    })
                                "
                                :data-p-disabled="!m.selectable"
                                :data-p-selected="isMonthSelected(i)"
                            >
                                {{ m.value }}
                                <div
                                    v-if="isMonthSelected(i)"
                                    class="rs-hidden-accessible"
                                    aria-live="polite"
                                    v-bind="ptm('hiddenMonth')"
                                    :data-p-hidden-accessible="true"
                                >
                                    {{ m.value }}
                                </div>
                            </span>
                        </div>
                        <div v-if="currentView === 'year'" :class="cx('yearView')" v-bind="ptm('yearView')">
                            <span
                                v-for="y of yearPickerValues"
                                :key="y.value"
                                v-ripple
                                @click="onYearSelect($event, y)"
                                @keydown="onYearCellKeydown($event, y)"
                                :class="cx('year', { year: y })"
                                v-bind="
                                    ptm('year', {
                                        context: {
                                            year: y,
                                            selected: isYearSelected(y.value),
                                            disabled: !y.selectable
                                        }
                                    })
                                "
                                :data-p-disabled="!y.selectable"
                                :data-p-selected="isYearSelected(y.value)"
                            >
                                {{ y.value }}
                                <div
                                    v-if="isYearSelected(y.value)"
                                    class="rs-hidden-accessible"
                                    aria-live="polite"
                                    v-bind="ptm('hiddenYear')"
                                    :data-p-hidden-accessible="true"
                                >
                                    {{ y.value }}
                                </div>
                            </span>
                        </div>
                    </template>
                    <div v-if="(showTime || timeOnly) && currentView === 'date'" :class="cx('timePicker')" :data-p="timePickerDataP" v-bind="ptm('timePicker')">
                        <div class="rs-hidden-accessible" aria-live="polite" v-bind="ptm('hiddenTime')" :data-p-hidden-accessible="true">
                            {{ formattedCurrentTime }}
                        </div>
                        <div :class="cx('hourPicker')" v-bind="ptm('hourPicker')" data-pc-group-section="timepickerContainer">
                            <slot name="hourincrementbutton" :callbacks="hourIncrementCallbacks">
                                <Button
                                    :class="cx('pcIncrementButton')"
                                    :aria-label="locale.nextHour"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 0, 1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 0, 1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 0, 1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcIncrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="incrementicon">
                                            <component
                                                :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                                :class="[incrementIcon, slotProps.class]"
                                                v-bind="ptm('pcIncrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                            <span v-bind="ptm('hour')" data-pc-group-section="timepickerlabel">{{ formattedCurrentHour }}</span>
                            <slot name="hourdecrementbutton" :callbacks="hourDecrementCallbacks">
                                <Button
                                    :class="cx('pcDecrementButton')"
                                    :aria-label="locale.prevHour"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 0, -1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 0, -1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 0, -1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcDecrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="decrementicon">
                                            <component
                                                :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                                :class="[decrementIcon, slotProps.class]"
                                                v-bind="ptm('pcDecrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                        </div>
                        <div v-bind="ptm('separatorContainer')" data-pc-group-section="timepickerContainer">
                            <span v-bind="ptm('separator')" data-pc-group-section="timepickerlabel">{{ timeSeparator }}</span>
                        </div>
                        <div :class="cx('minutePicker')" v-bind="ptm('minutePicker')" data-pc-group-section="timepickerContainer">
                            <slot name="minuteincrementbutton" :callbacks="minuteIncrementCallbacks">
                                <Button
                                    :class="cx('pcIncrementButton')"
                                    :aria-label="locale.nextMinute"
                                    :disabled="disabled"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 1, 1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 1, 1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 1, 1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcIncrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="incrementicon">
                                            <component
                                                :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                                :class="[incrementIcon, slotProps.class]"
                                                v-bind="ptm('pcIncrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                            <span v-bind="ptm('minute')" data-pc-group-section="timepickerlabel">{{ formattedCurrentMinute }}</span>
                            <slot name="minutedecrementbutton" :callbacks="minuteDecrementCallbacks">
                                <Button
                                    :class="cx('pcDecrementButton')"
                                    :aria-label="locale.prevMinute"
                                    :disabled="disabled"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 1, -1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 1, -1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 1, -1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcDecrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="decrementicon">
                                            <component
                                                :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                                :class="[decrementIcon, slotProps.class]"
                                                v-bind="ptm('pcDecrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                        </div>
                        <div
                            v-if="showSeconds"
                            :class="cx('separatorContainer')"
                            v-bind="ptm('separatorContainer')"
                            data-pc-group-section="timepickerContainer"
                        >
                            <span v-bind="ptm('separator')" data-pc-group-section="timepickerlabel">{{ timeSeparator }}</span>
                        </div>
                        <div v-if="showSeconds" :class="cx('secondPicker')" v-bind="ptm('secondPicker')" data-pc-group-section="timepickerContainer">
                            <slot name="secondincrementbutton" :callbacks="secondIncrementCallbacks">
                                <Button
                                    :class="cx('pcIncrementButton')"
                                    :aria-label="locale.nextSecond"
                                    :disabled="disabled"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 2, 1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 2, 1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 2, 1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcIncrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="incrementicon">
                                            <component
                                                :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                                :class="[incrementIcon, slotProps.class]"
                                                v-bind="ptm('pcIncrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                            <span v-bind="ptm('second')" data-pc-group-section="timepickerlabel">{{ formattedCurrentSecond }}</span>
                            <slot name="seconddecrementbutton" :callbacks="secondDecrementCallbacks">
                                <Button
                                    :class="cx('pcDecrementButton')"
                                    :aria-label="locale.prevSecond"
                                    :disabled="disabled"
                                    :unstyled="unstyled"
                                    @mousedown="onTimePickerElementMouseDown($event, 2, -1)"
                                    @mouseup="onTimePickerElementMouseUp($event)"
                                    @keydown="onContainerButtonKeydown"
                                    @mouseleave="onTimePickerElementMouseLeave()"
                                    @keydown.enter="onTimePickerElementMouseDown($event, 2, -1)"
                                    @keydown.space="onTimePickerElementMouseDown($event, 2, -1)"
                                    @keyup.enter="onTimePickerElementMouseUp($event)"
                                    @keyup.space="onTimePickerElementMouseUp($event)"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcDecrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="decrementicon">
                                            <component
                                                :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                                :class="[decrementIcon, slotProps.class]"
                                                v-bind="ptm('pcDecrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                        </div>
                        <div
                            v-if="hourFormat == '12'"
                            :class="cx('separatorContainer')"
                            v-bind="ptm('separatorContainer')"
                            data-pc-group-section="timepickerContainer"
                        >
                            <span v-bind="ptm('separator')" data-pc-group-section="timepickerlabel">{{ timeSeparator }}</span>
                        </div>
                        <div v-if="hourFormat == '12'" :class="cx('ampmPicker')" v-bind="ptm('ampmPicker')">
                            <slot
                                name="ampmincrementbutton"
                                :toggleCallback="(event: Event) => toggleAMPM(event)"
                                :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                            >
                                <Button
                                    :class="cx('pcIncrementButton')"
                                    :aria-label="locale.am"
                                    :disabled="disabled"
                                    :unstyled="unstyled"
                                    @click="toggleAMPM($event)"
                                    @keydown="onContainerButtonKeydown"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcIncrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="incrementicon" :class="cx('incrementIcon')">
                                            <component
                                                :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                                :class="[cx('incrementIcon'), slotProps.class]"
                                                v-bind="ptm('pcIncrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                            <span v-bind="ptm('ampm')" data-pc-group-section="timepickerlabel">{{ pm ? locale.pm : locale.am }}</span>
                            <slot
                                name="ampmdecrementbutton"
                                :toggleCallback="(event: Event) => toggleAMPM(event)"
                                :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                            >
                                <Button
                                    :class="cx('pcDecrementButton')"
                                    :aria-label="locale.pm"
                                    :disabled="disabled"
                                    @click="toggleAMPM($event)"
                                    @keydown="onContainerButtonKeydown"
                                    v-bind="timepickerButtonProps"
                                    :pt="ptm('pcDecrementButton')"
                                    data-pc-group-section="timepickerbutton"
                                >
                                    <template #icon="slotProps">
                                        <slot name="decrementicon" :class="cx('decrementIcon')">
                                            <component
                                                :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                                :class="[cx('decrementIcon'), slotProps.class]"
                                                v-bind="ptm('pcDecrementButton')['icon']"
                                                data-pc-group-section="timepickerlabel"
                                            />
                                        </slot>
                                    </template>
                                </Button>
                            </slot>
                        </div>
                    </div>
                    <div v-if="showButtonBar" :class="cx('buttonbar')" v-bind="ptm('buttonbar')">
                        <slot
                            name="buttonbar"
                            :todayCallback="(event: Event) => onTodayButtonClick(event)"
                            :clearCallback="(event: Event) => onClearButtonClick(event)"
                        >
                            <slot
                                name="todaybutton"
                                :actionCallback="(event: Event) => onTodayButtonClick(event)"
                                :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                            >
                                <Button
                                    :label="todayLabel"
                                    @click="onTodayButtonClick($event)"
                                    :class="cx('pcTodayButton')"
                                    :unstyled="unstyled"
                                    @keydown="onContainerButtonKeydown"
                                    v-bind="todayButtonProps"
                                    :pt="ptm('pcTodayButton')"
                                    data-pc-group-section="button"
                                />
                            </slot>
                            <slot
                                name="clearbutton"
                                :actionCallback="(event: Event) => onClearButtonClick(event)"
                                :keydownCallback="(event: KeyboardEvent) => onContainerButtonKeydown(event)"
                            >
                                <Button
                                    :label="clearLabel"
                                    @click="onClearButtonClick($event)"
                                    :class="cx('pcClearButton')"
                                    :unstyled="unstyled"
                                    @keydown="onContainerButtonKeydown"
                                    v-bind="clearButtonProps"
                                    :pt="ptm('pcClearButton')"
                                    data-pc-group-section="button"
                                />
                            </slot>
                        </slot>
                    </div>
                    <slot name="footer"></slot>
                </div>
            </transition>
        </Portal>
    </span>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { cn } from '../internal/utils/index';
import {
    absolutePosition,
    addStyle,
    getAttribute,
    getFocusableElements,
    getIndex,
    getOuterWidth,
    isTouchDevice,
    relativePosition,
    setAttribute
} from '../internal/utils/dom/index';
import { isDate, isEmpty, isNotEmpty, localeComparator } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { defaultOptions } from '../core/config/PrimeVue';
import type { Handler } from '../internal/utils/eventbus/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import CalendarIcon from '../icons/calendar/CalendarIcon.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronLeftIcon from '../icons/chevronleft/ChevronLeftIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import ChevronUpIcon from '../icons/chevronup/ChevronUpIcon.vue';
import TimesIcon from '../icons/times/TimesIcon.vue';
import Button from '../button/Button.vue';
import InputText from '../inputtext/InputText.vue';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import BaseDatePicker from './BaseDatePicker.vue';
import type { DatePickerDateSlotOptions, DatePickerMonthOptions, DatePickerYearOptions } from './DatePicker';

type DateItem = Date | null;
type DateSelection = Date | DateItem[] | null;
type ModelInput = DateSelection | string | (DateItem | string)[] | undefined;
type ElementRef = Element | ComponentPublicInstance | null;
type DayCell = Omit<DatePickerDateSlotOptions, 'today'> & { today?: boolean; otherMonth?: boolean };

interface CalendarMonth {
    month: number;
    year: number;
    dates: DayCell[][];
    weekNumbers: number[];
}

interface MonthChoice {
    month: DatePickerMonthOptions;
    index: number;
}

function find(container: Element | null | undefined, selector: string): HTMLElement[] {
    return container ? Array.from(container.querySelectorAll<HTMLElement>(selector)) : [];
}

function findSingle(container: Element | null | undefined, selector: string): HTMLElement | null {
    return container?.querySelector<HTMLElement>(selector) ?? null;
}

function refElement(ref: ElementRef): unknown {
    return ref && '$el' in ref ? ref.$el : ref;
}

export default defineComponent({
    name: 'DatePicker',
    extends: BaseDatePicker,
    inheritAttrs: false,
    emits: ['show', 'hide', 'input', 'month-change', 'year-change', 'date-select', 'today-click', 'clear-click', 'focus', 'blur', 'keydown'],
    inject: {
        $pcFluid: { default: null }
    },
    data() {
        return {
            currentMonth: 0,
            currentYear: 0,
            currentHour: 0,
            currentMinute: 0,
            currentSecond: 0,
            pm: null as boolean | null,
            navigationState: null as { backward: boolean; button?: boolean } | null,
            timePickerChange: false,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            selfClick: false,
            overlayEventListener: null as Handler | null,
            resizeListener: null as (() => void) | null,
            matchMediaListener: null as (() => void) | null,
            matchMediaOrientationListener: null as (() => void) | null,
            overlay: null as HTMLElement | null,
            input: null as HTMLInputElement | null,
            previousButton: null as HTMLElement | null,
            nextButton: null as HTMLElement | null,
            timePickerTimer: null as ReturnType<typeof setTimeout> | null,
            preventFocus: false,
            typeUpdate: false,
            inputDraft: null as string | null,
            responsiveStyleElement: null as HTMLStyleElement | null,
            selectionStart: null as number | null,
            selectionEnd: null as number | null,
            focused: false,
            overlayVisible: false,
            currentView: this.view,
            query: null as MediaQueryList | null,
            queryMatches: false,
            queryOrientation: null as MediaQueryList | null,
            focusedDateIndex: 0,
            rawValue: null as DateSelection
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(newValue: ModelInput) {
                this.rawValue = this.valueForSelectionMode(newValue);
                this.updateCurrentMetaData();

                if (!this.typeUpdate) {
                    this.inputDraft = null;

                    if (!this.inline && this.input) this.input.value = this.formatValue(this.rawValue);
                }

                this.typeUpdate = false;

                this.updateClearIconVisibility(!isEmpty(newValue));
            }
        },
        selectionMode() {
            this.inputDraft = null;
            this.rawValue = this.valueForSelectionMode(this.rawValue);
            this.updateCurrentMetaData();

            if (this.input && !this.inline) this.input.value = this.formatValue(this.rawValue);
        },
        showTime() {
            this.updateCurrentMetaData();
        },
        minDate() {
            this.updateCurrentMetaData();
        },
        maxDate() {
            this.updateCurrentMetaData();
        },
        months() {
            if (this.overlay) {
                if (!this.focused) {
                    if (this.inline) {
                        this.preventFocus = true;
                    }

                    setTimeout(this.updateFocus, 0);
                }
            }
        },
        numberOfMonths() {
            this.destroyResponsiveStyleElement();
            this.createResponsiveStyle();
        },
        responsiveOptions() {
            this.destroyResponsiveStyleElement();
            this.createResponsiveStyle();
        },
        currentView() {
            Promise.resolve(null).then(() => this.alignOverlay());
        },
        view(newValue: string) {
            this.currentView = newValue;
        }
    },
    created() {
        this.updateCurrentMetaData();
    },
    mounted() {
        this.createResponsiveStyle();
        this.bindMatchMediaListener();
        this.bindMatchMediaOrientationListener();

        if (this.inline) {
            if (!this.disabled) {
                this.preventFocus = true;
                this.initFocusableCell();
            }
        } else if (this.input) {
            this.input.value = this.inputFieldValue;

            this.updateClearIconVisibility(this.$filled);
        }
    },
    updated() {
        if (this.overlay) {
            this.preventFocus = true;
            setTimeout(this.updateFocus, 0);
        }

        if (this.input && this.selectionStart != null && this.selectionEnd != null) {
            this.input.selectionStart = this.selectionStart;
            this.input.selectionEnd = this.selectionEnd;
            this.selectionStart = null;
            this.selectionEnd = null;
        }
    },
    beforeUnmount() {
        if (this.timePickerTimer) {
            clearTimeout(this.timePickerTimer);
        }

        this.destroyResponsiveStyleElement();

        if (this.overlayEventListener) {
            OverlayEventBus.off('overlay-click', this.overlayEventListener);
            this.overlayEventListener = null;
        }

        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindMatchMediaListener();
        this.unbindMatchMediaOrientationListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay && this.autoZIndex) {
            ZIndex.clear(this.overlay);
        }

        this.overlay = null;
    },
    methods: {
        updateClearIconVisibility(visible: boolean) {
            const icon = (this.$refs.clearIcon as { $el?: HTMLElement | SVGElement } | undefined)?.$el;

            if (icon?.style) icon.style.display = visible ? 'block' : 'none';
        },
        valueForSelectionMode(value: ModelInput): DateSelection {
            const parsedValue = Array.isArray(value)
                ? value.map((date) => (typeof date === 'string' ? this.parseValueForComparison(date) : date))
                : typeof value === 'string'
                  ? this.safeParse(value)
                  : (value ?? null);

            if (this.isSingleSelection()) return Array.isArray(parsedValue) ? (parsedValue[0] ?? null) : parsedValue;
            if (parsedValue === null || Array.isArray(parsedValue)) return parsedValue;

            return [parsedValue];
        },
        isSelected(dateMeta: DayCell): boolean {
            const [start, end] = this.selectedDates;

            if (this.isMultipleSelection()) return this.selectedDates.some((date) => this.isDateEquals(date, dateMeta));
            if (this.isDateEquals(start ?? null, dateMeta)) return true;

            return this.isRangeSelection() && !!end && (this.isDateEquals(end, dateMeta) || this.isDateBetween(start ?? null, end, dateMeta));
        },
        isMonthSelected(month: number): boolean {
            const [start, end] = this.selectedDates;

            if (this.isRangeSelection() && start && end) {
                const currentDate = new Date(this.currentYear, month, 1);
                const startDate = new Date(start.getFullYear(), start.getMonth(), 1);
                const endDate = new Date(end.getFullYear(), end.getMonth(), 1);

                return currentDate >= startDate && currentDate <= endDate;
            }

            return this.selectedDates.some((date) => date?.getMonth() === month && date.getFullYear() === this.currentYear);
        },
        isYearSelected(year: number): boolean {
            const [start, end] = this.selectedDates;

            if (this.isRangeSelection() && start && end) return start.getFullYear() <= year && year <= end.getFullYear();

            return this.selectedDates.some((date) => date?.getFullYear() === year);
        },
        isDateEquals(value: DateItem, dateMeta: DayCell) {
            if (value) return value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year;
            else return false;
        },
        isDateBetween(start: DateItem, end: DateItem, dateMeta: DayCell) {
            let between = false;
            let parsedStart = this.parseValueForComparison(start);
            let parsedEnd = this.parseValueForComparison(end);

            if (parsedStart && parsedEnd) {
                let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);

                return parsedStart.getTime() <= date.getTime() && parsedEnd.getTime() >= date.getTime();
            }

            return between;
        },
        getFirstDayOfMonthIndex(month: number, year: number) {
            let day = new Date();

            day.setDate(1);
            day.setMonth(month);
            day.setFullYear(year);

            let dayIndex = day.getDay() + this.sundayIndex;

            return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
        },
        getDaysCountInMonth(month: number, year: number) {
            return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
        },
        getDaysCountInPrevMonth(month: number, year: number) {
            let prev = this.getPreviousMonthAndYear(month, year);

            return this.getDaysCountInMonth(prev.month, prev.year);
        },
        getPreviousMonthAndYear(month: number, year: number) {
            let m, y;

            if (month === 0) {
                m = 11;
                y = year - 1;
            } else {
                m = month - 1;
                y = year;
            }

            return { month: m, year: y };
        },
        getNextMonthAndYear(month: number, year: number) {
            let m, y;

            if (month === 11) {
                m = 0;
                y = year + 1;
            } else {
                m = month + 1;
                y = year;
            }

            return { month: m, year: y };
        },
        daylightSavingAdjust(date: Date) {
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);

            return date;
        },
        isToday(today: Date, day: number, month: number, year: number) {
            return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        },
        isSelectable(day: number, month: number, year: number, otherMonth: boolean) {
            let validMin = true;
            let validMax = true;
            let validDate = true;
            let validDay = true;

            if (otherMonth && !this.selectOtherMonths) {
                return false;
            }

            if (this.minDate) {
                if (this.minDate.getFullYear() > year) {
                    validMin = false;
                } else if (this.minDate.getFullYear() === year) {
                    if (this.minDate.getMonth() > month) {
                        validMin = false;
                    } else if (this.minDate.getMonth() === month) {
                        if (this.minDate.getDate() > day) {
                            validMin = false;
                        }
                    }
                }
            }

            if (this.maxDate) {
                if (this.maxDate.getFullYear() < year) {
                    validMax = false;
                } else if (this.maxDate.getFullYear() === year) {
                    if (this.maxDate.getMonth() < month) {
                        validMax = false;
                    } else if (this.maxDate.getMonth() === month) {
                        if (this.maxDate.getDate() < day) {
                            validMax = false;
                        }
                    }
                }
            }

            if (this.disabledDates) {
                validDate = !this.isDateDisabled(day, month, year);
            }

            if (this.disabledDays) {
                validDay = !this.isDayDisabled(day, month, year);
            }

            return validMin && validMax && validDate && validDay;
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            if (!this.inline) addStyle(el, { position: 'absolute', top: '0' });

            if (this.autoZIndex) {
                ZIndex.set('overlay', el, this.baseZIndex || this.$primevue?.config.zIndex?.overlay);
            }

            // Issue: #7508
            this.$attrSelector && el.setAttribute(this.$attrSelector, '');

            this.alignOverlay();

            // Issue: #571
            this.overlayEventListener = (e) => {
                if (e && typeof e === 'object' && 'target' in e && e.target instanceof Node && this.overlay?.contains(e.target)) {
                    this.selfClick = true;
                }
            };

            OverlayEventBus.on('overlay-click', this.overlayEventListener);
            this.$emit('show');
        },
        onOverlayEnterComplete() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();
        },
        onOverlayAfterLeave(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            if (this.autoZIndex) {
                ZIndex.clear(el);
            }
        },
        onOverlayLeave() {
            this.currentView = this.view;
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            if (this.overlayEventListener) {
                OverlayEventBus.off('overlay-click', this.overlayEventListener);
                this.overlayEventListener = null;
            }
            this.$emit('hide');

            this.overlay = null;
        },
        onPrevButtonClick(event: Event) {
            this.navigationState = { backward: true, button: true };
            this.navBackward(event);
        },
        onNextButtonClick(event: Event) {
            this.navigationState = { backward: false, button: true };
            this.navForward(event);
        },
        navBackward(event: Event) {
            event.preventDefault();

            if (!this.isEnabled()) {
                return;
            }

            if (this.currentView === 'month') {
                this.decrementYear();
                this.$emit('year-change', { month: this.currentMonth, year: this.currentYear });
            } else if (this.currentView === 'year') {
                this.decrementDecade();
            } else {
                if ('shiftKey' in event && event.shiftKey) {
                    this.decrementYear();
                } else {
                    if (this.currentMonth === 0) {
                        this.currentMonth = 11;
                        this.decrementYear();
                    } else {
                        this.currentMonth--;
                    }

                    this.$emit('month-change', { month: this.currentMonth + 1, year: this.currentYear });
                }
            }
        },
        navForward(event: Event) {
            event.preventDefault();

            if (!this.isEnabled()) {
                return;
            }

            if (this.currentView === 'month') {
                this.incrementYear();
                this.$emit('year-change', { month: this.currentMonth, year: this.currentYear });
            } else if (this.currentView === 'year') {
                this.incrementDecade();
            } else {
                if ('shiftKey' in event && event.shiftKey) {
                    this.incrementYear();
                } else {
                    if (this.currentMonth === 11) {
                        this.currentMonth = 0;
                        this.incrementYear();
                    } else {
                        this.currentMonth++;
                    }

                    this.$emit('month-change', { month: this.currentMonth + 1, year: this.currentYear });
                }
            }
        },
        decrementYear() {
            this.currentYear--;
        },
        decrementDecade() {
            this.currentYear = this.currentYear - 10;
        },
        incrementYear() {
            this.currentYear++;
        },
        incrementDecade() {
            this.currentYear = this.currentYear + 10;
        },
        getNavigatorAriaLabel(direction: number) {
            const locale = this.locale;
            const isNext = direction > 0;
            let label, target;

            if (this.currentView === 'year') {
                const decadeStart = this.currentYear - (this.currentYear % 10) + direction * 10;

                label = isNext ? locale.nextDecade : locale.prevDecade;
                target = `${decadeStart} - ${decadeStart + 9}`;
            } else if (this.currentView === 'month') {
                label = isNext ? locale.nextYear : locale.prevYear;
                target = `${this.currentYear + direction}`;
            } else {
                // when multiple months are displayed, the next button reveals the month after the last visible one
                const date = new Date(this.currentYear, this.currentMonth + (isNext ? this.numberOfMonths : -1), 1);
                const monthName = this.monthNames?.[date.getMonth()];
                const year = date.getFullYear();

                label = isNext ? locale.nextMonth : locale.prevMonth;
                target = !monthName ? `${year}` : locale.showMonthAfterYear ? `${year} ${monthName}` : `${monthName} ${year}`;
            }

            return [label, target].filter(Boolean).join(', ');
        },
        switchToMonthView(event: Event) {
            this.currentView = 'month';
            setTimeout(this.updateFocus, 0);
            event.preventDefault();
        },
        switchToYearView(event: Event) {
            this.currentView = 'year';
            setTimeout(this.updateFocus, 0);
            event.preventDefault();
        },
        isEnabled() {
            return !this.disabled && !this.readonly;
        },
        updateCurrentTimeMeta(date: Date) {
            let currentHour = date.getHours();

            if (this.hourFormat === '12') {
                this.pm = currentHour > 11;

                if (currentHour >= 12) currentHour = currentHour == 12 ? 12 : currentHour - 12;
            }

            this.currentHour = Math.floor(currentHour / this.stepHour) * this.stepHour;
            this.currentMinute = Math.floor(date.getMinutes() / this.stepMinute) * this.stepMinute;
            this.currentSecond = Math.floor(date.getSeconds() / this.stepSecond) * this.stepSecond;
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && !this.selfClick && !this.isNestedOverlayVisible() && this.isOutsideClicked(event)) {
                        this.overlayVisible = false;
                    }

                    this.selfClick = false;
                };

                document.addEventListener('mousedown', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('mousedown', this.outsideClickListener);
                this.outsideClickListener = null;
                this.selfClick = false;
            }
        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container as HTMLElement, () => {
                    if (this.overlayVisible) {
                        this.overlayVisible = false;
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible && !isTouchDevice()) {
                        this.overlayVisible = false;
                    }
                };

                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        bindMatchMediaListener() {
            if (!this.matchMediaListener) {
                const query = matchMedia(`(max-width: ${this.breakpoint})`);

                this.query = query;
                this.queryMatches = query.matches;

                this.matchMediaListener = () => {
                    this.queryMatches = query.matches;
                };

                this.query.addEventListener('change', this.matchMediaListener);
            }
        },
        unbindMatchMediaListener() {
            if (this.matchMediaListener) {
                this.query?.removeEventListener('change', this.matchMediaListener);
                this.matchMediaListener = null;
            }
        },
        bindMatchMediaOrientationListener() {
            if (!this.matchMediaOrientationListener) {
                const query = matchMedia(`(orientation: portrait)`);

                this.queryOrientation = query;

                this.matchMediaOrientationListener = () => {
                    this.alignOverlay();
                };

                this.queryOrientation.addEventListener('change', this.matchMediaOrientationListener);
            }
        },
        unbindMatchMediaOrientationListener() {
            if (this.matchMediaOrientationListener) {
                this.queryOrientation?.removeEventListener('change', this.matchMediaOrientationListener);
                this.queryOrientation = null;
                this.matchMediaOrientationListener = null;
            }
        },
        isOutsideClicked(event: MouseEvent) {
            const composedPath = event.composedPath();
            return !(
                this.$el.isSameNode(event.target) ||
                this.isNavIconClicked(event) ||
                composedPath.includes(this.$el) ||
                (this.overlay !== null && composedPath.includes(this.overlay))
            );
        },
        isNestedOverlayVisible() {
            // Issue: #571
            return !!this.overlay?.querySelector('[aria-expanded="true"]');
        },
        isNavIconClicked(event: MouseEvent) {
            const target = event.target;

            return target instanceof Node && (this.previousButton?.contains(target) || this.nextButton?.contains(target));
        },
        alignOverlay() {
            if (this.overlay) {
                if (this.appendTo === 'self' || this.inline) {
                    relativePosition(this.overlay, this.$el);
                } else {
                    if (this.view === 'date') {
                        this.overlay.style.width = getOuterWidth(this.overlay) + 'px';
                        this.overlay.style.minWidth = getOuterWidth(this.$el) + 'px';
                    } else {
                        this.overlay.style.width = getOuterWidth(this.$el) + 'px';
                    }

                    absolutePosition(this.overlay, this.$el);
                }
            }
        },
        onButtonClick() {
            if (this.isEnabled()) {
                if (!this.overlayVisible) {
                    this.input?.focus();
                    this.overlayVisible = true;
                } else {
                    this.overlayVisible = false;
                }
            }
        },
        isDateDisabled(day: number, month: number, year: number) {
            if (this.disabledDates) {
                for (let disabledDate of this.disabledDates) {
                    if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
                        return true;
                    }
                }
            }

            return false;
        },
        isDayDisabled(day: number, month: number, year: number) {
            if (this.disabledDays) {
                let weekday = new Date(year, month, day);
                let weekdayNumber = weekday.getDay();

                return this.disabledDays.indexOf(weekdayNumber) !== -1;
            }

            return false;
        },
        onMonthDropdownChange(value: string | number) {
            this.currentMonth = parseInt(String(value), 10);
            this.$emit('month-change', { month: this.currentMonth + 1, year: this.currentYear });
        },
        onYearDropdownChange(value: string | number) {
            this.currentYear = parseInt(String(value), 10);
            this.$emit('year-change', { month: this.currentMonth, year: this.currentYear });
        },
        onDateSelect(event: Event | null, dateMeta: DayCell) {
            if (this.disabled || !dateMeta.selectable) {
                return;
            }

            find(this.overlay, 'table td span:not([data-p-disabled="true"])').forEach((cell) => (cell.tabIndex = -1));

            if (event?.currentTarget instanceof HTMLElement) event.currentTarget.focus();

            if (this.isMultipleSelection() && this.isSelected(dateMeta)) {
                let newValue = this.selectedDates.filter((date) => !this.isDateEquals(date, dateMeta));

                this.updateModel(newValue);
            } else {
                if (this.shouldSelectDate()) {
                    if (dateMeta.otherMonth) {
                        this.currentMonth = dateMeta.month;
                        this.currentYear = dateMeta.year;
                        this.selectDate(dateMeta);
                    } else {
                        this.selectDate(dateMeta);
                    }
                }
            }

            if (this.isSingleSelection() && (!this.showTime || this.hideOnDateTimeSelect)) {
                if (this.input) {
                    this.input?.focus();
                }

                setTimeout(() => {
                    this.overlayVisible = false;
                }, 150);
            }
        },
        selectDate(dateMeta: DayCell) {
            let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);

            if (this.showTime) {
                this.hourFormat === '12' && this.currentHour !== 12 && this.pm ? date.setHours(this.currentHour + 12) : date.setHours(this.currentHour);

                date.setMinutes(this.currentMinute);
                date.setSeconds(this.showSeconds ? this.currentSecond : 0);
            }

            if (this.minDate && this.minDate > date) {
                date = this.minDate;
                this.currentHour = date.getHours();
                this.currentMinute = date.getMinutes();
                this.currentSecond = date.getSeconds();
            }

            if (this.maxDate && this.maxDate < date) {
                date = this.maxDate;
                this.currentHour = date.getHours();
                this.currentMinute = date.getMinutes();
                this.currentSecond = date.getSeconds();
            }

            let modelValue: DateSelection = null;

            if (this.isSingleSelection()) {
                modelValue = date;
            } else if (this.isMultipleSelection()) {
                modelValue = [...this.selectedDates, date];
            } else if (this.isRangeSelection()) {
                let [startDate, endDate] = this.selectedDates;

                if (startDate) {
                    if (!endDate && date.getTime() >= startDate.getTime()) {
                        endDate = date;
                        this.focusedDateIndex = 1;
                    } else {
                        startDate = date;
                        endDate = null;
                        this.focusedDateIndex = 0;
                    }
                    modelValue = [startDate, endDate];
                } else {
                    modelValue = [date, null];
                    this.focusedDateIndex = 0;
                }
            }

            if (modelValue !== null) {
                this.updateModel(modelValue);
            }

            if (this.isRangeSelection() && this.hideOnRangeSelection && Array.isArray(modelValue) && modelValue[1] !== null) {
                setTimeout(() => {
                    this.overlayVisible = false;
                }, 150);
            }

            this.$emit('date-select', date);
        },
        updateModel(value: DateSelection, draft: string | null = null) {
            this.inputDraft = draft;
            this.rawValue = value;

            if (this.updateModelType === 'date') {
                this.writeValue(value);
            } else if (this.updateModelType === 'string') {
                this.writeValue(Array.isArray(value) ? value.map((date) => this.formatDateTime(date)) : this.formatDateTime(value));
            }
        },
        shouldSelectDate() {
            return !this.isMultipleSelection() || this.maxDateCount == null || this.maxDateCount > this.selectedDates.length;
        },
        isSingleSelection() {
            return this.selectionMode === 'single';
        },
        isRangeSelection() {
            return this.selectionMode === 'range';
        },
        isMultipleSelection() {
            return this.selectionMode === 'multiple';
        },
        formatValue(value: ModelInput): string {
            if (typeof value === 'string') {
                const date = new Date(value);

                return this.dateFormat && !isNaN(date.getTime()) ? this.formatDate(date, this.dateFormat) : value;
            }

            try {
                if (!Array.isArray(value)) return this.formatDateTime(value ?? null) ?? '';

                if (this.isRangeSelection()) {
                    const start = this.formatDateTime(this.parseValueForComparison(value[0])) ?? '';
                    const end = this.formatDateTime(this.parseValueForComparison(value[1]));

                    return end ? start + ' - ' + end : start;
                }

                return value.map((date) => this.formatDateTime(this.parseValueForComparison(date))).join(', ');
            } catch {
                return value == null ? '' : String(value);
            }
        },
        formatDateTime(date: DateItem | string): string | null {
            let formattedValue: string | null = null;

            if (isDate(date) && isNotEmpty(date)) {
                if (this.timeOnly) {
                    formattedValue = this.formatTime(date);
                } else {
                    formattedValue = this.formatDate(date, this.datePattern);

                    if (this.showTime) {
                        formattedValue += ' ' + this.formatTime(date);
                    }
                }
            } else if (this.updateModelType === 'string' && typeof date === 'string') {
                formattedValue = date;
            }

            return formattedValue;
        },
        formatDate(date: DateItem, format: string) {
            if (!date) {
                return '';
            }

            let iFormat = 0;

            const lookAhead = (match: string) => {
                    const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;

                    if (matches) {
                        iFormat++;
                    }

                    return matches;
                },
                formatNumber = (match: string, value: number, len: number) => {
                    let num = '' + value;

                    if (lookAhead(match)) {
                        while (num.length < len) {
                            num = '0' + num;
                        }
                    }

                    return num;
                },
                formatName = (match: string, value: number, shortNames: string[], longNames: string[]) => {
                    return lookAhead(match) ? longNames[value] : shortNames[value];
                };

            let output = '';
            let literal = false;

            if (date) {
                for (iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal) {
                        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                            literal = false;
                        } else {
                            output += format.charAt(iFormat);
                        }
                    } else {
                        switch (format.charAt(iFormat)) {
                            case 'd':
                                output += formatNumber('d', date.getDate(), 2);
                                break;
                            case 'D':
                                output += formatName('D', date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
                                break;
                            case 'o':
                                output += formatNumber(
                                    'o',
                                    Math.round(
                                        (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
                                            new Date(date.getFullYear(), 0, 0).getTime()) /
                                            86400000
                                    ),
                                    3
                                );
                                break;
                            case 'm':
                                output += formatNumber('m', date.getMonth() + 1, 2);
                                break;
                            case 'M':
                                output += formatName('M', date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
                                break;
                            case 'y':
                                output += lookAhead('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100);
                                break;
                            case '@':
                                output += date.getTime();
                                break;
                            case '!':
                                output += date.getTime() * 10000 + this.ticksTo1970;
                                break;
                            case "'":
                                if (lookAhead("'")) {
                                    output += "'";
                                } else {
                                    literal = true;
                                }

                                break;
                            default:
                                output += format.charAt(iFormat);
                        }
                    }
                }
            }

            return output;
        },
        formatTime(date: DateItem) {
            if (!date) {
                return '';
            }

            let output = '';
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            if (this.hourFormat === '12' && hours > 11 && hours !== 12) {
                hours -= 12;
            }

            if (this.hourFormat === '12') {
                output += hours === 0 ? 12 : hours < 10 ? '0' + hours : hours;
            } else {
                output += hours < 10 ? '0' + hours : hours;
            }

            output += ':';
            output += minutes < 10 ? '0' + minutes : minutes;

            if (this.showSeconds) {
                output += ':';
                output += seconds < 10 ? '0' + seconds : seconds;
            }

            if (this.hourFormat === '12') {
                output += date.getHours() > 11 ? ` ${this.locale.pm}` : ` ${this.locale.am}`;
            }

            return output;
        },
        onTodayButtonClick(event: Event) {
            let date = new Date();
            let dateMeta = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                otherMonth: date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear,
                today: true,
                selectable: true
            };

            this.onDateSelect(null, dateMeta);
            this.$emit('today-click', date);
            event.preventDefault();
        },
        onClearButtonClick(event: Event) {
            this.updateModel(null);
            this.overlayVisible = false;
            this.$emit('clear-click', event);
            event.preventDefault();
        },
        onTimePickerElementMouseDown(event: MouseEvent, type: number, direction: number) {
            if (this.isEnabled()) {
                this.repeat(event, null, type, direction);
                event.preventDefault();
            }
        },
        onTimePickerElementMouseUp(event: MouseEvent) {
            if (this.isEnabled()) {
                this.clearTimePickerTimer();
                this.updateModelTime();
                event.preventDefault();
            }
        },
        onTimePickerElementMouseLeave() {
            this.clearTimePickerTimer();
        },
        onTimePickerElementKeyDown(event: KeyboardEvent, type: number, direction: number) {
            switch (event.code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    if (this.isEnabled()) {
                        this.repeat(event, null, type, direction);
                        event.preventDefault();
                    }
                    break;
            }
        },
        onTimePickerElementKeyUp(event: KeyboardEvent) {
            switch (event.code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    if (this.isEnabled()) {
                        this.clearTimePickerTimer();
                        this.updateModelTime();
                        event.preventDefault();
                    }
                    break;
            }
        },
        repeat(event: Event, interval: number | null, type: number, direction: number) {
            let i = interval || 500;

            this.clearTimePickerTimer();
            this.timePickerTimer = setTimeout(() => {
                this.repeat(event, 100, type, direction);
            }, i);

            switch (type) {
                case 0:
                    if (direction === 1) this.incrementHour(event);
                    else this.decrementHour(event);
                    break;

                case 1:
                    if (direction === 1) this.incrementMinute(event);
                    else this.decrementMinute(event);
                    break;

                case 2:
                    if (direction === 1) this.incrementSecond(event);
                    else this.decrementSecond(event);
                    break;
            }
        },
        convertTo24Hour(hours: number, pm: boolean | null) {
            if (this.hourFormat == '12') {
                if (hours === 12) {
                    return pm ? 12 : 0;
                } else {
                    return pm ? hours + 12 : hours;
                }
            }

            return hours;
        },
        validateTime(hour: number, minute: number, second: number, pm: boolean | null) {
            let value = this.viewDate;
            const convertedHour = this.convertTo24Hour(hour, pm);

            if (this.isRangeSelection()) {
                value = this.selectedDates[1] ?? this.selectedDates[0] ?? value;
            }

            if (this.isMultipleSelection()) {
                value = this.selectedDates.at(-1) ?? value;
            }

            const valueDateString = value ? value.toDateString() : null;

            if (this.minDate && valueDateString && this.minDate.toDateString() === valueDateString) {
                if (this.minDate.getHours() > convertedHour) {
                    return false;
                }

                if (this.minDate.getHours() === convertedHour) {
                    if (this.minDate.getMinutes() > minute) {
                        return false;
                    }

                    if (this.minDate.getMinutes() === minute) {
                        if (this.minDate.getSeconds() > second) {
                            return false;
                        }
                    }
                }
            }

            if (this.maxDate && valueDateString && this.maxDate.toDateString() === valueDateString) {
                if (this.maxDate.getHours() < convertedHour) {
                    return false;
                }

                if (this.maxDate.getHours() === convertedHour) {
                    if (this.maxDate.getMinutes() < minute) {
                        return false;
                    }

                    if (this.maxDate.getMinutes() === minute) {
                        if (this.maxDate.getSeconds() < second) {
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        incrementHour(event: Event) {
            let prevHour = this.currentHour;
            let newHour = this.currentHour + Number(this.stepHour);
            let newPM = this.pm;

            if (this.hourFormat == '24') newHour = newHour >= 24 ? newHour - 24 : newHour;
            else if (this.hourFormat == '12') {
                // Before the AM/PM break, now after
                if (prevHour < 12 && newHour > 11) {
                    newPM = !this.pm;
                }

                newHour = newHour >= 13 ? newHour - 12 : newHour;
            }

            if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
                this.currentHour = newHour;
                this.pm = newPM;
            }

            event.preventDefault();
        },
        decrementHour(event: Event) {
            let newHour = this.currentHour - this.stepHour;
            let newPM = this.pm;

            if (this.hourFormat == '24') newHour = newHour < 0 ? 24 + newHour : newHour;
            else if (this.hourFormat == '12') {
                // If we were at noon/midnight, then switch
                if (this.currentHour === 12) {
                    newPM = !this.pm;
                }

                newHour = newHour <= 0 ? 12 + newHour : newHour;
            }

            if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
                this.currentHour = newHour;
                this.pm = newPM;
            }

            event.preventDefault();
        },
        incrementMinute(event: Event) {
            const newMinute = (this.currentMinute + Number(this.stepMinute)) % 60;

            if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
                this.currentMinute = newMinute;
            }

            event.preventDefault();
        },
        decrementMinute(event: Event) {
            let newMinute = this.currentMinute - this.stepMinute;

            newMinute = newMinute < 0 ? 60 + newMinute : newMinute;

            if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
                this.currentMinute = newMinute;
            }

            event.preventDefault();
        },
        incrementSecond(event: Event) {
            const newSecond = (this.currentSecond + Number(this.stepSecond)) % 60;

            if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
                this.currentSecond = newSecond;
            }

            event.preventDefault();
        },
        decrementSecond(event: Event) {
            let newSecond = this.currentSecond - this.stepSecond;

            newSecond = newSecond < 0 ? 60 + newSecond : newSecond;

            if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
                this.currentSecond = newSecond;
            }

            event.preventDefault();
        },
        updateModelTime() {
            this.timePickerChange = true;
            const dates = this.selectedDates;
            let current = this.viewDate;

            if (this.isRangeSelection()) current = dates[this.focusedDateIndex] ?? dates[0] ?? current;
            else if (this.isMultipleSelection()) current = dates.at(-1) ?? current;

            const date = new Date(current.getTime());
            date.setHours(this.convertTo24Hour(this.currentHour, this.pm), this.currentMinute, this.currentSecond);

            let value: DateSelection = date;

            if (this.isRangeSelection()) {
                value = this.focusedDateIndex === 1 && dates[1] ? [dates[0] ?? null, date] : [date, dates[1] ?? null];
            } else if (this.isMultipleSelection()) {
                value = [...dates.slice(0, -1), date];
            }

            this.updateModel(value);
            this.$emit('date-select', value);
            setTimeout(() => (this.timePickerChange = false), 0);
        },
        toggleAMPM(event: Event) {
            const validHour = this.validateTime(this.currentHour, this.currentMinute, this.currentSecond, !this.pm);

            if (!validHour && (this.maxDate || this.minDate)) return;

            this.pm = !this.pm;
            this.updateModelTime();
            event.preventDefault();
        },
        clearTimePickerTimer() {
            if (this.timePickerTimer) {
                clearInterval(this.timePickerTimer);
            }
        },
        onMonthSelect(event: Event, { month, index }: MonthChoice) {
            if (!month.selectable) return;

            if (this.view === 'month') {
                this.onDateSelect(event, { year: this.currentYear, month: index, day: 1, selectable: true });
            } else {
                this.currentMonth = index;
                this.currentView = 'date';
                this.$emit('month-change', { month: this.currentMonth + 1, year: this.currentYear });
            }

            setTimeout(this.updateFocus, 0);
        },
        onYearSelect(event: Event, year: DatePickerYearOptions) {
            if (!year.selectable) return;

            if (this.view === 'year') {
                this.onDateSelect(event, { year: year.value, month: 0, day: 1, selectable: true });
            } else {
                this.currentYear = year.value;
                this.currentView = 'month';
                this.$emit('year-change', { month: this.currentMonth, year: this.currentYear });
            }

            setTimeout(this.updateFocus, 0);
        },
        updateCurrentMetaData() {
            const viewDate = this.viewDate;

            this.currentMonth = viewDate.getMonth();
            this.currentYear = viewDate.getFullYear();

            if (this.showTime || this.timeOnly) {
                const timeDate = this.isRangeSelection() ? (this.selectedDates[this.focusedDateIndex] ?? viewDate) : viewDate;

                this.updateCurrentTimeMeta(timeDate);
            }
        },
        isValidSelection(value: DateSelection) {
            if (value == null) return true;

            const canSelect = (date: unknown): date is Date => isDate(date) && this.isSelectable(date.getDate(), date.getMonth(), date.getFullYear(), false);

            if (this.isSingleSelection()) return canSelect(value);
            if (!Array.isArray(value)) return false;
            if (!this.isRangeSelection()) return value.every(canSelect);

            const [start, end] = value;

            return value.length <= 2 && canSelect(start) && (end == null || (end >= start && canSelect(end)));
        },
        parseValue(text: string): DateSelection {
            if (!text || text.trim().length === 0) {
                return null;
            }

            let value: DateSelection = null;

            if (this.isSingleSelection()) {
                value = this.parseDateTime(text);
            } else if (this.isMultipleSelection()) {
                let tokens = text.split(',');

                value = [];

                for (let token of tokens) {
                    value.push(this.parseDateTime(token.trim()));
                }
            } else if (this.isRangeSelection()) {
                let tokens = text.split(' - ');

                value = [];

                for (let i = 0; i < tokens.length; i++) {
                    value[i] = this.parseDateTime(tokens[i].trim());
                }

                if (value.length === 1) value.push(null);
            }

            return value;
        },
        safeParse(value: string): DateSelection {
            try {
                return this.parseValue(value);
            } catch {
                const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);

                return !isNaN(date.getTime()) ? (this.isSingleSelection() ? date : [date]) : null;
            }
        },
        parseValueForComparison(value: DateItem | string | undefined): DateItem {
            if (typeof value === 'string') {
                const parsedValue = this.safeParse(value);

                return Array.isArray(parsedValue) ? (parsedValue[0] ?? null) : parsedValue;
            }

            return value ?? null;
        },
        parseDateTime(text: string): Date | null {
            let date;
            const amLabel = this.locale.am;
            const pmLabel = this.locale.pm;
            const ampmPattern = `${amLabel}|${pmLabel}|am|pm`;
            let parts = text.match(new RegExp(`(?:(.+?) )?(\\d{2}:\\d{2}(?::\\d{2})?)(?:\\s+(${ampmPattern}))?`, 'i'));

            if (this.timeOnly) {
                if (!parts) throw new Error('Invalid time');

                date = new Date();
                this.populateTime(date, parts[2], parts[3]);
            } else {
                const dateFormat = this.datePattern;

                if (this.showTime) {
                    if (!parts) throw new Error('Invalid date and time');

                    date = this.parseDate(parts[1], dateFormat);
                    if (date) this.populateTime(date, parts[2], parts[3]);
                } else {
                    date = this.parseDate(text, dateFormat);
                }
            }

            return date;
        },
        populateTime(value: Date, timeString: string, ampm?: string) {
            if (this.hourFormat == '12') {
                if (!ampm) {
                    throw 'Invalid Time';
                }

                this.pm = ampm.toLowerCase() === this.locale.pm.toLowerCase() || ampm.toLowerCase() === 'pm';
            }

            let time = this.parseTime(timeString);

            value.setHours(time.hour);
            value.setMinutes(time.minute);
            value.setSeconds(time.second);
        },
        parseTime(value: string) {
            let tokens = value.split(':');
            let validTokenLength = this.showSeconds ? 3 : 2;
            let regex = /^[0-9][0-9]$/;

            if (tokens.length !== validTokenLength || !tokens[0].match(regex) || !tokens[1].match(regex) || (this.showSeconds && !tokens[2].match(regex))) {
                throw 'Invalid time';
            }

            let h = parseInt(tokens[0]);
            let m = parseInt(tokens[1]);
            const s = this.showSeconds ? parseInt(tokens[2], 10) : 0;

            if (isNaN(h) || isNaN(m) || h > 23 || m > 59 || (this.hourFormat == '12' && h > 12) || (this.showSeconds && (isNaN(s) || s > 59))) {
                throw 'Invalid time';
            } else {
                if (this.hourFormat == '12' && h !== 12 && this.pm) {
                    h += 12;
                } else if (this.hourFormat == '12' && h == 12 && !this.pm) {
                    h = 0;
                }

                return { hour: h, minute: m, second: s };
            }
        },
        parseDate(value: string, format: string): Date | null {
            if (format == null || value == null) {
                throw 'Invalid arguments';
            }

            value = String(value);

            if (value === '') {
                return null;
            }

            let iFormat = 0,
                dim,
                extra,
                iValue = 0,
                shortYearCutoff =
                    typeof this.shortYearCutoff !== 'string' ? this.shortYearCutoff : (new Date().getFullYear() % 100) + parseInt(this.shortYearCutoff, 10),
                year = -1,
                month = -1,
                day = -1,
                doy = -1,
                literal = false,
                date,
                lookAhead = (match: string) => {
                    let matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;

                    if (matches) {
                        iFormat++;
                    }

                    return matches;
                },
                getNumber = (match: string) => {
                    let isDoubled = lookAhead(match),
                        size = match === '@' ? 14 : match === '!' ? 20 : match === 'y' && isDoubled ? 4 : match === 'o' ? 3 : 2,
                        minSize = match === 'y' ? size : 1,
                        digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
                        num = value.substring(iValue).match(digits);

                    if (!num) {
                        throw 'Missing number at position ' + iValue;
                    }

                    iValue += num[0].length;

                    return parseInt(num[0], 10);
                },
                getName = (match: string, shortNames: string[], longNames: string[]) => {
                    let index = -1;
                    let arr = lookAhead(match) ? longNames : shortNames;
                    const names: [number, string][] = [];

                    for (let i = 0; i < arr.length; i++) {
                        names.push([i, arr[i]]);
                    }

                    names.sort((a, b) => {
                        return -(a[1].length - b[1].length);
                    });

                    for (let i = 0; i < names.length; i++) {
                        let name = names[i][1];

                        if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                            index = names[i][0];
                            iValue += name.length;
                            break;
                        }
                    }

                    if (index !== -1) {
                        return index + 1;
                    } else {
                        throw 'Unknown name at position ' + iValue;
                    }
                },
                checkLiteral = () => {
                    if (value.charAt(iValue) !== format.charAt(iFormat)) {
                        throw 'Unexpected literal at position ' + iValue;
                    }

                    iValue++;
                };

            if (this.currentView === 'month') {
                day = 1;
            }

            if (this.currentView === 'year') {
                day = 1;
                month = 1;
            }

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        checkLiteral();
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            day = getNumber('d');
                            break;
                        case 'D':
                            getName('D', this.locale.dayNamesShort, this.locale.dayNames);
                            break;
                        case 'o':
                            doy = getNumber('o');
                            break;
                        case 'm':
                            month = getNumber('m');
                            break;
                        case 'M':
                            month = getName('M', this.locale.monthNamesShort, this.locale.monthNames);
                            break;
                        case 'y':
                            year = getNumber('y');
                            break;
                        case '@':
                            date = new Date(getNumber('@'));
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case '!':
                            date = new Date((getNumber('!') - this.ticksTo1970) / 10000);
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                checkLiteral();
                            } else {
                                literal = true;
                            }

                            break;
                        default:
                            checkLiteral();
                    }
                }
            }

            if (iValue < value.length) {
                extra = value.substr(iValue);

                if (!/^\s+/.test(extra)) {
                    throw 'Extra/unparsed characters found in date: ' + extra;
                }
            }

            if (year === -1) {
                year = new Date().getFullYear();
            } else if (year < 100) {
                year += new Date().getFullYear() - (new Date().getFullYear() % 100) + (year <= shortYearCutoff ? 0 : -100);
            }

            if (doy > -1) {
                month = 1;
                day = doy;

                do {
                    dim = this.getDaysCountInMonth(month - 1, year);

                    if (day <= dim) {
                        break;
                    }

                    month++;
                    day -= dim;
                    // eslint-disable-next-line
                } while (true);
            }

            date = this.daylightSavingAdjust(new Date(year, month - 1, day));

            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw 'Invalid date'; // E.g. 31/02/00
            }

            return date;
        },
        getWeekNumber(date: Date) {
            let checkDate = new Date(date.getTime());

            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
            let time = checkDate.getTime();

            checkDate.setMonth(0);
            checkDate.setDate(1);

            return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
        },
        onDateCellKeydown(event: KeyboardEvent, date: DayCell, groupIndex: number) {
            event.preventDefault();
            const cellContent = event.currentTarget;

            if (!(cellContent instanceof HTMLElement)) return;

            const cell = cellContent.parentElement;
            const row = cell?.parentElement;
            const rowGroup = row?.parentElement;

            if (!cell || !row || !rowGroup) return;

            const cellIndex = getIndex(cell);

            switch (event.code) {
                case 'ArrowDown': {
                    cellContent.tabIndex = -1;

                    let nextRow = row.nextElementSibling;

                    if (nextRow) {
                        let tableRowIndex = getIndex(row);
                        const tableRows = Array.from(rowGroup.children);
                        const nextTableRows = tableRows.slice(tableRowIndex + 1);

                        let hasNextFocusableDate = nextTableRows.find((el) => {
                            const focusCell = el.children[cellIndex]?.firstElementChild;

                            return focusCell !== null && focusCell !== undefined && !getAttribute(focusCell, 'data-p-disabled');
                        });

                        const focusCell = hasNextFocusableDate?.children[cellIndex]?.firstElementChild;

                        if (focusCell instanceof HTMLElement) {
                            focusCell.tabIndex = 0;
                            focusCell.focus();
                        } else {
                            this.navigationState = { backward: false };
                            this.navForward(event);
                        }
                    } else {
                        this.navigationState = { backward: false };
                        this.navForward(event);
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowUp': {
                    cellContent.tabIndex = -1;

                    if (event.altKey) {
                        this.overlayVisible = false;
                        this.focused = true;
                    } else {
                        let prevRow = row.previousElementSibling;

                        if (prevRow) {
                            let tableRowIndex = getIndex(row);
                            const tableRows = Array.from(rowGroup.children);
                            const prevTableRows = tableRows.slice(0, tableRowIndex).reverse();

                            let hasNextFocusableDate = prevTableRows.find((el) => {
                                const focusCell = el.children[cellIndex]?.firstElementChild;

                                return focusCell !== null && focusCell !== undefined && !getAttribute(focusCell, 'data-p-disabled');
                            });

                            const focusCell = hasNextFocusableDate?.children[cellIndex]?.firstElementChild;

                            if (focusCell instanceof HTMLElement) {
                                focusCell.tabIndex = 0;
                                focusCell.focus();
                            } else {
                                this.navigationState = { backward: true };
                                this.navBackward(event);
                            }
                        } else {
                            this.navigationState = { backward: true };
                            this.navBackward(event);
                        }
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft': {
                    cellContent.tabIndex = -1;
                    let prevCell = cell.previousElementSibling;

                    if (prevCell) {
                        const cells = Array.from(row.children);
                        const prevCells = cells.slice(0, cellIndex).reverse();

                        let hasNextFocusableDate = prevCells.find((el) => {
                            const focusCell = el.firstElementChild;

                            return focusCell !== null && focusCell !== undefined && !getAttribute(focusCell, 'data-p-disabled');
                        });

                        const focusCell = hasNextFocusableDate?.firstElementChild;

                        if (focusCell instanceof HTMLElement) {
                            focusCell.tabIndex = 0;
                            focusCell.focus();
                        } else {
                            this.navigateToMonth(event, true, groupIndex);
                        }
                    } else {
                        this.navigateToMonth(event, true, groupIndex);
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowRight': {
                    cellContent.tabIndex = -1;
                    let nextCell = cell.nextElementSibling;

                    if (nextCell) {
                        const cells = Array.from(row.children);
                        const nextCells = cells.slice(cellIndex + 1);
                        let hasNextFocusableDate = nextCells.find((el) => {
                            const focusCell = el.firstElementChild;

                            return focusCell !== null && focusCell !== undefined && !getAttribute(focusCell, 'data-p-disabled');
                        });

                        const focusCell = hasNextFocusableDate?.firstElementChild;

                        if (focusCell instanceof HTMLElement) {
                            focusCell.tabIndex = 0;
                            focusCell.focus();
                        } else {
                            this.navigateToMonth(event, false, groupIndex);
                        }
                    } else {
                        this.navigateToMonth(event, false, groupIndex);
                    }

                    event.preventDefault();
                    break;
                }

                case 'Enter':
                case 'NumpadEnter':

                case 'Space': {
                    this.onDateSelect(event, date);
                    event.preventDefault();
                    break;
                }

                case 'Escape': {
                    this.overlayVisible = false;
                    event.preventDefault();
                    break;
                }

                case 'Tab': {
                    if (!this.inline) {
                        this.trapFocus(event);
                    }

                    break;
                }

                case 'Home': {
                    cellContent.tabIndex = -1;
                    let currentRow = row;
                    let focusCell = currentRow.children[0].children[0];

                    if (!(focusCell instanceof HTMLElement) || getAttribute(focusCell, 'data-p-disabled')) {
                        this.navigateToMonth(event, true, groupIndex);
                    } else {
                        focusCell.tabIndex = 0;
                        focusCell.focus();
                    }

                    event.preventDefault();
                    break;
                }

                case 'End': {
                    cellContent.tabIndex = -1;
                    let currentRow = row;
                    let focusCell = currentRow.children[currentRow.children.length - 1].children[0];

                    if (!(focusCell instanceof HTMLElement) || getAttribute(focusCell, 'data-p-disabled')) {
                        this.navigateToMonth(event, false, groupIndex);
                    } else {
                        focusCell.tabIndex = 0;
                        focusCell.focus();
                    }

                    event.preventDefault();
                    break;
                }

                case 'PageUp': {
                    cellContent.tabIndex = -1;
                    if (event.shiftKey) {
                        this.navigationState = { backward: true };
                        this.navBackward(event);
                    } else this.navigateToMonth(event, true, groupIndex);

                    event.preventDefault();
                    break;
                }

                case 'PageDown': {
                    cellContent.tabIndex = -1;
                    if (event.shiftKey) {
                        this.navigationState = { backward: false };
                        this.navForward(event);
                    } else this.navigateToMonth(event, false, groupIndex);

                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        },
        navigateToMonth(event: KeyboardEvent, prev: boolean, groupIndex: number) {
            if (prev) {
                if (this.numberOfMonths === 1 || groupIndex === 0) {
                    this.navigationState = { backward: true };
                    this.navBackward(event);
                } else {
                    let prevMonthContainer = this.overlay?.children[groupIndex - 1];
                    let cells = find(prevMonthContainer, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
                    let focusCell = cells[cells.length - 1];

                    if (focusCell) {
                        focusCell.tabIndex = 0;
                        focusCell.focus();
                    }
                }
            } else {
                if (this.numberOfMonths === 1 || groupIndex === this.numberOfMonths - 1) {
                    this.navigationState = { backward: false };
                    this.navForward(event);
                } else {
                    let nextMonthContainer = this.overlay?.children[groupIndex + 1];
                    let focusCell = findSingle(nextMonthContainer, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');

                    if (focusCell) {
                        focusCell.tabIndex = 0;
                        focusCell.focus();
                    }
                }
            }
        },
        onMonthCellKeydown(event: KeyboardEvent, option: MonthChoice) {
            this.onPeriodCellKeydown(event, 3, () => this.onMonthSelect(event, option));
        },
        onYearCellKeydown(event: KeyboardEvent, option: DatePickerYearOptions) {
            this.onPeriodCellKeydown(event, 2, () => this.onYearSelect(event, option));
        },
        onPeriodCellKeydown(event: KeyboardEvent, columns: number, select: () => void) {
            switch (event.code) {
                case 'ArrowLeft':
                    this.movePeriodFocus(event, -1);
                    break;
                case 'ArrowRight':
                    this.movePeriodFocus(event, 1);
                    break;
                case 'ArrowUp':
                    this.movePeriodFocus(event, -columns);
                    break;
                case 'ArrowDown':
                    this.movePeriodFocus(event, columns);
                    break;
                case 'PageUp':
                case 'PageDown':
                    if (!event.shiftKey) this.navigatePeriod(event, event.code === 'PageUp' ? -1 : 1);
                    break;
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    select();
                    event.preventDefault();
                    break;
                case 'Escape':
                    this.overlayVisible = false;
                    event.preventDefault();
                    break;
                case 'Tab':
                    if (!this.inline) this.trapFocus(event);
                    break;
            }
        },
        movePeriodFocus(event: KeyboardEvent, step: number) {
            const cell = event.currentTarget;

            if (!(cell instanceof HTMLElement) || !cell.parentElement) return;

            const cells = cell.parentElement.children;

            for (let index = getIndex(cell) + step; index >= 0 && index < cells.length; index += step) {
                const candidate = cells[index];

                if (candidate instanceof HTMLElement && candidate.getAttribute('data-p-disabled') !== 'true') {
                    cell.tabIndex = -1;
                    candidate.tabIndex = 0;
                    candidate.focus();
                    event.preventDefault();
                    return;
                }
            }

            if (step === 1 || step === -1) this.navigatePeriod(event, step);
            else event.preventDefault();
        },
        navigatePeriod(event: KeyboardEvent, direction: -1 | 1) {
            const decade = this.currentView === 'year';
            const first = decade ? this.currentYear - (this.currentYear % 10) + 10 * direction : this.currentYear + direction;
            const last = decade ? first + 9 : first;

            event.preventDefault();
            if ((this.minDate && last < this.minDate.getFullYear()) || (this.maxDate && first > this.maxDate.getFullYear())) return;

            const cell = event.currentTarget;

            if (cell instanceof HTMLElement) cell.tabIndex = -1;
            this.navigationState = { backward: direction < 0 };

            if (direction < 0) this.navBackward(event);
            else this.navForward(event);
        },
        updateFocus() {
            let cell;

            if (this.navigationState) {
                if (this.navigationState.button) {
                    this.initFocusableCell();

                    if (this.navigationState.backward) {
                        this.previousButton && this.previousButton.focus();
                    } else {
                        this.nextButton && this.nextButton.focus();
                    }
                } else {
                    if (this.navigationState.backward) {
                        let cells;

                        if (this.currentView === 'month') {
                            cells = find(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]:not([data-p-disabled="true"])');
                        } else if (this.currentView === 'year') {
                            cells = find(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]:not([data-p-disabled="true"])');
                        } else {
                            cells = find(this.overlay, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
                        }

                        if (cells && cells.length > 0) {
                            cell = cells[cells.length - 1];
                        }
                    } else {
                        if (this.currentView === 'month') {
                            cell = findSingle(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]:not([data-p-disabled="true"])');
                        } else if (this.currentView === 'year') {
                            cell = findSingle(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]:not([data-p-disabled="true"])');
                        } else {
                            cell = findSingle(this.overlay, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
                        }
                    }

                    if (cell) {
                        cell.tabIndex = 0;
                        cell.focus();
                    }
                }

                this.navigationState = null;
            } else {
                this.initFocusableCell();
            }
        },
        initFocusableCell() {
            let cell;

            if (this.currentView === 'month') {
                let cells = find(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]');
                let selectedCell = findSingle(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"][data-p-selected="true"]');

                cells.forEach((cell) => (cell.tabIndex = -1));
                cell =
                    selectedCell?.getAttribute('data-p-disabled') === 'false'
                        ? selectedCell
                        : cells.find((candidate) => candidate.getAttribute('data-p-disabled') !== 'true');
            } else if (this.currentView === 'year') {
                let cells = find(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]');
                let selectedCell = findSingle(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"][data-p-selected="true"]');

                cells.forEach((cell) => (cell.tabIndex = -1));
                cell =
                    selectedCell?.getAttribute('data-p-disabled') === 'false'
                        ? selectedCell
                        : cells.find((candidate) => candidate.getAttribute('data-p-disabled') !== 'true');
            } else {
                cell = findSingle(this.overlay, 'span[data-p-selected="true"]');

                if (!cell) {
                    let todayCell = findSingle(this.overlay, 'td[data-p-today="true"] span:not([data-p-disabled="true"]):not([data-p-ink="true"])');

                    if (todayCell) cell = todayCell;
                    else cell = findSingle(this.overlay, '.rs-datepicker-calendar td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
                }
            }

            if (cell) {
                cell.tabIndex = 0;

                if (!this.preventFocus && this.overlay && !this.overlay.contains(document.activeElement)) {
                    cell.focus();
                }

                this.preventFocus = false;
            }
        },
        trapFocus(event: KeyboardEvent) {
            if (!this.overlay) return;

            event.preventDefault();
            const focusableElements = getFocusableElements(this.overlay).filter((element): element is HTMLElement => element instanceof HTMLElement);

            if (focusableElements && focusableElements.length > 0) {
                if (!(document.activeElement instanceof HTMLElement)) {
                    focusableElements[0].focus();
                } else {
                    let focusedIndex = focusableElements.indexOf(document.activeElement);

                    if (event.shiftKey) {
                        if (focusedIndex === -1 || focusedIndex === 0) focusableElements[focusableElements.length - 1].focus();
                        else focusableElements[focusedIndex - 1].focus();
                    } else {
                        if (focusedIndex === -1) {
                            if (this.timeOnly) {
                                focusableElements[0].focus();
                            } else {
                                let elementIndex = focusableElements.findIndex((el) => el.tagName === 'SPAN');

                                if (elementIndex === -1) {
                                    elementIndex = focusableElements.findIndex((el) => el.tagName === 'BUTTON');
                                }

                                if (elementIndex !== -1) {
                                    focusableElements[elementIndex].focus();
                                } else {
                                    focusableElements[0].focus();
                                }
                            }
                        } else if (focusedIndex === focusableElements.length - 1) {
                            focusableElements[0].focus();
                        } else {
                            focusableElements[focusedIndex + 1].focus();
                        }
                    }
                }
            }
        },
        onContainerButtonKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Tab':
                    this.trapFocus(event);
                    break;

                case 'Escape':
                    this.overlayVisible = false;
                    event.preventDefault();
                    break;

                default:
                    //Noop
                    break;
            }

            this.$emit('keydown', event);
        },
        onInput(event: Event) {
            if (!(event.target instanceof HTMLInputElement)) return;

            const draft = event.target.value;
            this.inputDraft = draft;
            try {
                this.selectionStart = this.input?.selectionStart ?? null;
                this.selectionEnd = this.input?.selectionEnd ?? null;

                this.updateClearIconVisibility(!isEmpty(draft));

                const value = this.parseValue(draft);

                if (this.isValidSelection(value)) {
                    this.typeUpdate = true;
                    this.updateModel(value, draft);
                    this.updateCurrentMetaData();
                    this.$nextTick(() => (this.typeUpdate = false));
                }
            } catch (err) {
                /* NoOp */
            }

            this.$emit('input', event);
        },
        onInputClick() {
            if (this.showOnFocus && this.isEnabled() && !this.overlayVisible) {
                this.overlayVisible = true;
            }
        },
        onFocus(event: FocusEvent) {
            if (this.showOnFocus && this.isEnabled()) {
                this.overlayVisible = true;
            }

            this.focused = true;
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            if (!(event.target instanceof HTMLInputElement)) return;

            this.$emit('blur', { originalEvent: event, value: event.target.value });
            this.formField.onBlur?.();

            this.focused = false;
            this.inputDraft = null;
            event.target.value = this.formatValue(this.rawValue);

            this.updateClearIconVisibility(!isEmpty(event.target.value));
        },
        onKeyDown(event: KeyboardEvent) {
            if (event.code === 'ArrowDown' && this.overlay) {
                this.trapFocus(event);
            } else if (event.code === 'ArrowDown' && !this.overlay) {
                this.overlayVisible = true;
            } else if (event.code === 'Escape') {
                if (this.overlayVisible) {
                    this.overlayVisible = false;
                    event.preventDefault();
                    event.stopPropagation();
                }
            } else if (event.code === 'Tab') {
                if (this.overlay) {
                    getFocusableElements(this.overlay).forEach((el) => {
                        if (el instanceof HTMLElement) el.tabIndex = -1;
                    });
                }

                if (this.overlayVisible) {
                    this.overlayVisible = false;
                }
            } else if (event.code === 'Enter') {
                if (this.manualInput && event.target instanceof HTMLInputElement && event.target.value.trim() !== '') {
                    try {
                        let value = this.parseValue(event.target.value);

                        if (this.isValidSelection(value)) {
                            this.overlayVisible = false;
                        }
                    } catch (err) {
                        /* NoOp */
                    }
                }

                this.$emit('keydown', event);
            }
        },
        overlayRef(el: ElementRef) {
            const element = refElement(el);
            this.overlay = element instanceof HTMLElement ? element : null;
        },
        inputRef(el: ElementRef) {
            const element = refElement(el);
            this.input = element instanceof HTMLInputElement ? element : null;
        },
        previousButtonRef(el: ElementRef) {
            const element = refElement(el);
            this.previousButton = element instanceof HTMLElement ? element : null;
        },
        nextButtonRef(el: ElementRef) {
            const element = refElement(el);
            this.nextButton = element instanceof HTMLElement ? element : null;
        },
        getMonthName(index: number) {
            return this.locale.monthNames[index];
        },
        getYear(month: CalendarMonth) {
            return this.currentView === 'month' ? this.currentYear : month.year;
        },
        onClearClick() {
            this.updateModel(null);
            this.overlayVisible = false;
        },
        onOverlayClick(event: MouseEvent) {
            event.stopPropagation();

            if (!this.inline) {
                OverlayEventBus.emit('overlay-click', {
                    originalEvent: event,
                    target: this.$el
                });
            }
        },
        onOverlayKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Escape':
                    if (!this.inline) {
                        this.input?.focus();
                        this.overlayVisible = false;
                        event.stopPropagation();
                    }

                    break;

                default:
                    break;
            }
        },
        onOverlayMouseUp(event: MouseEvent) {
            this.onOverlayClick(event);
        },
        createResponsiveStyle() {
            if (this.numberOfMonths > 1 && this.responsiveOptions && !this.isUnstyled) {
                if (!this.responsiveStyleElement) {
                    this.responsiveStyleElement = document.createElement('style');
                    this.responsiveStyleElement.type = 'text/css';
                    setAttribute(this.responsiveStyleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
                    document.body.appendChild(this.responsiveStyleElement);
                }

                let innerHTML = '';

                if (this.responsiveOptions) {
                    const comparer = localeComparator();
                    let responsiveOptions = [...this.responsiveOptions]
                        .filter((o) => !!(o.breakpoint && o.numMonths))
                        .sort((o1, o2) => -1 * comparer(o1.breakpoint, o2.breakpoint));

                    for (let i = 0; i < responsiveOptions.length; i++) {
                        let { breakpoint, numMonths } = responsiveOptions[i];
                        let styles = `
                            .rs-datepicker-panel[${this.$attrSelector}] .rs-datepicker-calendar:nth-child(${numMonths}) .rs-datepicker-next-button {
                                display: inline-flex;
                            }
                        `;

                        for (let j = numMonths; j < this.numberOfMonths; j++) {
                            styles += `
                                .rs-datepicker-panel[${this.$attrSelector}] .rs-datepicker-calendar:nth-child(${j + 1}) {
                                    display: none;
                                }
                            `;
                        }

                        innerHTML += `
                            @media screen and (max-width: ${breakpoint}) {
                                ${styles}
                            }
                        `;
                    }
                }

                this.responsiveStyleElement.innerHTML = innerHTML;
            }
        },
        destroyResponsiveStyleElement() {
            if (this.responsiveStyleElement) {
                this.responsiveStyleElement.remove();
                this.responsiveStyleElement = null;
            }
        },
        dayDataP(date: DayCell) {
            return cn({
                today: date.today,
                'other-month': date.otherMonth,
                selected: this.isSelected(date),
                disabled: !date.selectable
            });
        }
    },
    computed: {
        locale() {
            return { ...defaultOptions.locale, ...this.$primevue?.config.locale };
        },
        selectedDates(): DateItem[] {
            return Array.isArray(this.rawValue) ? this.rawValue : this.rawValue ? [this.rawValue] : [];
        },
        viewDate(): Date {
            const [start, end] = this.selectedDates;
            let date: DateItem | undefined = start;

            if (this.isRangeSelection() && start && end) {
                const nextMonth = new Date(start.getFullYear(), start.getMonth() + this.numberOfMonths, 1);

                if (end >= nextMonth) date = new Date(end.getFullYear(), end.getMonth() - this.numberOfMonths + 1, 1);
            } else if (this.isMultipleSelection()) {
                date = this.selectedDates.at(-1);
            }

            if (date) return date;

            const today = new Date();

            if (this.maxDate && this.maxDate < today) return this.maxDate;
            if (this.minDate && this.minDate > today) return this.minDate;

            return today;
        },
        inputFieldValue() {
            return this.inputDraft ?? this.formatValue(this.rawValue);
        },
        months(): CalendarMonth[] {
            const months: CalendarMonth[] = [];

            for (let i = 0; i < this.numberOfMonths; i++) {
                let month = this.currentMonth + i;
                let year = this.currentYear;

                if (month > 11) {
                    month = (month % 11) - 1;
                    year = year + 1;
                }

                const dates: DayCell[][] = [];
                let firstDay = this.getFirstDayOfMonthIndex(month, year);
                let daysLength = this.getDaysCountInMonth(month, year);
                let prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
                let dayNo = 1;
                let today = new Date();
                const weekNumbers: number[] = [];
                let monthRows = Math.ceil((daysLength + firstDay) / 7);

                for (let i = 0; i < monthRows; i++) {
                    const week: DayCell[] = [];

                    if (i == 0) {
                        for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
                            let prev = this.getPreviousMonthAndYear(month, year);

                            week.push({
                                day: j,
                                month: prev.month,
                                year: prev.year,
                                otherMonth: true,
                                today: this.isToday(today, j, prev.month, prev.year),
                                selectable: this.isSelectable(j, prev.month, prev.year, true)
                            });
                        }

                        let remainingDaysLength = 7 - week.length;

                        for (let j = 0; j < remainingDaysLength; j++) {
                            week.push({
                                day: dayNo,
                                month: month,
                                year: year,
                                today: this.isToday(today, dayNo, month, year),
                                selectable: this.isSelectable(dayNo, month, year, false)
                            });
                            dayNo++;
                        }
                    } else {
                        for (let j = 0; j < 7; j++) {
                            if (dayNo > daysLength) {
                                let next = this.getNextMonthAndYear(month, year);

                                week.push({
                                    day: dayNo - daysLength,
                                    month: next.month,
                                    year: next.year,
                                    otherMonth: true,
                                    today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                                    selectable: this.isSelectable(dayNo - daysLength, next.month, next.year, true)
                                });
                            } else {
                                week.push({
                                    day: dayNo,
                                    month: month,
                                    year: year,
                                    today: this.isToday(today, dayNo, month, year),
                                    selectable: this.isSelectable(dayNo, month, year, false)
                                });
                            }

                            dayNo++;
                        }
                    }

                    if (this.showWeek) {
                        weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
                    }

                    dates.push(week);
                }

                months.push({
                    month: month,
                    year: year,
                    dates: dates,
                    weekNumbers: weekNumbers
                });
            }

            return months;
        },
        weekDays() {
            let weekDays = [];
            let dayIndex = this.locale.firstDayOfWeek;

            for (let i = 0; i < 7; i++) {
                weekDays.push(this.locale.dayNamesMin[dayIndex]);
                dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
            }

            return weekDays;
        },
        ticksTo1970() {
            return ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000;
        },
        sundayIndex() {
            return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
        },
        datePattern() {
            return this.dateFormat || this.locale.dateFormat;
        },
        monthPickerValues() {
            const monthPickerValues: DatePickerMonthOptions[] = [];

            const isSelectableMonth = (baseMonth: number) => {
                if (this.minDate) {
                    const minMonth = this.minDate.getMonth();
                    const minYear = this.minDate.getFullYear();

                    if (this.currentYear < minYear || (this.currentYear === minYear && baseMonth < minMonth)) {
                        return false;
                    }
                }

                if (this.maxDate) {
                    const maxMonth = this.maxDate.getMonth();
                    const maxYear = this.maxDate.getFullYear();

                    if (this.currentYear > maxYear || (this.currentYear === maxYear && baseMonth > maxMonth)) {
                        return false;
                    }
                }

                return true;
            };

            for (let i = 0; i <= 11; i++) {
                monthPickerValues.push({
                    value: this.locale.monthNamesShort[i],
                    selectable: isSelectableMonth(i)
                });
            }

            return monthPickerValues;
        },
        yearPickerValues() {
            const yearPickerValues: DatePickerYearOptions[] = [];
            let base = this.currentYear - (this.currentYear % 10);

            const isSelectableYear = (baseYear: number) => {
                if (this.minDate) {
                    if (this.minDate.getFullYear() > baseYear) return false;
                }

                if (this.maxDate) {
                    if (this.maxDate.getFullYear() < baseYear) return false;
                }

                return true;
            };

            for (let i = 0; i < 10; i++) {
                yearPickerValues.push({ value: base + i, selectable: isSelectableYear(base + i) });
            }

            return yearPickerValues;
        },
        formattedCurrentHour() {
            if (this.currentHour == 0 && this.hourFormat == '12') {
                return this.currentHour + 12;
            }

            return this.currentHour < 10 ? '0' + this.currentHour : this.currentHour;
        },
        formattedCurrentMinute() {
            return this.currentMinute < 10 ? '0' + this.currentMinute : this.currentMinute;
        },
        formattedCurrentSecond() {
            return this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond;
        },
        formattedCurrentTime() {
            let time = `${this.formattedCurrentHour}${this.timeSeparator}${this.formattedCurrentMinute}`;

            if (this.showSeconds) {
                time += `${this.timeSeparator}${this.formattedCurrentSecond}`;
            }

            if (this.hourFormat == '12') {
                time += ` ${this.pm ? this.locale.pm : this.locale.am}`;
            }

            return time;
        },
        todayLabel() {
            return this.locale.today;
        },
        clearLabel() {
            return this.locale.clear;
        },
        weekHeaderLabel() {
            return this.locale.weekHeader;
        },
        monthNames() {
            return this.locale.monthNames;
        },
        prevButtonAriaLabel() {
            return this.getNavigatorAriaLabel(-1);
        },
        nextButtonAriaLabel() {
            return this.getNavigatorAriaLabel(1);
        },
        switchViewButtonDisabled() {
            return this.numberOfMonths > 1 || this.disabled;
        },
        isClearIconVisible() {
            return this.showClear && this.rawValue != null && !this.disabled;
        },
        panelId() {
            return this.$id + '_panel';
        },
        containerDataP() {
            return cn({
                fluid: this.$fluid
            });
        },
        panelDataP() {
            return cn({
                inline: this.inline,
                ['portal-' + this.appendTo]: 'portal-' + this.appendTo
            });
        },
        inputIconDataP() {
            return cn({
                [this.size]: this.size
            });
        },
        timePickerDataP() {
            return cn({
                'time-only': this.timeOnly
            });
        },
        hourIncrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 0, 1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 0, 1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        },
        hourDecrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 0, -1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 0, -1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        },
        minuteIncrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 1, 1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 1, 1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        },
        minuteDecrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 1, -1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 1, -1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        },
        secondIncrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 2, 1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 2, 1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        },
        secondDecrementCallbacks() {
            return {
                mousedown: (event: MouseEvent) => this.onTimePickerElementMouseDown(event, 2, -1),
                mouseup: (event: MouseEvent) => this.onTimePickerElementMouseUp(event),
                mouseleave: () => this.onTimePickerElementMouseLeave(),
                keydown: (event: KeyboardEvent) => this.onTimePickerElementKeyDown(event, 2, -1),
                keyup: (event: KeyboardEvent) => this.onTimePickerElementKeyUp(event)
            };
        }
    },
    components: {
        InputText,
        Button,
        Portal,
        CalendarIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        ChevronUpIcon,
        ChevronDownIcon,
        TimesIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
