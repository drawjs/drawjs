import { Cell } from "../index"
import { POINT } from "../../store/constant/cellType"
import { POINT_RADIUS } from "../../store/constant/index"
import Graph from "../Graph"
import RectContainer from "../tool/RectContainer"
import translate from "util/geometry/translate"

export default class Point extends Graph {
	type = POINT

	x: number = 0
	y: number = 0

	rotatable: boolean = false

	get R() {
		return POINT_RADIUS
	}

	get path(): Path2D {
		const path = new Path2D()
		const { x, y, R }: { x: number; y: number; R: number } = this
		path.arc( x, y, R, 0, 2 * Math.PI )
		return path
	}

	get rectContainer(): RectContainer {
		const { x, y, R } = this
		const halfR = R / 2

		const leftTop: Point2D = {
			x: x - halfR,
			y: y - halfR
		}

		const rightTop: Point2D = {
			x: x + halfR,
			y: y - halfR
		}

		const rightBottom: Point2D = {
			x: x + halfR,
			y: y + halfR
		}

		const leftBottom: Point2D = {
			x: x - halfR,
			y: y + halfR
		}

		const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]

		return new RectContainer( {
			points,
			target: this,
			draw: this.draw
		} )
	}

	translate( deltaX: number, deltaY: number ) {
		const point: Point2D = {
			x: this.x,
			y: this.y
		}

		const newPoint: Point2D = translate( point, deltaX, deltaY )

		this.x = newPoint.x
		this.y = newPoint.y
	}

	constructor( props ) {
		super( props )

		this.x = props.x
		this.y = props.y
	}

	public render() {
		const { ctx } = this.getters
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()
	}

	public contain( x, y ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path )
		return isContain
	}

	// ******* Drag ******
	public updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.translate( deltaX, deltaY )

		this.draw.render()
	}
	// ******* Drag ******
}
