import { equals, removeAccents, resolveFieldData } from '../../internal/utils/object/index';

// Filter rules accept heterogeneous application values and preserve JavaScript coercion.
type FilterRule = (value: any, filter: any, filterLocale?: string) => boolean;

const FilterService = {
    filter<T>(value: T[] | null | undefined, fields: string[], filterValue: unknown, filterMatchMode: string, filterLocale?: string) {
        const filteredItems: T[] = [];

        if (!value) {
            return filteredItems;
        }

        for (const item of value) {
            if (typeof item === 'string') {
                if (this.filters[filterMatchMode](item, filterValue, filterLocale)) {
                    filteredItems.push(item);
                    continue;
                }
            } else {
                for (const field of fields) {
                    const fieldValue = resolveFieldData(item, field);

                    if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
                        filteredItems.push(item);
                        break;
                    }
                }
            }
        }

        return filteredItems;
    },
    filters: {
        startsWith(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
            let stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

            return stringValue.slice(0, filterValue.length) === filterValue;
        },
        contains(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
            let stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

            return stringValue.indexOf(filterValue) !== -1;
        },
        notContains(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
            let stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

            return stringValue.indexOf(filterValue) === -1;
        },
        endsWith(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
            let stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

            return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
        },
        equals(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime && filter.getTime) return value.getTime() === filter.getTime();
            else return removeAccents(value.toString()).toLocaleLowerCase(filterLocale) == removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
        },
        notEquals(value, filter, filterLocale) {
            if (filter === undefined || filter === null || filter === '') {
                return false;
            }

            if (value === undefined || value === null) {
                return true;
            }

            if (value.getTime && filter.getTime) return value.getTime() !== filter.getTime();
            else return removeAccents(value.toString()).toLocaleLowerCase(filterLocale) != removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
        },
        in(value, filter) {
            if (filter === undefined || filter === null || filter.length === 0) {
                return true;
            }

            for (let i = 0; i < filter.length; i++) {
                if (equals(value, filter[i])) {
                    return true;
                }
            }

            return false;
        },
        between(value, filter) {
            if (filter == null || filter[0] == null || filter[1] == null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime) return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();
            else return filter[0] <= value && value <= filter[1];
        },
        lt(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime && filter.getTime) return value.getTime() < filter.getTime();
            else return value < filter;
        },
        lte(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime && filter.getTime) return value.getTime() <= filter.getTime();
            else return value <= filter;
        },
        gt(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime && filter.getTime) return value.getTime() > filter.getTime();
            else return value > filter;
        },
        gte(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (value.getTime && filter.getTime) return value.getTime() >= filter.getTime();
            else return value >= filter;
        },
        dateIs(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (typeof value === 'string') {
                value = new Date(value);
            }

            if (typeof filter === 'string') {
                filter = new Date(filter);
            }

            return value.toDateString() === filter.toDateString();
        },
        dateIsNot(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (typeof value === 'string') {
                value = new Date(value);
            }

            if (typeof filter === 'string') {
                filter = new Date(filter);
            }

            return value.toDateString() !== filter.toDateString();
        },
        dateBefore(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (typeof value === 'string') {
                value = new Date(value);
            }

            if (typeof filter === 'string') {
                filter = new Date(filter);
            }

            return value.getTime() < filter.getTime();
        },
        dateAfter(value, filter) {
            if (filter === undefined || filter === null) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            if (typeof value === 'string') {
                value = new Date(value);
            }

            if (typeof filter === 'string') {
                filter = new Date(filter);
            }

            return value.getTime() > filter.getTime();
        }
    } satisfies Record<string, FilterRule> as Record<string, FilterRule>,
    register(rule: string, fn: FilterRule) {
        this.filters[rule] = fn;
    }
};

export default FilterService;
