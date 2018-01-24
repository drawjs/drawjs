import Draw from "../../Draw"

export default class MiniMap {
	public draw: Draw

	public width: number
	public height: number
	public left: number
	public top: number

	get originX(): number {
		return this.left + this.width / 2
	}

	get originY(): number {
		return this.top + this.height / 2
	}
	get path(): Path2D {
		const path = new Path2D()
		path.rect( -this.width / 2, -this.height / 2, this.width, this.height )
		return path
	}
	get zoomedRigionPath(): Path2D {
		let zoom: number = this.draw.zoomPan.zoom
		zoom = zoom < 1 ? 1 : zoom

		const path = new Path2D()
		path.rect(
			-this.width / zoom / 2,
			-this.height / zoom / 2,
			this.width / zoom,
			this.height / zoom
		)
		return path

		return path
	}
	constructor( props ) {
		this.draw = props.draw

		this.width = this.draw.canvas.width * 0.3
		this.height = this.draw.canvas.width * 0.3
		this.left = 0
		this.top = this.draw.canvas.height - this.height
	}

	render() {
		const ctx = this.draw.ctx

		ctx.save()

		ctx.translate( this.originX, this.originY )

		/**
		 * Container
		 */
		ctx.fillStyle = "white"
		ctx.fill( this.path )
		ctx.lineWidth = 1
		ctx.strokeStyle = "#666"
		ctx.stroke( this.path )

		/**
		 * Zoomed rigion
		 */
		ctx.lineWidth = 1
		ctx.strokeStyle = "red"
		ctx.stroke( this.zoomedRigionPath )



		ctx.restore()
	}
}
