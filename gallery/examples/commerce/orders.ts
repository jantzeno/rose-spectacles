export type OrderStatus = 'Awaiting fulfillment' | 'Fulfilled';

export interface Order {
    id: string;
    customer: string;
    sku: string;
    placed: Date;
    status: OrderStatus;
    stock: number;
    total: number;
}

export const orderColumns = [
    { field: 'customer', label: 'Customer' },
    { field: 'sku', label: 'SKU' },
    { field: 'placed', label: 'Placed' },
    { field: 'status', label: 'Status' },
    { field: 'stock', label: 'Stock' },
    { field: 'total', label: 'Total' }
] as const;
export type OrderColumn = (typeof orderColumns)[number]['field'];

export function dayOffset(date: Date, offset = 0) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

export function makeOrders(date: Date): Order[] {
    return [
        { id: 'RS-1048', customer: 'Avery Chen', sku: 'BAG-OLV-25', placed: dayOffset(date), status: 'Awaiting fulfillment', stock: 6, total: 84 },
        { id: 'RS-1047', customer: 'Sam Rivera', sku: 'BAG-CLY-35', placed: dayOffset(date, -1), status: 'Awaiting fulfillment', stock: 3, total: 106 },
        { id: 'RS-1046', customer: 'Emery Brooks', sku: 'BOT-CRM', placed: dayOffset(date, -3), status: 'Fulfilled', stock: 18, total: 56 },
        { id: 'RS-1045', customer: 'Jordan Okafor', sku: 'HAT-CHR', placed: dayOffset(date, -6), status: 'Awaiting fulfillment', stock: 0, total: 32 },
        { id: 'RS-1044', customer: 'Riley Patel', sku: 'BAG-OLV-35', placed: dayOffset(date, -10), status: 'Fulfilled', stock: 4, total: 98 },
        { id: 'RS-1043', customer: 'Morgan Ellis', sku: 'BOT-CRM', placed: dayOffset(date, -20), status: 'Fulfilled', stock: 18, total: 28 },
        { id: 'RS-1042', customer: 'Taylor Park', sku: 'BAG-CLY-45', placed: dayOffset(date, -35), status: 'Fulfilled', stock: 5, total: 122 }
    ];
}

export const datePresets = [
    { label: 'Any date', value: 'all' },
    { label: 'Last 7 days', value: 'last7' },
    { label: 'Last 30 days', value: 'last30' },
    { label: 'Custom range', value: 'custom' }
] as const;
type DatePreset = (typeof datePresets)[number]['value'];
type OrderFilter = 'all' | 'awaiting' | 'low-stock';

export interface OrderView {
    id: string;
    label: string;
    query: string;
    filter: OrderFilter;
    datePreset: DatePreset;
    dateRange: (number | null)[];
    columns: OrderColumn[];
}

const defaults: Omit<OrderView, 'id' | 'label'> = {
    query: '',
    filter: 'all',
    datePreset: 'all',
    dateRange: [],
    columns: [...orderColumns.map(({ field }) => field)]
};

export const defaultViews: OrderView[] = [
    { ...defaults, id: 'all', label: 'All orders' },
    { ...defaults, id: 'awaiting', label: 'Needs fulfillment', filter: 'awaiting' },
    { ...defaults, id: 'low-stock', label: 'Low stock', filter: 'low-stock', columns: ['sku', 'placed', 'status', 'stock'] }
];

export const orderStorageKey = 'rose-gallery-order-views';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function readOrderViews(): OrderView[] {
    try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(orderStorageKey) ?? '[]');
        if (!Array.isArray(parsed)) return [];

        return parsed.flatMap((entry: unknown) => {
            if (
                !isRecord(entry) ||
                typeof entry.id !== 'string' ||
                !entry.id.startsWith('saved:') ||
                typeof entry.label !== 'string' ||
                typeof entry.query !== 'string' ||
                !Array.isArray(entry.columns)
            )
                return [];

            const columns: unknown[] = entry.columns;
            const validColumns = orderColumns.map(({ field }) => field).filter((field) => columns.includes(field));
            const datePreset = datePresets.find(({ value }) => value === entry.datePreset)?.value ?? 'all';
            const filter = entry.filter === 'awaiting' || entry.filter === 'low-stock' ? entry.filter : 'all';
            const dateRange = Array.isArray(entry.dateRange)
                ? entry.dateRange.slice(0, 2).map((value: unknown) => (typeof value === 'number' && Number.isFinite(new Date(value).getTime()) ? value : null))
                : [];

            return [{ id: entry.id, label: entry.label, query: entry.query, filter, datePreset, dateRange, columns: validColumns }];
        });
    } catch {
        return [];
    }
}
