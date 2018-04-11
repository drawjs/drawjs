import { isLast, isFirst } from "../array"
import MathVector from "../math/MathVector"
import isPointOnSegmemtLine from "./isPointOnSegmemtLine"
import { cloneDeep } from "lodash"
import isPointEqual from "./isPointEqual"
/**
 * Remove points that are on a same segment line which it's next point is on.
 */
export default function( points: Point2D[] ) {
	let res: Point2D[] = cloneDeep( points )
	let prevNotRepeated: Point2D

	const { length }: Point2D[] = points

	if ( length > 2 ) {
		res = res.filter( notRemove )
	}

	return res

	function notRemove( point: Point2D, index: number, points: Point2D[] ) {
		let res: boolean = true
		const { length }: Point2D[] = points

		if ( isFirst( index ) ) {
			prevNotRepeated = point
		}

		if ( !isFirst( index ) && !isLast( index, length ) ) {
			const prev: Point2D = points[ index - 1 ]
			const next: Point2D = points[ index + 1 ]

			if ( isPointEqual( point, next ) ) {
				res = false
			}

			if ( !isPointEqual( point, next ) ) {
				if ( isPointOnSegmemtLine( point, [ prevNotRepeated, next ] ) ) {
					res = false
				}

				prevNotRepeated = point
			}
		}

		return res
	}
}