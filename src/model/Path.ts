import Particle from "./Particle"
import Curve from "./Curve"
import Segment from "./Segment"
import PathItem from "./PathItem"
import bezierCurve from "../util/geometry/bezierCurve"
import BoundsContainer from "./tool/BoundsContainer"
import rotate from "../util/geometry/rotate"
import distance from "../util/geometry/distance"
import origin from "../util/geometry/origin"
import getRotatedPoint from "../util/getRotatedPoint"
import { isNil } from "lodash"
import isNotNil from "../util/isNotNil"
import sizePoint from "../util/geometry/sizePoint"
import { notUndefined, notNil } from '../util/lodash/index';

const { min, max } = Math

export default class Path extends PathItem {
	segments: Segment[] = []
	curves: Curve[] = []

	/**
	 * Beizer variable, which determines curve's smooth degree
	 */
	t = 0.001

	boundsContainer: BoundsContainer

	fillColor: string = "#8cccf0"
	borderColor: string = null
	borderWidth: number = 1

	constructor( props ) {
		super( props )

		const self = this
		let segments = this.segments || []

		if ( isNotNil( props.segments ) ) {
			segments = props.segments
		}

		this.fillColor = notUndefined( props.fillColor ) ? props.fillColor : this.fillColor
		this.borderColor = notUndefined( props.borderColor ) ? props.borderColor : this.borderColor
		this.borderWidth = notUndefined( props.borderWidth ) ? props.borderWidth : this.borderWidth

		if ( isNil( props.segments ) ) {
			segments = isNotNil( props.points ) ?
				props.points.map( point =>
						this.sharedGetters.createSegmentByPoint(
							point,
							this.draw,
							{ path: this }
						)
				  ) :
				this.segments
		}

		this.updateSegments( segments )

		this.boundsContainer = new BoundsContainer( {
			draw  : this.draw,
			target: this
		} )

		isNotNil( props.angle ) && this.rotate( props.angle )

		this.implementInUpperConstructor()

		if ( isNotNil( props.kX ) || isNotNil( props.kY ) ) {
			const kX: number = isNotNil( props.kX ) ? props.kX : this.kX
			const kY: number = isNotNil( props.kY ) ? props.kY : this.kY

			this.size( props.kX, props.kY, this.itemCenter )
		}
	}

	implementInUpperConstructor() {
		super.implementInUpperConstructor && super.implementInUpperConstructor()
	}

	get segmentsCenter(): Point2D {
		const res: Point2D = this.sharedGetters.getSegmentsCenter( this.segments )
		return res
	}

	get path2d(): Path2D {
		const path2d = this.sharedGetters.getPath2dByCurves( this.curves, this.t )
		return path2d
	}

	/**
	 * Real-time and absolute bounds(with no rotation)
	 */
	get bounds(): Bounds {
		const res: Bounds = this.sharedGetters.getPathBounds( this.curves )
		return res
	}

	/**
	 * Initial bounds,
	 * which rotates -`path.angle` on origin( { x: 0, y: 0 } )
	 * for caclulating path's item center
	 */
	get initialBounds(): Bounds {
		const res: Bounds = this.sharedGetters.getPathInitialBounds( this.curves )
		return res
	}

	get itemCenter(): Point2D {
		return this.sharedGetters.getPathItemCenter( this )
	}

	get itemInitialBounds(): Bounds {
		const { itemCenter } = this
		const { x, y } = itemCenter
		const rotated: Point2D = rotate( itemCenter, -this.radian, origin )

		const deltaX: number = itemCenter.x - rotated.x
		const deltaY: number = itemCenter.y - rotated.y

		const bounds: Bounds = this.sharedGetters.getTranslatedBounds(
			this.initialBounds,
			deltaX,
			deltaY
		)
		return bounds
	}

	get points(): Point2D[] {
		const res: Point2D[] = this.segments.map( ( { point } ) => point )
		return res
	}

	render() {
		const { ctx } = this.getters
		const { fillColor, borderColor, borderWidth } = this

		ctx.save()

		if ( notNil( fillColor ) ) {
			ctx.fillStyle = notUndefined( fillColor ) ? fillColor : "#8cccf0"
			ctx.fill( this.path2d )
		}


		if ( notNil( borderColor ) ) {
			ctx.strokeStyle = borderColor
			ctx.lineWidth = borderWidth
			ctx.stroke( this.path2d )
		}

		ctx.restore()

		this.segments.map( this.sharedActions.renderParticle )
		this.curves.map( this.sharedActions.renderParticle )

		this.renderTransformWidget()
		// this.boundsContainer.render()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const deltaX = this.dragger.getDeltaXToPrevPoint( point )
			const deltaY = this.dragger.getDeltaYToPrevPoint( point )

			this.sharedActions.translateSegments( this.segments, deltaX, deltaY )
		}
	}

	/**
	 * Rotate
	 */
	rotate( angle: number ) {
		const deltaAngle: number = angle - this.angle

		this.sharedActions.rotateSegments(
			this.segments,
			deltaAngle,
			this.itemCenter
		)

		this.draw.render()

		this.prevAngle = this.angle
		this.angle = angle
	}

	/**
	 * Size
	 */
	size( kX: number, kY: number, center: Point2D ) {
		const deltaKX: number = kX - this.kX
		const deltaKY: number = kY - this.kY

		const newKX: number = this.kX === 0 ? 0 : kX / this.kX
		const newKY: number = this.kY === 0 ? 0 : kY / this.kY

		this.sharedActions.sizeSegments( this.segments, newKX, newKY, center )

		this.prevKX = this.kX
		this.kX = kX

		this.prevKY = this.kY
		this.kY = kY
	}

	updateSegments( segments: Segment[] ) {
		// this.actions.REMOVE_ELEMENTS( this.segments )
		this.segments = segments

		this.sharedActions.ajustSegmentsPreviousAndNext( this.segments )

		this.segments.map( segment => {
			const newHandleRelativePoint = this.sharedGetters.getPerpHandleRelativePoint(
				segment.previous,
				segment,
				segment.next
			)

			this.sharedActions.updateHandleRelativePoint(
				segment.handleOut,
				newHandleRelativePoint
			)

			this.sharedActions.adjustHandleParterPoint( segment.handleOut )
		} )

		this.actions.REMOVE_ELEMENTS( this.curves )
		this.curves = this.sharedGetters.getCurves( this.segments, this.draw )
	}



	/**
	 * // Translate
	 */
	translate( dx: number, dy: number ) {
		this.sharedActions.translateSegments( this.segments, dx, dy )
	}
	translateTo( x: number, y: number ) {
		const { x: cx, y: cy } = this.itemCenter
		const dx: number = x - cx
		const dy: number = y - cy
		this.sharedActions.translateSegments( this.segments, dx, dy )
	}
	translateToPoint( point: Point2D ) {
		this.translateTo( point.x, point.y )
	}
}
