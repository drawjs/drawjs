import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'

export default abstract class Graph extends Geometry {
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
		}: {
			top?: number,
			left?: number,
			width?: number,
			height?: number,
			fill?: string,
			angle?: number,
			draggable?: boolean,
			isSelected?: boolean,
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
		} )


		this.isSelected = isSelected
	}

	private _renderSelection( ctx: CanvasRenderingContext2D ) {
		ctx.save()
		ctx.lineWidth = 20
		ctx.fillStyle = 'pink'
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.fillRect(this.left, this.top, this.width, this.height)
		ctx.restore()
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		this.isSelected && this._renderSelection( ctx )
	}

	public abstract containPoint( x: number, y: number ): void
}