import * as _ from 'lodash'

import selectionRendererExcludingCellTypes from 'store/selectionRendererExcludingCellTypes'


export default class Selection {
	static render( instance: any ) {
		if ( ! _.includes( selectionRendererExcludingCellTypes, instance.type ) ) {
			const ctx = instance.draw.ctx
			ctx.save()
			instance.draw.zoomPan.transformCenterPointForContext( {
				x: instance.left + instance.width / 2,
				y: instance.top + instance.height / 2
			} )
			ctx.lineWidth = 2
			ctx.setLineDash( [ 5, 5 ] )
			ctx.rotate( ( Math.PI / 180 ) * instance.angle )
			ctx.strokeStyle = 'black'
			ctx.strokeRect( - instance.width / 2, - instance.height / 2, instance.width, instance.height )
			ctx.restore()
		}

	}
}
