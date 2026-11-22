<script setup lang="ts">
import { Columns3, Download, PackageCheck, Save, Search } from '@lucide/vue';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import {
    Badge,
    Button,
    Column,
    DataTable,
    DatePicker,
    Dialog,
    EmptyState,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    Select,
    Toolbar
} from 'rose-spectacles';
import { formatMoney } from './products';
import {
    datePresets,
    dayOffset,
    defaultViews,
    makeOrders,
    orderColumns,
    orderStorageKey,
    readOrderViews,
    type Order,
    type OrderColumn,
    type OrderView
} from './orders';

const today = new Date();
const orders = ref(makeOrders(today));
const savedViews = ref<OrderView[]>([]);
const views = computed(() => [...defaultViews, ...savedViews.value]);
const filter = ref<OrderView['filter']>('all');
const query = ref('');
const datePreset = ref<OrderView['datePreset']>('all');
const dateRange = ref<(Date | null)[] | null>(null);
const visibleFields = ref<OrderColumn[]>(orderColumns.map(({ field }) => field));
const selectedRows = ref<Order[]>([]);
const announce = ref('');
const saveOpen = ref(false);
const viewName = ref('');
const table = useTemplateRef<InstanceType<typeof DataTable>>('table');
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

onMounted(() => {
    savedViews.value = readOrderViews();
});

const visibleColumns = computed(() => orderColumns.filter(({ field }) => visibleFields.value.includes(field)));
const filters = computed(() => {
    const range = datePreset.value === 'custom' ? (dateRange.value?.map((date) => date?.getTime() ?? null) ?? []) : [];
    return {
        query: query.value,
        filter: filter.value,
        datePreset: datePreset.value,
        dateRange: range,
        columns: visibleColumns.value.map(({ field }) => field)
    };
});

const matchingView = computed(() => views.value.find(({ id, label, ...state }) => JSON.stringify(state) === JSON.stringify(filters.value)));

const displayedOrders = computed(() => {
    const term = query.value.trim().toLocaleLowerCase();
    const start =
        datePreset.value === 'last7'
            ? dayOffset(today, -6)
            : datePreset.value === 'last30'
              ? dayOffset(today, -29)
              : datePreset.value === 'custom'
                ? dateRange.value?.[0]
                : undefined;
    const end = datePreset.value === 'custom' ? dateRange.value?.[1] : undefined;
    return orders.value.filter(
        (order) =>
            (!term || [order.id, order.customer, order.sku].some((value) => value.toLocaleLowerCase().includes(term))) &&
            (filter.value !== 'awaiting' || order.status === 'Awaiting fulfillment') &&
            (filter.value !== 'low-stock' || order.stock <= 4) &&
            (!start || order.placed >= start) &&
            (!end || order.placed < dayOffset(end, 1))
    );
});

watch(displayedOrders, (rows) => {
    const ids = new Set(rows.map(({ id }) => id));
    selectedRows.value = selectedRows.value.filter(({ id }) => ids.has(id));
});

const fulfillable = computed(() => selectedRows.value.filter(({ status }) => status === 'Awaiting fulfillment'));

function applyView(id: string) {
    const view = views.value.find((option) => option.id === id);
    if (!view) return;
    query.value = view.query;
    filter.value = view.filter;
    datePreset.value = view.datePreset;
    dateRange.value = view.dateRange.map((value) => (value === null ? null : new Date(value)));
    visibleFields.value = [...view.columns];
    selectedRows.value = [];
    announce.value = '';
}

function openSave() {
    viewName.value = '';
    saveOpen.value = true;
}

function saveView() {
    const label = viewName.value.trim();
    if (!label) return;
    const id = 'saved:' + label.toLocaleLowerCase();
    savedViews.value = [...savedViews.value.filter((entry) => entry.id !== id), { id, label, ...filters.value }];
    try {
        window.localStorage.setItem(orderStorageKey, JSON.stringify(savedViews.value));
        announce.value = 'Saved view ' + label + '.';
    } catch {
        announce.value = 'Saved view ' + label + ' for this session.';
    }
    saveOpen.value = false;
}

function fulfillSelected() {
    const ids = new Set(fulfillable.value.map(({ id }) => id));
    if (!ids.size) return;
    orders.value = orders.value.map((order) => (ids.has(order.id) ? { ...order, status: 'Fulfilled' } : order));
    selectedRows.value = [];
    announce.value = 'Fulfilled ' + ids.size + (ids.size === 1 ? ' order.' : ' orders.');
}

