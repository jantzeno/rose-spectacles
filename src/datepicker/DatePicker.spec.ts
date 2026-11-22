import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import DatePicker from './DatePicker.vue';

it.each([10, 11, 12])('preserves the first typed month digit until month %i is complete', async (month) => {
    const wrapper = mount(DatePicker, {
        props: {
            modelValue: null,
            view: 'month',
            dateFormat: 'yy/mm',
            'onUpdate:modelValue': (value: Date | null): void => {
                void wrapper.setProps({ modelValue: value });
            }
        },
        global: { plugins: [PrimeVue] }
    });

    try {
        const input = wrapper.get('input');

        await input.trigger('focus');
        await input.setValue('2024/1');
        expect(input.element.value).toBe('2024/1');

        await input.setValue(`${input.element.value}${month % 10}`);
        await input.trigger('blur');

        expect(input.element.value).toBe(`2024/${month}`);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([new Date(2024, month - 1, 1)]);
    } finally {
        wrapper.unmount();
    }
});

it('changes the range end time on successive hour increments without changing the start', async () => {
    const start = new Date(2026, 5, 10, 9, 30);
    const wrapper = mount(DatePicker, {
        props: { inline: true, selectionMode: 'range', showTime: true, hourFormat: '24', modelValue: [start, null] },
        global: { plugins: [PrimeVue] }
    });

    try {
        await wrapper.get('td[aria-label="15"] [data-pc-section="day"]').trigger('click');
        const readRange = () => wrapper.emitted<[[Date, Date | null]]>('update:modelValue')!.at(-1)![0];
        expect(readRange()).toEqual([start, new Date(2026, 5, 15, 9, 30)]);
        await wrapper.setProps({ modelValue: readRange() });

        const increment = wrapper.get('.rs-datepicker-hour-picker button:first-child');
        for (const hour of [10, 11]) {
            await increment.trigger('mousedown');
            await increment.trigger('mouseup');
            expect(readRange()).toEqual([start, new Date(2026, 5, 15, hour, 30)]);
            await wrapper.setProps({ modelValue: readRange() });
        }
    } finally {
        wrapper.unmount();
    }
});

it.each([
    ['2026-06-10', new Date(2026, 5, 10)],
    ['2026-06-10T01:00:00Z', new Date('2026-06-10T01:00:00Z')]
])('formats the ISO model %s like the equivalent local Date', async (modelValue, date) => {
    const wrapper = mount(DatePicker, { props: { modelValue: date, dateFormat: 'dd/mm/yy' }, global: { plugins: [PrimeVue] } });

    try {
        const input = wrapper.get('input');
        const expected = input.element.value;

        await wrapper.setProps({ modelValue });

        expect(input.element.value).toBe(expected);
        expect(wrapper.vm.viewDate).toEqual(date);
    } finally {
        wrapper.unmount();
    }
});

it.each([
    { view: 'month', current: 5, next: 6, minDate: new Date(2026, 5, 1), maxDate: new Date(2026, 6, 31) },
    { view: 'year', current: 6, next: 7, minDate: new Date(2026, 0, 1), maxDate: new Date(2027, 11, 31) }
])('keeps keyboard focus on selectable $view cells at the date bounds', async ({ view, current, next, minDate, maxDate }) => {
    const wrapper = mount(DatePicker, {
        props: { inline: true, view, modelValue: new Date(2026, 5, 10), minDate, maxDate },
        global: { plugins: [PrimeVue] },
        attachTo: document.body
    });

    try {
        const cells = wrapper.findAll<HTMLElement>(`[data-pc-section="${view}"]`);

        cells[current].element.focus();
        await cells[current].trigger('keydown', { code: 'ArrowLeft' });
        expect(document.activeElement).toBe(cells[current].element);

        await cells[current].trigger('keydown', { code: 'ArrowRight' });
        expect(document.activeElement).toBe(cells[next].element);

        await cells[next].trigger('keydown', { code: 'ArrowRight' });
        expect(document.activeElement).toBe(cells[next].element);

        await cells[next + 1].trigger('keydown', { code: 'Enter' });
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    } finally {
        wrapper.unmount();
    }
});

