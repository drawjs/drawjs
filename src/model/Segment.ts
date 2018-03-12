import Particle from "./Particle";

const { PI } = Math


export default class Segment extends Particle {
	x: number
	y: number

	selected: boolean = false

	shouldShowHandleIn: boolean = false

	shouldShowHandleOut: boolean = false

	constructor( props ) {
		super( props )

		this.x = props.x
		this.y = props.y
	}

	get point(): Point2D {
		return {
			x: this.x,
			y: this.y
		}
	}

	get path(): Path2D {
		const path = new Path2D()
		path.arc( this.x, this.y, 3, 0, PI * 2 )
		return path
	}

	render() {
		const { ctx } = this.getters
		ctx.lineWidth = 3
		ctx.fillStyle = "#00ffff"
		ctx.fill( this.path )
	}
}
