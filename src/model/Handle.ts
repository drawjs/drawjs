import isNotNil from "../util/isNotNil"
import Segment from "./Segment"
import {
	HandleType,
	DEGREE_TO_RADIAN,
	DEFAULT_LENGTH
} from "../store/constant/index"
import Dragger from "./tool/Dragger"
import { Cell } from "./index"
import distance from "../util/geometry/distance"

const { cos, sin, PI } = Math

export default class Handle extends Cell {
	type: HandleType = HandleType.HANDLE_IN

	segment: Segment

	dragger: Dragger

	show: boolean = true

	/**
	 * The relative point of handle
	 */
	relativePoint: Point2D

	partner: Handle = null

	static DEFAULT_LENGTH = DEFAULT_LENGTH

	constructor( props ) {
		super( props )

		this.segment = props.segment

		if ( isNotNil( props.type ) ) {
			this.type = props.type
		}

		if ( isNotNil( props.partner ) ) {
			this.partner = props.partner
		}

		this.relativePoint = getHandleRelativePoint(
			this.segmentPoint,
			this.type
		)

		this.dragger = new Dragger( { draw: this.draw } )
		this.dragger.update = this.updateDrag.bind( this )

		function getHandleRelativePoint(
			segmentPoint: Point2D,
			type: HandleType
		): Point2D {
			let angle = 0

			if ( type === HandleType.HANDLE_IN ) {
				angle = -180
			}

			if ( type === HandleType.HANDLE_OUT ) {
				angle = 0
			}

			const { x, y } = segmentPoint

			const { DEFAULT_LENGTH } = Handle
			const deltaX = DEFAULT_LENGTH * cos( angle * DEGREE_TO_RADIAN )
			const deltaY = DEFAULT_LENGTH * sin( angle * DEGREE_TO_RADIAN )
			const handleRelativePoint: Point2D = {
				x: deltaX,
				y: deltaY
			}

			return handleRelativePoint
		}
	}

	get segmentPoint(): Point2D {
		return this.segment.point
	}

	get linePath(): Path2D {
		const path = new Path2D()
		const { x: x1, y: y1 } = this.segmentPoint
		const { x: x2, y: y2 } = this.point
		path.moveTo( x1, y1 )
		path.lineTo( x2, y2 )
		return path
	}

	get pointPath(): Path2D {
		const path = new Path2D()
		const { x, y } = this.point
		path.arc( x, y, 3, 0, 2 * PI )
		return path
	}

	get point() {
		const { segmentPoint, relativePoint } = this
		const point: Point2D = {
			x: segmentPoint.x + relativePoint.x,
			y: segmentPoint.y + relativePoint.y
		}
		return point
	}

	get x(): number {
		return this.point.x
	}

	get y(): number {
		return this.point.y
	}

	get length(): number {
		const { point, segment } = this
		const length: number = distance( point, segment )
		return length
	}

	render() {
		if ( this.show ) {
			this.renderLine()
			this.renderPoint()
		}
	}

	renderLine() {
		const { ctx } = this.getters
		const { linePath } = this
		ctx.save()

		ctx.strokeStyle = "#4a86e8"
		ctx.stroke( linePath )

		ctx.restore()
	}

	renderPoint() {
		const { ctx } = this.getters
		const { pointPath } = this

		ctx.save()

		ctx.fillStyle = this.type === HandleType.HANDLE_IN ? "red" : "blue"
		ctx.fill( pointPath )

		ctx.restore()
	}

	contain( x: number, y: number ) {
		const isContain = this.show && this.getters.pointOnPath( { x, y }, this.pointPath )
		return isContain
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		const { x, y } = this.relativePoint

		const newRelativePoint = {
			x: x + deltaX,
			y: y + deltaY
		}

		this.sharedActions.updateHandleRelativePoint( this, newRelativePoint )

		this.sharedActions.adjustHandleParterPoint( this )
	}
}
