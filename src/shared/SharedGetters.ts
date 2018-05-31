import Segment from "../model/Segment"
import Curve from "../model/Curve"
import MathPoint from "../util/math/MathPoint"
import MathVector from "../util/math/MathVector"
import { DEFAULT_LENGTH } from "../store/constant/index"
import Path from '../model/Path';
import bezierCurve from "../util/geometry/bezierCurve"
import { isNil } from "lodash"
import rotatePoints from "../util/geometry/rotatePoints"
import getPointsBoundsCenter from "../util/geometry/getPointsBoundsCenter"
import origin from "../util/geometry/origin"
import rotate from "../util/geometry/rotate"
import getBizerCurveBounds from "../util/geometry/checkBezierCurveBounds"
import { isNotNil } from "util/index"
import Draw from 'Draw';
import { isLast } from '../util/js/array';

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
	getSegmentsCenter( segments: Segment[] ): Point2D {
		const res: Point2D = getPointsBoundsCenter( segments )
		return res
	}
	createSegmentByPoint( point: Point2D, draw: Draw, segmentProps: any = {}) {
		const { x, y }: Point2D = point
		const segment: Segment = new Segment( {
			draw: draw,
			x,
			y,
			...segmentProps
		} )

		return segment
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
	 * Get curve's initial bounds,
	 * which rotates -`path.angle` on origin( { x: 0, y: 0 } )
	 * for caclulating path's item center
	 */
	getCurveInitialBounds( curve: Curve ): Bounds {
		const { handle1Point, handle2Point, point1, point2 } = curve
		const { angle } = curve.path
		const radian = -angle * PI / 180
		const rotated1: Point2D = rotate( point1, radian, origin )
		const rotated2: Point2D = rotate( handle1Point, radian, origin )
		const rotated3: Point2D = rotate( handle2Point, radian, origin )
		const rotated4: Point2D = rotate( point2, radian, origin )

		const res: Bounds = getBizerCurveBounds(
			rotated1,
			rotated2,
			rotated3,
			rotated4
		)
		return res
	}

	/**
	 * // Path
	 */
	getPath2dByCurves( curves: Curve[] ) {
		let path2d = new Path2D()

		curves.map( resolve )

		function resolve( curve: Curve, index: number ) {
			const { handle1, handle2, segment1, segment2, useCanvasCurve, t } = curve

			if ( isFirst( index ) ) {
				path2d.moveTo( segment1.x, segment1.y )
			}

			!useCanvasCurve && bezierCurve( [ segment1, handle1, handle2, segment2 ], t, path2d )
			useCanvasCurve && path2d.bezierCurveTo( handle1.x, handle1.y, handle2.x, handle2.y, segment2.x, segment2.y )
		}

		return path2d

		function isFirst( index ) {
			return index === 0
		}
	}

	/**
	 * Initial bounds,
	 * which rotates -`path.angle` on origin( { x: 0, y: 0 } )
	 * for caclulating path's item center
	 */
	getPathInitialBounds( curves: Curve[] ): Bounds {
		const self = this

		let left: number
		let right: number
		let top: number
		let bottom: number

		curves.map( resolve )

		function resolve( curve: Curve ) {
			const initialBounds: Bounds = self.getCurveInitialBounds( curve )
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
	 * Path item center,
	 * which rotates `path.angle` on origin( { x: 0, y: 0 } )
	 */
	getPathItemCenter( path: Path ): Point2D {
		const { curves, radian } = path
		const initialBounds: Bounds = this.getPathInitialBounds( curves )
		const center: Point2D = this.getBoundsCenter( initialBounds )
		const rotated: Point2D = rotate( center, radian, origin )
		return rotated
	}

	/**
	 * Get bounds of path not rotated or sized
	 */
	getPathBounds( curves: Curve[] ): Bounds {
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

	getTranslatedBounds( bounds: Bounds, x: number, y: number ) {
		const { left, top, right, bottom } = bounds
		const res: Bounds = {
			left  : left + x,
			right : right + x,
			top   : top + y,
			bottom: bottom + y
		}
		return res
	}

	/**
	 * // Point
	 */
	getMultipiedPoint( point: Point2D, a: number, b?: number ) {
		if ( isNil( b ) ) {
			b = a
		}
		const { x, y } = point
		return {
			x: x * a,
			y: y * b
		}
	}

	getTranslatedPoint( point: Point2D, deltaX: number, deltaY: number ) {
		const { x, y }: Point2D = point
		const newPoint: Point2D = {
			x: x + deltaX,
			y: y + deltaY
		}
		return newPoint
	}

	/**
	 * Polyline
	 */
	getTwoPointsLine( points: Point2D[] ): TwoPointsLineType[] {
		const { length } = points
		let res: TwoPointsLineType[] = []

		if ( length >= 2 ) {
			points.map( resolve )
		}

		return res

		function resolve( point: Point2D, index: number, points: Point2D[] ) {
			if ( ! isLast( index, points ) ) {
				const twoPointsLine: TwoPointsLineType = {
					source: point,
					target: points[ index + 1 ]
				}
				res.push( twoPointsLine )
			}
		}

		function isFirst( index ) {
			return index === 0
		}
	}
}
