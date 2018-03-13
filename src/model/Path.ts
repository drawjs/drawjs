import Particle from "./Particle"
import Curve from "./Curve"
import Segment from "./Segment"
import Cell from './Cell';
import bezierCurve from "../util/geometry/bezierCurve";

const { min, max } = Math

export default class Path extends Cell {
	segments: Segment[] = []
	curves: Curve[] = []

	constructor( props ) {
		super( props )

		this.segments = props.segments || this.segments

		this.sharedActions.ajustSegmentsPreviousAndNext( this.segments )

		this.curves = this.sharedGetters.getCurves( this.segments, this.draw )

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

	get path(): Path2D {
		let path = new Path2D()

		// path = bezierCurve( this.segments.map( ( { point } ) => point ) )

		return path
	}

	render() {
		// const { ctx } = this.getters

		// ctx.save()
		// ctx.strokeStyle = "blue"
		// ctx.stroke( this.path )
		// ctx.restore()

		// this.segments.map( this.sharedActions.renderParticle )
		// this.curves.map( this.sharedActions.renderParticle )

		this.segments[0].render()
		this.curves[0].render()
	}

	contain( x: number, y: number ) {
		return false
	}
}
