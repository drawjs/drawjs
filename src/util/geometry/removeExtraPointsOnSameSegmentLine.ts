import { isLast, isFirst } from '../array';
import MathVector from '../math/MathVector';
import isPointOnSegmemtLine from './isPointOnSegmemtLine';
import { cloneDeep } from 'lodash';
/**
 * Remove points that are on a same segment line which it's next point is on.
 */
export default function ( points: Point2D[] ) {
	let res: Point2D[] = cloneDeep( points )

	const { length }: Point2D[] = points

	if ( length > 2 ) {
		res = res.filter( notRemove )
	}

	return res

	function notRemove( point: Point2D, index: number, points: Point2D[] ) {
		let res: boolean = true
		const { length }: Point2D[] = points

		if ( ! isFirst( index ) && ! isLast( index, length ) ) {
			const prev: Point2D = points[ index - 1 ]
			const next: Point2D = points[ index + 1 ]

			if ( isPointOnSegmemtLine( point, [ prev, next ] ) ) {
				res = false
			}
		}

		return res
	}
}
