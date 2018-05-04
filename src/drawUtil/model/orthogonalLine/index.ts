import Segment from '../../../model/Segment';
import { SEGMENT } from "../../../store/constant/cellType"
import { notFirst, notLast, isFirst, isLast, notFirstElement, notLastElement } from '../../../util/js/array';
import OrthogonalLine from '../../../model/shape/OrthogonalLine/OrthogonalLine';
import Line from '../../../model/shape/Line';
import { notNil } from '../../../util/lodash/index';
import { isNil } from 'lodash';
import StartSegment from '../../../model/shape/OrthogonalLine/StartSegment';
import EndSegment from '../../../model/shape/OrthogonalLine/EndSegment';

/**
 * // Constructor
 */
export function initialize( classObject: OrthogonalLine, props ) {

}

export function mapCreateSegmentInConstructor( classObject: OrthogonalLine ) {
	return ( point: Point2D, index: number, array: any[] ) => {
		if ( isFirst( index ) ) {
			return classObject.createStartSegment( point )
		}

		if ( isLast( index, array ) ) {
			return classObject.createEndSegment( point )
		}

		return classObject.createCornerSegment( point )
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

export function isLineVertical( line: Line ) {
	const { source, target }: Line = line
	const { x: sx, y: sy } = source
	const { x: tx, y: ty } = target

	return sx === tx
}

export function isLineHorizontal( line: Line ) {
	const { source, target }: Line = line
	const { x: sx, y: sy } = source
	const { x: tx, y: ty } = target

	return sy === ty
}
