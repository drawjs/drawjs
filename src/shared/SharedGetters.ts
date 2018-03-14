import Segment from "../model/Segment"
import Curve from "../model/Curve"
import MathPoint from "../model/math/MathPoint"
import MathVector from "../model/math/MathVector"
import { DEFAULT_LENGTH } from "../store/constant/index"
import Path from "../model/Path"
import bezierCurve from "../util/geometry/bezierCurve"
import { isNil } from "lodash"
import rotatePoints from "../util/geometry/rotatePoints"

const { PI, min, max } = Math
export default class SharedGetters {
	/**
	 * // Segment
	 */
	getCurves( segments: Segment[], draw ): Curve[] {
		const { length } = segments

		if ( length <= 1 ) {
			return []
		}

		let curves: Curve[] = []
		const path: Path = segments[ 0 ].path

		for ( let i = 0; i < length; i++ ) {
			const segment1: Segment = segments[ i ]
			const segment2: Segment = isLastIndex( i ) ?
				segments[ 0 ] :
				segments[ i + 1 ]

			const curve: Curve = new Curve( {
				draw,
				segment1,
				segment2,
				path
			} )

			curves.push( curve )
		}

		return curves

		function isLastIndex( i ) {
			const lastIndex = length - 1
			return i === lastIndex
		}
	}

	/**
	 * // Curve
	 */
	getPerpHandleRelativePoint(
		prevSegemnt: Segment,
		segment: Segment,
		nextSegment: Segment,
		length: number = DEFAULT_LENGTH
	): Point2D {
		const A: Point2D = new MathPoint(
			prevSegemnt.point.x,
			prevSegemnt.point.y
		)
		const B: Point2D = new MathPoint(
			nextSegment.point.x,
			nextSegment.point.y
		)

		// Center
		const C: MathPoint = new MathPoint( ( A.x + B.x ) / 2, ( A.y + B.y ) / 2 )
		// Pedal
		const P: MathPoint = new MathPoint( segment.x, segment.y )

		const angle = true ? -90 : 90

		const PC: MathVector = new MathVector( P, C )

		const PD: MathVector = PC.rotate( angle )
		const UnitPD: MathVector = PD.unit

		// New point after PD was rotated
		const res: Point2D = {
			x: length * UnitPD.x,
			y: length * UnitPD.y
		}

		return res

		function isClockWise( A: Point2D, B: Point2D, P: Point2D ): boolean {
			const AB: MathVector = new MathVector( A, B )
			const AP: MathVector = new MathVector( A, P )

			const deltaAngle: number = ( AB.angle || 360 ) - ( AP.angle || 360 )
			return deltaAngle >= 0
		}
	}

	/**
	 * // Path
	 */
	getPath2dByCurves( curves: Curve[], t = 1 ) {
		let path2d = new Path2D()

		curves.map( resolve )

		function resolve( curve: Curve, index: number ) {
			const { handle1, handle2, segment1, segment2 } = curve

			if ( isFirst( index ) ) {
				path2d.moveTo( segment1.x, segment1.y )
			}

			bezierCurve( [ segment1, handle1, handle2, segment2 ], t, path2d )
			// path2d.bezierCurveTo( handle1.x, handle1.y, handle2.x, handle2.y, segment2.x, segment2.y )
		}

		return path2d

		function isFirst( index ) {
			return index === 0
		}
	}

	getBounds( curves: Curve[] ): Bounds {
		let left: number
		let right: number
		let top: number
		let bottom: number

		curves.map( resolve )

		function resolve( { bounds }: Curve ) {
			const { left: l, right: r, top: t, bottom: b } = bounds

			left = isNil( left ) ? l : left
			right = isNil( right ) ? r : right
			top = isNil( top ) ? t : top
			bottom = isNil( bottom ) ? b : bottom

			if ( l < left ) {
				left = l
			}

			if ( r > right ) {
				right = r
			}

			if ( t < top ) {
				top = t
			}

			if ( b > bottom ) {
				bottom = b
			}
		}

		const res: Bounds = {
			left,
			right,
			top,
			bottom
		}

		return res
	}
	/**
	 * Get bounds of path not rotated or sized
	 */
	getSegmentsCenter( segments: Segment[] ): Point2D {
		const segmentsX = segments.map( ( { x } ) => x )
		const segmentsY = segments.map( ( { y } ) => y )

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
	getInitialBounds( curves: Curve[], angle: number ): Bounds {
		let left: number
		let right: number
		let top: number
		let bottom: number

		curves.map( resolve )

		function resolve( { initialBounds }: Curve ) {
			const { left: l, right: r, top: t, bottom: b } = initialBounds

			left = isNil( left ) ? l : left
			right = isNil( right ) ? r : right
			top = isNil( top ) ? t : top
			bottom = isNil( bottom ) ? b : bottom

			if ( l < left ) {
				left = l
			}

			if ( r > right ) {
				right = r
			}

			if ( t < top ) {
				top = t
			}

			if ( b > bottom ) {
				bottom = b
			}
		}

		const res: Bounds = {
			left,
			right,
			top,
			bottom
		}

		return res
	}

	/**
	 * // Bounds
	 */
	getBoundsCenter( bounds: Bounds ): Point2D {
		const { left, right, top, bottom } = bounds
		const res: Point2D = {
			x: ( left + right ) / 2,
			y: ( top + bottom ) / 2
		}
		return res
	}
}
