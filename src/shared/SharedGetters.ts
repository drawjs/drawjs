import Segment from '../model/Segment';
import Curve from "../model/Curve"
import MathPoint from '../model/math/MathPoint';
import MathVector from '../model/math/MathVector';
import { DEFAULT_LENGTH } from '../store/constant/index';
export default class SharedGetters {


	/**
	 * // Segments
	 */
	getCurves( segments: Segment[], draw ): Curve[] {
		const { length } = segments

		if ( length <= 1 ) {
			return []
		}

		let curves: Curve[] = []

		for ( let i = 0; i < length; i++ ) {
			const segment1: Segment = segments[ i ]
			const segment2: Segment = isLastIndex( i ) ?
				segments[ 0 ] :
				segments[ i + 1 ]

			const curve: Curve = new Curve( {
				draw,
				segment1,
				segment2
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
	getPerpHandlePoint( prevSegemnt: Segment, segment1: Segment, segment2: Segment, length: number = DEFAULT_LENGTH ): Point2D {
		const A: Point2D = prevSegemnt.point
		const B: Point2D = segment1.point
		const C: Point2D = segment2.point

		// Center
		const D: MathPoint = new MathPoint( ( A.x + B.x ) / 2, ( A.y + B.y ) / 2 )
		// Pedal
		const E: MathPoint = new MathPoint( C.x, C.y )

		const ED: MathVector = new MathVector( E, D )

		const EF: MathVector = ED.rotate( -90 )
		const UnitEF: MathVector = EF.unit

		// New point after EF was rotated
		const F: Point2D = {
			x: E.x - length * UnitEF.x,
			y: E.y - length * UnitEF.y,
		}

		return F
	}
}
