import drawRenderExcludingCellTypes from "store/drawRenderExcludingCellTypes"
import * as _ from "lodash"

export default function( cell: any ) {
	isInclude( cell.type ) && cell.render()
}

function isInclude( type: String ): boolean {
	return !_.includes( drawRenderExcludingCellTypes, type )
}
