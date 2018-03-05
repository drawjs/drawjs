import { Cell } from "../index"
import { POINT } from "../../store/constant/cellType"
import { POINT_RADIUS } from "../../store/constant/index"
import getters from "../../store/draw/getters"
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

		return new RectContainer( points, this )
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
		const ctx = getters.ctx
		super.render()

		ctx.save()

		// const { zoom, panX, panY } = getters
		// const movementX = panX * zoom
		// const movementY = panY * zoom
		// ctx.translate( panX, panY )
		// getters.ctx.transform( getters.zoom, 0, 0, getters.zoom, movementX, movementY )

		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()

	}

	public contain( x, y ) {
		const isContain = getters.ctx.isPointInPath( this.path, x, y )

		return isContain
	}

	// ******* Drag ******
	public updateDrag( event ) {
		const point: Point2D = getters.getPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.translate( deltaX, deltaY )

		this.draw.render()
	}
	// ******* Drag ******
}
