import getters from "../store/draw/getters"
import { startDragCell, draggingCell, stopDragCell } from "./coupleCell"

/**
 * // CEll
 */
export function startDragMostTopCellFocused( point ) {
	const cell = getters.getMostTopCellFocused( point )
	startDragCell( cell, event )
}

export function startDragCellsShouldSelect( event ) {
	getters.cellsShouldSelect.map( startDrag )

	function startDrag( cell ) {
		startDragCell( cell, event )
	}
}

export function draggingCellsShouldDrag() {
	getters.cellsShouldDrag.map( dragging )

	function dragging( cell ) {
		draggingCell( cell, event )
	}
}

export function stopDragCellsShouldDrag() {
	getters.cellsShouldDrag.map( stopDrag )

	function stopDrag( cell ) {
		stopDragCell( cell, event )
	}
}
