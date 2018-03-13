import Segment from "../model/Segment"
import Curve from "../model/Curve"
import MathPoint from '../model/math/MathPoint';
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
}
