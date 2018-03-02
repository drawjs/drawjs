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
