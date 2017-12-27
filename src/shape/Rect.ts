import Shape from './Shape'

export default class Rect extends Shape{
	public top: number
	public left: number
	public width: number
	public height: number
	public fill: string
	public angle: number
	constructor(
		{
			top = 0,
			left = 0,
			width = 100,
			height = 100,
			fill = 'black',
			angle = 0,
		}:
		{
			top: number,
			left: number,
			width: number,
			height: number,
			fill: string,
			angle: number,
		}
	) {
		super()

		this.top = top
		this.left = left
		this.fill = fill
		this.width = width
		this.height = height
		this.angle = angle
	}

	public set( field: string, value: any ) {
		super.set( field, value )

		switch( field ) {
			case 'x':
				this.left = value;
				break
			case 'y':
				this.top = value
				break
		}
	}

	render( ctx ) {
		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fillRect(this.left, this.top, this.width, this.height)
		ctx.rotate((Math.PI / 180) * this.angle)
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