function updateSelection(value: Order[] | Order | null | undefined) {
    selectedRows.value = Array.isArray(value) ? value : [];
}
</script>

<template>
    <div class="commerce-order-view">
        <Toolbar class="commerce-order-toolbar">
            <template #start>
                <IconField class="commerce-search">
                    <InputIcon><Search :size="17" aria-hidden="true" /></InputIcon>
                    <InputText v-model="query" placeholder="Search orders or SKUs" aria-label="Search orders or SKUs" />
                </IconField>
                <Select
                    :model-value="matchingView?.id"
                    :options="views"
                    option-label="label"
                    option-value="id"
                    placeholder="Custom view"
                    aria-label="Saved view"
                    @update:model-value="applyView"
                />
            </template>
            <template #end>
                <Button label="Save view" outlined @click="openSave">
                    <template #icon><Save :size="16" aria-hidden="true" /></template>
                </Button>
                <Button label="Export CSV" outlined :disabled="!displayedOrders.length" @click="table?.exportCSV()">
                    <template #icon><Download :size="16" aria-hidden="true" /></template>
                </Button>
            </template>
        </Toolbar>

        <div class="commerce-toolbar commerce-order-filters">
            <Select v-model="datePreset" :options="[...datePresets]" option-label="label" option-value="value" aria-label="Date preset" />
            <DatePicker v-if="datePreset === 'custom'" v-model="dateRange" selection-mode="range" aria-label="Order date range" show-icon show-clear />
            <div class="commerce-columns">
                <Columns3 :size="17" aria-hidden="true" />
                <MultiSelect
                    v-model="visibleFields"
                    :options="[...orderColumns]"
                    option-label="label"
                    option-value="field"
                    aria-label="Visible columns"
                    placeholder="Columns"
                    :max-selected-labels="1"
                    selected-items-label="{0} columns"
                />
            </div>
        </div>

        <div class="commerce-toolbar commerce-order-actions">
            <div>
                <strong>{{ displayedOrders.length }} {{ displayedOrders.length === 1 ? 'order' : 'orders' }}</strong>
                <span v-if="selectedRows.length"> · {{ selectedRows.length }} selected</span>
            </div>
            <Button v-if="selectedRows.length" label="Mark fulfilled" :disabled="!fulfillable.length" @click="fulfillSelected">
                <template #icon><PackageCheck :size="16" aria-hidden="true" /></template>
            </Button>
        </div>
        <p v-if="announce" class="commerce-feedback" role="status">{{ announce }}</p>

        <DataTable
            ref="table"
            :value="displayedOrders"
            :selection="selectedRows"
            data-key="id"
            :rows="5"
            paginator
            scrollable
            striped-rows
            @update:selection="updateSelection"
        >
            <Column selection-mode="multiple" header-style="width: 3rem" />
            <Column field="id" header="Order" sortable />
            <Column v-for="column in visibleColumns" :key="column.field" :field="column.field" :header="column.label" sortable>
                <template #body="{ data }">
                    <Badge v-if="column.field === 'status'" :value="data.status" :severity="data.status === 'Fulfilled' ? 'success' : 'warn'" />
                    <Badge v-else-if="column.field === 'stock' && data.stock <= 4" :value="data.stock + ' left'" :severity="data.stock ? 'warn' : 'danger'" />
                    <span v-else-if="column.field === 'placed'">{{ dateFormat.format(data.placed) }}</span>
                    <span v-else-if="column.field === 'total'">{{ formatMoney(data.total) }}</span>
                    <span v-else>{{ data[column.field] }}</span>
                </template>
            </Column>
            <template #empty>
                <EmptyState title="No orders found" description="Change the search, date range, or saved view." heading="h3">
                    <template #actions><Button label="Reset view" text @click="applyView('all')" /></template>
                </EmptyState>
            </template>
        </DataTable>

        <Dialog v-model:visible="saveOpen" header="Save current view" :modal="true">
            <form class="commerce-save-view" @submit.prevent="saveView">
                <label>
                    View name
                    <InputText v-model="viewName" required maxlength="40" autofocus />
                </label>
                <div class="commerce-toolbar">
                    <Button type="button" label="Cancel" text @click="saveOpen = false" />
                    <Button type="submit" label="Save" :disabled="!viewName.trim()" />
                </div>
            </form>
        </Dialog>
    </div>
</template>
