import { Cell } from "../model/index"

export function enableCellDrag( cell: Cell ) {
	cell.dragger.enable = true
}

export function disableCellDrag( cell: Cell ) {
	cell.dragger.enable = false
}

export function startDragCell( cell: Cell, event: any ) {
	cell.dragger.start( event )
}

export function draggingCell( cell: Cell, event: any ) {
	cell.dragger.dragging( event )
}

export function stopDragCell( cell: Cell, event: any ) {
	cell.dragger.stop( event )
}

export function selectCell( cell: Cell ) {
	cell.shouldSelect = true
}

export function deselectCell( cell: Cell ) {
	cell.shouldSelect = false
}

export function enableCellRotate( cell: Cell ) {
	cell.shouldRotate = true
}

export function disableCellRotate( cell: Cell ) {
	cell.shouldRotate = false
}
