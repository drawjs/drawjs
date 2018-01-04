import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'

export default class Graph extends Geometry {
	constructor(
		{
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			isSelected=false,
			onDragStart,
			onDragging,
			onDragStop,
		}: {
			top: number,
			left: number,
			width: number,
			height: number,
			fill?: string,
			angle?: number,
			draggable?: boolean,
			isSelected?: boolean,
			onDragStart?: Function,
			onDragging?: Function,
			onDragStop?: Function,
		}
	) {
		super( {
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			onDragStart,
			onDragging,
			onDragStop,
		} )


		this.isSelected = isSelected
	}

	private _renderSelection( ctx: CanvasRenderingContext2D ) {
		ctx.save()
		ctx.beginPath()
		ctx.rect(this.left, this.top, this.width, this.height)
		ctx.closePath()
		ctx.fill()
		ctx.lineWidth = 20
		ctx.strokeStyle = 'pink'
		ctx.stroke()
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.restore()
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		this.isSelected && this._renderSelection( ctx )
	}
}
