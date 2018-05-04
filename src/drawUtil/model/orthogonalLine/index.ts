import Segment from '../../../model/Segment';

export function isNextCornerSegment( current: Segment, next: Segment ) {
	const { x: cx, y: cy } = current
	const { x: nx, y: ny } = next

	return ( cx === nx && cy !== ny ) || ( cy === ny && cx !== nx )
}

export const notNextCornerSegment = ( current: Segment, next: Segment ) => ! isNextCornerSegment( current, next )
