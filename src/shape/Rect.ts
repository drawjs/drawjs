export default class Rect {
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
		this.top = top
		this.left = left
		this.fill = fill
		this.width = width
		this.height = height
		this.angle = angle
	}

	render( ctx ) {
		ctx.fillStyle = this.fill
		ctx.fillRect(this.left, this.top, this.width, this.height)
		ctx.rotate((Math.PI / 180) * this.angle)
	}
}
