import drawRenderExcludingCellTypes from "store/exclude/drawRenderExcludingCellTypes"
import * as _ from "lodash"

export default function( cell: any ) {
	isInclude( cell.type ) && cell.render()
}

function isInclude( type: String ): boolean {
	return !_.includes( drawRenderExcludingCellTypes, type )
}