it.each(['month', 'year'])('lets Tab leave the inline %s picker', (view) => {
    const wrapper = mount(DatePicker, { props: { inline: true, view }, global: { plugins: [PrimeVue] } });

    try {
        const cell = wrapper.get(`[data-pc-section="${view}"]`);
        const event = new KeyboardEvent('keydown', { code: 'Tab', bubbles: true, cancelable: true });

        expect(cell.element.dispatchEvent(event)).toBe(true);
    } finally {
        wrapper.unmount();
    }
});

it.each([
    ['date', '2026-06-10', [new Date(2026, 5, 10), null]],
    ['string', '2026-06-10 - 2026-06-15', ['2026-06-10', '2026-06-15']]
] as const)('keeps manually entered ranges after blur with %s model values', async (updateModelType, typed, expected) => {
    const wrapper = mount(DatePicker, {
        props: { selectionMode: 'range', updateModelType, dateFormat: 'yy-mm-dd', modelValue: null },
        global: { plugins: [PrimeVue] }
    });

    try {
        const input = wrapper.get('input');

        await input.setValue(typed);
        await input.trigger('blur');

        expect(input.element.value).toBe(typed);
        expect(wrapper.emitted('update:modelValue')).toEqual([[expected]]);
    } finally {
        wrapper.unmount();
    }
});

it('keeps the range start visible when selection mode changes to single', async () => {
    const wrapper = mount(DatePicker, {
        props: { selectionMode: 'range', modelValue: [new Date(2026, 5, 10), new Date(2026, 5, 15)], dateFormat: 'yy-mm-dd' },
        global: { plugins: [PrimeVue] }
    });

    try {
        expect(wrapper.get('input').element.value).toBe('2026-06-10 - 2026-06-15');

        await wrapper.setProps({ selectionMode: 'single' });
        expect(wrapper.get('input').element.value).toBe('2026-06-10');
        expect(wrapper.vm.viewDate).toEqual(new Date(2026, 5, 10));
    } finally {
        wrapper.unmount();
    }
});

it.each([
    ['minute', new Date(2026, 5, 10, 12, 30), new Date(2026, 5, 10, 12, 59)],
    ['second', new Date(2026, 5, 10, 12, 30, 15), new Date(2026, 5, 10, 12, 30, 59)]
])('checks the wrapped %s against minDate before changing the time', async (unit, minDate, modelValue) => {
    const wrapper = mount(DatePicker, { props: { inline: true, timeOnly: true, showSeconds: true, minDate, modelValue }, global: { plugins: [PrimeVue] } });

    try {
        const increment = wrapper.get(`.rs-datepicker-${unit}-picker button:first-child`);

        await increment.trigger('mousedown');
        await increment.trigger('mouseup');

        expect(wrapper.emitted('update:modelValue')).toEqual([[modelValue]]);
    } finally {
        wrapper.unmount();
    }
});

it.each(['click', 'keydown'])('ignores out-of-range months on %s in unstyled month view', async (event) => {
    const wrapper = mount(DatePicker, {
        global: { plugins: [PrimeVue] },
        props: {
            inline: true,
            unstyled: true,
            view: 'month',
            modelValue: new Date(2026, 6, 1),
            minDate: new Date(2026, 5, 1),
            maxDate: new Date(2026, 7, 31)
        }
    });

    try {
        const months = wrapper.findAll('[data-pc-section="month"]');
        const activation = event === 'keydown' ? { code: 'Enter' } : {};

        expect(months[4].attributes('data-p-disabled')).toBe('true');
        expect(months[8].attributes('data-p-disabled')).toBe('true');
        await months[4].trigger(event, activation);
        await months[8].trigger(event, activation);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await months[5].trigger(event, activation);
        expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2026, 5, 1)]]);
    } finally {
        wrapper.unmount();
    }
});

