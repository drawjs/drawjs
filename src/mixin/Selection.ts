import * as _ from 'lodash'

import selectionRendererExcludingCellTypes from 'store/exclude/selectionRendererExcludingCellTypes'


export default class Selection {
	static render( instance: any ) {
		if ( ! _.includes( selectionRendererExcludingCellTypes, instance.type ) ) {
			const ctx = instance.draw.ctx
			ctx.save()
			ctx.lineWidth = 2
			ctx.setLineDash( [ 5, 5 ] )
			ctx.strokeStyle = 'black'
			ctx.stroke( instance.path )
			ctx.restore()
		}

	}
}
