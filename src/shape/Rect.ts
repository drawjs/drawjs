import Shape from './Shape'

export default class Rect extends Shape{
	constructor(
		{
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable = false,
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
			onDragStart,
			onDragging,
			onDragStop,
		} )
		this.draggable = true
	}

	public set( field: string, value: any ) {
		super.set( field, value )
	}

	render( ctx ) {
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
