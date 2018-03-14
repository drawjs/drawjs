import Particle from "./Particle"
import Curve from "./Curve"
import Segment from './Segment';
import PathItem from "./PathItem"
import bezierCurve from "../util/geometry/bezierCurve"
import BoundsContainer from './tool/BoundsContainer';

const { min, max } = Math

export default class Path extends PathItem {
	segments: Segment[] = []
	curves: Curve[] = []

	/**
	 * Beizer variable, which determines curve's smooth degree
	 */
	t = 0.001

	boundsContainer: BoundsContainer

	constructor( props ) {
		super( props )

		const self = this

		this.segments = props.points.map( getSegment )

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

		this.curves = this.sharedGetters.getCurves( this.segments, this.draw )


		this.sharedActions.rotateSegments( this.segments, this.angle, this.segmentsCenter )

		this.boundsContainer = new BoundsContainer( {
			draw: this.draw,
			target: this
		} )

		function getSegment( { x, y } ) {
			return new Segment( {
				draw: props.draw,
				x,
				y,
				path: self
			} )
		}
	}

	get segmentsCenter(): Point2D {
		const res: Point2D = this.sharedGetters.getSegmentsCenter( this.segments )
		return res
	}

	get path2d(): Path2D {
		const path2d = this.sharedGetters.getPath2dByCurves( this.curves, this.t )
		return path2d
	}

	get bounds(): Bounds {
		const res: Bounds = this.sharedGetters.getBounds( this.curves )
		return res
	}

	get boundsCenter(): Point2D {
		const res: Point2D = this.sharedGetters.getBoundsCenter( this.bounds )
		return res
	}



	/**
	 * Bounds of path not rotated or sized
	 */
	get initialBounds(): Bounds {
		const res: Bounds = this.sharedGetters.getInitialBounds( this.curves, this.angle )
		return res
	}


	render() {
		const { ctx } = this.getters

		ctx.save()
		ctx.fillStyle = "#85392c"
		ctx.fill( this.path2d )
		ctx.restore()

		this.segments.map( this.sharedActions.renderParticle )
		this.curves.map( this.sharedActions.renderParticle )

		this.sizeContainer.render()
		// this.boundsContainer.render()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.sharedActions.translateSegments( this.segments, deltaX, deltaY )

		this.getters.draw.render()
	}
}
