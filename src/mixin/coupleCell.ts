import { Cell } from "../model/index"

export function selectCell( cell: Cell ) {
	cell.shouldSelect = true
}

export function deselectCell( cell: Cell ) {
	cell.shouldSelect = false
}

export function enableCellDrag( cell: Cell ) {
	cell.shouldDrag = true
}

export function disableCellDrag( cell: Cell ) {
	cell.shouldDrag = false
}

export function startDragCell( cell: Cell, event: any ) {
	cell.startDrag( event )
}

export function draggingCell( cell: Cell, event: any ) {
	cell.dragging( event )
}

export function stopDragCell( cell: Cell, event: any ) {
	cell.stopDrag( event )
}
