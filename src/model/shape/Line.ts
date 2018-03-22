import Path from "../Path"
import { LINE } from "store/constant/cellType"
import { isNotNil } from "util/index"
import getLineRotatableBounds from "../../util/geometry/getLineRotatableBounds"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import Segment from "../Segment"

export default class Line extends Path {
	type = LINE

	rotatable: boolean = false
	sizable: boolean = false

	source: any
	target: any

	lineWidth: number = 1

	/**
	 * Override
	 */
	t = 1

	constructor( props ) {
		super( setPropsPointsDangerously( props ) )

		this.source = this.segments[ 0 ]
		this.target = this.segments[ 1 ]

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		// this.sharedActions.hideSegments( this.segments )

		function setPropsPointsDangerously( props ) {
			const { source, target } = props

			const points: Point2D[] = [ source, target ]

			props.points = points

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

	render() {
		super.render()

		this.renderHitRegion()
	}

	renderHitRegion() {
		const { ctx } = this.getters
		ctx.save()
		ctx.fillStyle = "#999"
		ctx.fill( this.hitRegionPath2d )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath(
			{ x, y },
			this.hitRegionPath2d
		)
		return isContain
	}
}
