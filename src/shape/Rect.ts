import Graph from 'model/Graph'
import * as cellTypeList from 'store/constant_cellTypeList'

export default class Rect extends Graph{
	constructor(
		{
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable = false,
			isSelected,
			onDragStart,
			onDragging,
			onDragStop,
		}:
		{
			top: number,
			left: number,
			width: number,
			height: number,
			fill: string,
			angle: number,
			draggable: boolean,
			isSelected: boolean,
			onDragStart: Function,
			onDragging: Function,
			onDragStop: Function,
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
			isSelected,
			onDragStart,
			onDragging,
			onDragStop,
		} )
		this.type = cellTypeList.RECT
		this.draggable = true
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.fillRect(this.left, this.top, this.width, this.height)
		ctx.restore()
	}

	public containPoint( x, y ) {
		return (
			x >= this.left &&
			x <= this.left + this.width &&
			y >= this.top &&
			y <= this.top + this.height
		)
	}
}
