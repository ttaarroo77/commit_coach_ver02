declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  // DragDropContext
  export type DraggableId = string;
  export type DroppableId = string;
  export type DraggableLocation = {
    droppableId: DroppableId;
    index: number;
  };

  export type DropResult = {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation;
    reason: 'DROP' | 'CANCEL';
    mode: 'FLUID' | 'SNAP';
  };

  export type DragStart = {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    mode: 'FLUID' | 'SNAP';
  };

  export type DragUpdate = {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation;
    mode: 'FLUID' | 'SNAP';
  };

  export type DropReason = 'DROP' | 'CANCEL';

  export type OnDragEndResponder = (result: DropResult) => void;
  export type OnDragStartResponder = (start: DragStart) => void;
  export type OnDragUpdateResponder = (update: DragUpdate) => void;

  export type DragDropContextProps = {
    onDragEnd: OnDragEndResponder;
    onDragStart?: OnDragStartResponder;
    onDragUpdate?: OnDragUpdateResponder;
    children: React.ReactNode;
  };

  export const DragDropContext: React.ComponentType<DragDropContextProps>;

  // Droppable
  export type DroppableProps = {
    droppableId: DroppableId;
    type?: string;
    ignoreContainerClipping?: boolean;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement;
  };

  export type DroppableProvided = {
    innerRef: React.RefCallback<HTMLElement>;
    droppableProps: {
      'data-rbd-droppable-id': DroppableId;
      'data-rbd-droppable-context-id': string;
    };
    placeholder?: React.ReactElement;
  };

  export type DroppableStateSnapshot = {
    isDraggingOver: boolean;
    draggingOverWith?: DraggableId;
    draggingFromThisWith?: DraggableId;
    isUsingPlaceholder: boolean;
  };

  export const Droppable: React.ComponentType<DroppableProps>;

  // Draggable
  export type DraggableProps = {
    draggableId: DraggableId;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement;
  };

  export type DraggableProvided = {
    innerRef: React.RefCallback<HTMLElement>;
    draggableProps: {
      'data-rbd-draggable-context-id': string;
      'data-rbd-draggable-id': DraggableId;
      style?: React.CSSProperties;
    };
    dragHandleProps?: {
      role: string;
      'data-rbd-drag-handle-draggable-id': DraggableId;
      'data-rbd-drag-handle-context-id': string;
      'aria-labelledby': string;
      tabIndex: number;
      draggable: boolean;
      onDragStart: React.DragEventHandler<HTMLElement>;
    };
  };

  export type DraggableStateSnapshot = {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    };
    draggingOver?: DroppableId;
    combineWith?: DraggableId;
    combineTargetFor?: DraggableId;
    mode?: 'FLUID' | 'SNAP';
  };

  export const Draggable: React.ComponentType<DraggableProps>;
}
