import selectionRendererExcludingCellTypes from "store/exclude/selectionRendererExcludingCellTypes"
import { includes } from "lodash";

/**
 *
 * @param element Graph element
 */
export default function( element ) {
	const { isSelected, type, draw, path } = element
	const { ctx } = draw
	if (
		isSelected &&
		!includes( selectionRendererExcludingCellTypes, type )
	) {
		ctx.save()
		ctx.lineWidth = 2
		ctx.setLineDash( [ 5, 5 ] )
		ctx.strokeStyle = "black"
		ctx.stroke( path )
		ctx.restore()
	}
}
