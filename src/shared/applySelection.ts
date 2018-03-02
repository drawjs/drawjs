import selectionRendererExcludingCellTypes from "store/exclude/selectionRendererExcludingCellTypes"
import { includes } from "lodash";
import getters from "../store/draw/getters";

/**
 *
 * @param element Graph element
 */
export default function( element ) {
	const { shouldSelect, type, draw, path } = element
	const ctx = getters.ctx
	if (
		shouldSelect &&
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
