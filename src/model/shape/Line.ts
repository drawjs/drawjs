import Path from "../Path"
import { LINE } from "store/constant/cellType"
import { isNotNil } from "util/index"
import getLineRotatableBounds from "../../util/geometry/getLineRotatableBounds"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import Segment from "../Segment"
import getArrowPoints from "../../util/geometry/getArrowPoints"

export default class Line extends Path {
	type = LINE

	rotatable: boolean = false
	sizable: boolean = false

	/**
	 * Override
	 */
	t = 1

	color: string = "#999"

	// Segment
	source: any

	// Segment
	target: any

	lineWidth: number = 1

	showArrow: boolean = true

	constructor( props: LineProps ) {
		super( setPropsPointsSegmentsDangerously( props ) )

		this.source = this.segments[ 0 ]
		this.target = this.segments[ 1 ]

		this.showArrow = isNotNil( props.showArrow ) ? props.showArrow : this.showArrow

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		// this.sharedActions.hideSegments( this.segments )

		function setPropsPointsSegmentsDangerously( props: LineProps ) {
			const { source, target, sourceSegment, targetSegment } = props

			if ( isNotNil( source ) && isNotNil( target ) ) {
				const points: Point2D[] = [ source, target ]
				props.points = points
			}

			if ( isNotNil( sourceSegment ) && isNotNil( targetSegment ) ) {
				const segments: Segment[] = [ sourceSegment, targetSegment ]
				props.segments = segments
			}

			return props
		}
	}

	get hitBounds(): RotatableBounds {
		const hitBounds: RotatableBounds = getLineRotatableBounds(
			this.source.point,
			this.target.point,
			this.lineWidth
		)
		return hitBounds
	}

	get hitRegionPath2d(): Path2D {
		const {
			leftTop,
			rightTop,
			rightBottom,
			leftBottom
		}: RotatableBounds = this.hitBounds
		const path: Path2D = connectPolygonPoints( [
			leftTop,
			rightTop,
			rightBottom,
			leftBottom
		] )

		// this.getters.testUtils.delayRenderPoint( leftTop, "red" )
		// this.getters.testUtils.delayRenderPoint( rightTop, "orange" )
		// this.getters.testUtils.delayRenderPoint( rightBottom, "yellow" )
		// this.getters.testUtils.delayRenderPoint( leftBottom, "green" )
		return path
	}

	get targetArrowPath2d(): Path2D {
		const points = getArrowPoints( this.source.point, this.target.point, 20 )
		const { top, right, bottom, left } = points
		const path2d: Path2D = connectPolygonPoints( [ top, right, bottom, left ] )

		// this.getters.testUtils.delayRenderPoint( top, "red" )
		// this.getters.testUtils.delayRenderPoint( right, "orange" )
		// this.getters.testUtils.delayRenderPoint( bottom, "yellow" )
		// this.getters.testUtils.delayRenderPoint( left, "green" )

		return path2d
	}

	render() {
		super.render()

		this.renderHitRegion()
		this.showArrow && this.renderArrow()
	}

	renderHitRegion() {
		const { ctx } = this.getters
		ctx.save()
		ctx.fillStyle = this.color
		ctx.fill( this.hitRegionPath2d )
		ctx.restore()
	}

	renderArrow() {
		if ( this.showArrow ) {
			const { ctx } = this.getters
			ctx.save()
			ctx.fillStyle = this.color
			ctx.fill( this.targetArrowPath2d )
			ctx.restore()
		}
	}

	contain( x: number, y: number ) {
		const containHitRigion: boolean = this.getters.pointOnPath(
			{ x, y },
			this.hitRegionPath2d
		)

		const containeTargetArrow: boolean = this.getters.pointOnPath(
			{ x, y },
			this.targetArrowPath2d
		)

		const isContain: boolean = this.showArrow ? ( containeTargetArrow || containHitRigion ) : containHitRigion

		return isContain
	}
}
