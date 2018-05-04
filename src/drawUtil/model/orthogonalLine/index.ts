import Segment from "../../../model/Segment"
import { SEGMENT } from "../../../store/constant/cellType"
import { notFirst, notLast } from "../../../util/js/array"
import OrthogonalLine from '../../../model/shape/OrthogonalLine';

/**
 * // Constructor
 */
export function mapCreateSegmentInConstructor( classObject: OrthogonalLine ) {
	return ( point: Point2D, index: number, array: any[] ) => {
		const isCornerIndex = notFirst( index ) && notLast( index, array )
		return isCornerIndex ? classObject.createCornerSegment( point ) : classObject.createSegment( point )
	}
}

/**
 * // General
 */
export function isNextCornerSegment( current: Segment, next: Segment ) {
	const { x: cx, y: cy } = current
	const { x: nx, y: ny } = next

	return ( cx === nx && cy !== ny ) || ( cy === ny && cx !== nx )
}

export const notNextCornerSegment = ( current: Segment, next: Segment ) =>
	!isNextCornerSegment( current, next )
