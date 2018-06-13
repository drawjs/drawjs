import Path from "../Path"
import { LINE } from "../../store/constant/cellType"
import { isNotNil } from "../../util/index"
import getLineRotatableBounds from "../../util/geometry/getLineRotatableBounds"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"
import Segment from "../Segment"
import getArrowPoints from "../../util/geometry/getArrowPoints"
import { notNil } from "../../util/lodash/index";
import { LINE_DEFAULT_COLOR } from '../../store/constant/color';
import { renderHightlightedPath } from '../../drawUtil/render/index';

export default class Line extends Path {
	type = LINE

	rotatable: boolean = false
	sizable: boolean = false

	/**
	 * Override
	 */
	t = 1

	fillColor: string = LINE_DEFAULT_COLOR

	// Segment
	source: any

	// Segment
	target: any

	lineWidth: number = 1

	showArrow: boolean = false

	constructor( props: LineProps ) {
		super( setPropsPointsSegmentsDangerously( props ) )

		const { lineWidth } = props

		this.lineWidth = notNil( lineWidth ) ? lineWidth: this.lineWidth

		const { length } = this.segments
		this.source = this.segments[ 0 ]
		this.target = this.segments[ length - 1 ]

		this.showArrow = isNotNil( props.showArrow ) ?
			props.showArrow :
			this.showArrow

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		// this.sharedActions.hideSegments( this.segments )

		this.fillColor = isNotNil( props.fillColor ) ? props.fillColor : this.fillColor

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
		return path
	}

	get targetArrowPath2d(): Path2D {
		const points = getArrowPoints( this.source.point, this.target.point, 20 )
		const { top, right, bottom, left } = points
		const path2d: Path2D = connectPolygonPoints( [ top, right, bottom, left ] )
		return path2d
	}

	get isVertical(): boolean {
		const { source, target }: Line = this
		const { x: sx } = source
		const { x: tx } = target

		return sx === tx
	}

	get isHorizontal(): boolean {
		const { source, target }: Line = this
		const { y: sy } = source
		const { y: ty } = target

		return sy === ty
	}

	get isCoincided(): boolean {
		const { source, target }: Line = this
		const { x: sx, y: sy } = source
		const { x: tx, y: ty } = target

		return ( sx === tx && sy === ty )
	}

	get center(): Point2D {
		const { x: sx, y: sy } = this.source
		const { x: tx, y: ty } = this.target
		return {
			x: ( sx + tx ) / 2,
			y: ( sy + ty ) / 2,
		}
	}

	render() {
		this.renderHitRegion()
		this.showArrow && this.renderArrow()
	}

	renderHitRegion() {
		const { ctx } = this.getters
		ctx.save()
		ctx.fillStyle = this.fillColor
		ctx.fill( this.hitRegionPath2d )

		this.shouldSelect && renderHightlightedPath( ctx, this.hitRegionPath2d )

		ctx.restore()
	}

	renderArrow() {
		if ( this.showArrow ) {
			const { ctx } = this.getters
			ctx.save()
			ctx.fillStyle = this.fillColor
			ctx.fill( this.targetArrowPath2d )

			this.shouldSelect && renderHightlightedPath( ctx, this.targetArrowPath2d )

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

		const isContain: boolean = this.showArrow ?
			containeTargetArrow || containHitRigion :
			containHitRigion

		return isContain
	}

	updateSegments( segments: Segment[] ) {
		super.updateSegments( segments )

		const { length } = segments
		this.source = segments[ 0 ]
		this.target = segments[ length - 1 ]
	}

	translate( dx, dy ) {
		this.source.translate( dx, dy )
		this.target.translate( dx, dy )
	}

	translateTargetToPoint( point: Point2D ) {
		notNil( this.target ) && this.target.translateToPoint( point )
	}

	/**
	 * Remove line and segments
	 */
	forceRemove() {
		this.remove()
		this.actions.REMOVE_ELEMENTS( [ this.source, this.target ] )
	}
}