describe('DatePicker.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof DatePicker>>;

    beforeEach(() => {
        wrapper = mount(DatePicker, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: ''
            }
        });
    });

    it('should exist', async () => {
        expect(wrapper.find('.rs-datepicker.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-input').exists()).toBe(true);

        let input = wrapper.find('.rs-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.rs-datepicker.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-today').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-prev-button').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-prev-next').exists()).toBe(false);
        expect(wrapper.find('.rs-datepicker-today').text()).toEqual(new Date().getDate().toString());
    });

    it('selects a date through the calendar grid', async () => {
        await wrapper.setProps({ inline: true, modelValue: new Date(2022, 2, 1) });

        await wrapper.get('td[aria-label="8"] [data-pc-section="day"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2022, 2, 8)]]);
    });

    it('should calculate the correct view date when in range mode', async () => {
        const dateOne = new Date();
        const dateTwo = new Date();

        dateTwo.setFullYear(dateOne.getFullYear(), dateOne.getMonth() + 2, dateOne.getDate());
        await wrapper.setProps({ selectionMode: 'range', showTime: true, modelValue: [dateOne, dateTwo] });

        const expectedViewDate = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), 1);

        expect(wrapper.vm.viewDate.getFullYear()).toEqual(expectedViewDate.getFullYear());
        expect(wrapper.vm.viewDate.getMonth()).toEqual(expectedViewDate.getMonth());
    });

    it('should open a year view when there is selected date (fix: #6203)', async () => {
        const dateOne = new Date();

        dateOne.setFullYear(1988, 9, 10);

        await wrapper.setProps({ modelValue: dateOne });

        const input = wrapper.find('.rs-datepicker-input');

        await input.trigger('focus');

        const yearSelectButton = wrapper.find('.rs-datepicker .rs-datepicker-select-year');

        expect(yearSelectButton.exists()).toBe(true);
        expect(yearSelectButton.text()).toBe('1988');

        await yearSelectButton.trigger('click');

        expect(wrapper.find('.rs-datepicker-decade').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-decade').text()).toBe('1980 - 1989');
    });

    it('should not show other months when showOtherMonths is false', async () => {
        const dateOne = new Date();

        dateOne.setFullYear(1988, 5, 15);

        await wrapper.setProps({ modelValue: dateOne, showOtherMonths: false });

        const input = wrapper.find('.rs-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.rs-datepicker-other-month span').exists()).toBe(false);

        await input.trigger('blur');

        await wrapper.setProps({ showOtherMonths: true });

        await input.trigger('focus');

        expect(wrapper.find('.rs-datepicker-other-month span').exists()).toBe(true);
    });

    it('should correctly set the year when view="year" and value is set via the input', async () => {
        const dateOne = new Date();
        const dateTwo = new Date();

        dateTwo.setFullYear(1988, 5, 15);

        await wrapper.setProps({ view: 'year', dateFormat: 'yy', modelValue: dateOne });

        const input = wrapper.find('.rs-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.rs-datepicker-decade').exists()).toBe(true);
        expect(wrapper.find('.rs-datepicker-decade').text()).toBe('2020 - 2029');

        await wrapper.setProps({ modelValue: dateTwo });

        expect(wrapper.find('.rs-datepicker-decade').text()).toBe('1980 - 1989');
    });

    it('should populate the time when typing a 24-hour value', async () => {
        await wrapper.setProps({ showTime: true, hourFormat: '24' });

        const input = wrapper.find('.rs-datepicker-input');

        await input.setValue('06/15/1988 14:30');

        const value = wrapper.emitted<[Date]>('update:modelValue')?.at(-1)?.[0];

        expect(value?.getHours()).toBe(14);
        expect(value?.getMinutes()).toBe(30);
        expect(wrapper.vm.pm).toBeNull();
    });

    it('should populate the time when typing a 12-hour value', async () => {
        await wrapper.setProps({ showTime: true, hourFormat: '12' });

        const input = wrapper.find('.rs-datepicker-input');

        await input.setValue('06/15/1988 02:30 PM');

        const value = wrapper.emitted<[Date]>('update:modelValue')?.at(-1)?.[0];

        expect(value?.getHours()).toBe(14);
        expect(value?.getMinutes()).toBe(30);
        expect(wrapper.vm.pm).toBe(true);
    });

    describe('navigator button aria-labels', () => {
        const prevLabel = () => wrapper.find('.rs-datepicker-prev-button').attributes('aria-label');
        const nextLabel = () => wrapper.find('.rs-datepicker-next-button').attributes('aria-label');

        beforeEach(async () => {
            await wrapper.setProps({ inline: true });
            await wrapper.setData({ currentMonth: 0, currentYear: 2026 });
        });

        it('should include the target month in date view', () => {
            expect(prevLabel()).toBe('Previous Month, December 2025');
            expect(nextLabel()).toBe('Next Month, February 2026');
        });

        it('should include the target year in month view', async () => {
            await wrapper.setData({ currentView: 'month' });

            expect(prevLabel()).toBe('Previous Year, 2025');
            expect(nextLabel()).toBe('Next Year, 2027');
        });

        it('should include the target decade in year view', async () => {
            await wrapper.setData({ currentView: 'year' });

            expect(prevLabel()).toBe('Previous Decade, 2010 - 2019');
            expect(nextLabel()).toBe('Next Decade, 2030 - 2039');
        });

        it('should include the target months in multiple months view', async () => {
            await wrapper.setProps({ numberOfMonths: 2 });

            expect(prevLabel()).toBe('Previous Month, December 2025');
            expect(nextLabel()).toBe('Next Month, March 2026');
        });

        it('should update after navigating', async () => {
            await wrapper.find('.rs-datepicker-next-button').trigger('click');

            expect(prevLabel()).toBe('Previous Month, January 2026');
            expect(nextLabel()).toBe('Next Month, March 2026');
        });
    });

    describe('time picker live region', () => {
        const liveTime = () => wrapper.find('.rs-datepicker-time-picker [aria-live="polite"]');

        beforeEach(async () => {
            await wrapper.setProps({ inline: true, showTime: true });
            await wrapper.setData({ currentHour: 9, currentMinute: 5 });
        });

        it('should announce the current time', () => {
            expect(liveTime().exists()).toBe(true);
            expect(liveTime().text()).toBe('09:05');
        });

        it('should include seconds and am/pm when shown', async () => {
            await wrapper.setProps({ showSeconds: true, hourFormat: '12' });
            await wrapper.setData({ currentSecond: 7, pm: true });

            expect(liveTime().text()).toBe('09:05:07 pm');
        });

        it('should update when the time changes', async () => {
            await wrapper.setData({ currentHour: 10 });

            expect(liveTime().text()).toBe('10:05');
        });
    });

    describe('nested overlays', () => {
        let nestedOverlay: HTMLDivElement;
        let overlay: HTMLElement;

        beforeEach(async () => {
            await wrapper.setData({ overlayVisible: true });
            overlay = wrapper.get<HTMLElement>('.rs-datepicker-panel').element;
            wrapper.vm.onOverlayEnter(overlay);
            wrapper.vm.onOverlayEnterComplete();

            nestedOverlay = document.createElement('div');
            document.body.appendChild(nestedOverlay);
        });

        afterEach(() => {
            wrapper.vm.onOverlayLeave();
            nestedOverlay.remove();
        });

        const mousedownOnNestedOverlay = (emitterTarget: Element | null) => {
            const event = new MouseEvent('mousedown', { bubbles: true });

            nestedOverlay.addEventListener('mousedown', (e) => OverlayEventBus.emit('overlay-click', { originalEvent: e, target: emitterTarget }), {
                once: true
            });
            nestedOverlay.dispatchEvent(event);
        };

        it('should stay open when an overlay of a component inside the panel is clicked', () => {
            const footer = overlay.querySelector('.rs-datepicker-buttonbar') || overlay.firstElementChild;

            mousedownOnNestedOverlay(footer);

            expect(wrapper.vm.overlayVisible).toBe(true);
        });

        it('should close when an overlay of a component outside the panel is clicked', () => {
            mousedownOnNestedOverlay(document.body);

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on a regular outside click after a nested overlay click', () => {
            mousedownOnNestedOverlay(overlay.firstElementChild);
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open on an outside click while an overlay of a component inside the panel is open', () => {
            const combobox = document.createElement('span');

            combobox.setAttribute('aria-expanded', 'true');
            overlay.appendChild(combobox);
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(wrapper.vm.overlayVisible).toBe(true);

            combobox.setAttribute('aria-expanded', 'false');
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(wrapper.vm.overlayVisible).toBe(false);
        });
    });
});
