import Cell from "model/Cell"

export default function( cell: Cell, event: any ) {
	cell.dragger.prevPoint = {
		x: event.x,
		y: event.y
	}
	cell.dragger.enable = true
}
