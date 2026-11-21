import type { TreeNode } from 'rose-spectacles/treenode';
import { reactive } from 'vue';

type DragScope = string | string[] | null;

interface DragStart {
    node: TreeNode;
    subNodes: TreeNode[];
    index: number;
    scope: DragScope;
}

interface DragStop {
    node: TreeNode;
    subNodes?: TreeNode[];
    index?: number;
}

const dragState = reactive<{ isDragging: boolean; dragNode: TreeNode | null; dragScope: DragScope }>({
    isDragging: false,
    dragNode: null,
    dragScope: null
});

const dragStartHandlers = new Set<(event: DragStart) => void>();
const dragStopHandlers = new Set<(event: DragStop) => void>();

export function useTreeDragDropService() {
    const startDrag = (event: DragStart) => {
        dragState.isDragging = true;
        dragState.dragNode = event.node;
        dragState.dragScope = event.scope;

        dragStartHandlers.forEach((handler) => handler(event));
    };

    const stopDrag = (event: DragStop) => {
        dragState.isDragging = false;
        dragState.dragNode = null;
        dragState.dragScope = null;

        dragStopHandlers.forEach((handler) => handler(event));
    };

    const onDragStart = (handler: (event: DragStart) => void) => {
        dragStartHandlers.add(handler);

        return () => dragStartHandlers.delete(handler);
    };

    const onDragStop = (handler: (event: DragStop) => void) => {
        dragStopHandlers.add(handler);

        return () => dragStopHandlers.delete(handler);
    };

    return {
        dragState,
        startDrag,
        stopDrag,
        onDragStart,
        onDragStop
    };
}
