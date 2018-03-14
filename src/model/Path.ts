import Particle from "./Particle"
import Curve from "./Curve"
import Segment from "./Segment"
import Cell from "./Cell"
import bezierCurve from "../util/geometry/bezierCurve"

const { min, max } = Math

export default class Path extends Cell {
	segments: Segment[] = []
	curves: Curve[] = []

	/**
	 * Beizer variable, which determines curve's smooth degree
	 */
	t = 0.001

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
		const segmentsX = this.segments.map( ( { x } ) => x )
		const segmentsY = this.segments.map( ( { y } ) => y )

		const left = min( ...segmentsX )
		const right = max( ...segmentsX )
		const top = min( ...segmentsY )
		const bottom = max( ...segmentsY )
		const res: Point2D = {
			x: ( left + right ) / 2,
			y: ( top + bottom ) / 2
		}
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

	render() {
		console.log( this.bounds )

		const { ctx } = this.getters

		ctx.save()
		ctx.fillStyle = "#85392c"
		ctx.fill( this.path2d )
		ctx.restore()

		this.segments.map( this.sharedActions.renderParticle )
		this.curves.map( this.sharedActions.renderParticle )
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
