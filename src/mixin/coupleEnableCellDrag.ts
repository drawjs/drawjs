import Cell from "model/Cell"

export default function( cell: Cell, event: any ) {
	cell._prevDraggingPoint = {
		x: event.x,
		y: event.y
	}
	cell.shouldDrag = true
}
