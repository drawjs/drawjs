import { getRotatedPoint, isNotNil } from 'util/index';
import { MIN_SIZE_KX, MIN_SIZE_KY } from "../store/constant/index"

export default class SizeUtils {
	/**
	 *
	 * @param rotatedAngle The rotated angle of item
	 */
	static getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number,
		keepKX: boolean = false,
		keepKY: boolean = false,
	): SizeK {
		const { x, y } = getRotatedPoint( point, -rotatedAngle )
		const { x: px, y: py } = getRotatedPoint(
			potentialNewPoint,
			-rotatedAngle
		)
		const { x: cx, y: cy } = getRotatedPoint( center, -rotatedAngle )

		let newKX: number = kX
		let newKY: number = kY

		if ( !keepKX && isNotNil( kX ) && notOnCenterX( x, cx ) ) {
			const deltaX: number = px - cx
			const xLength: number = ( x - cx ) / kX
			newKX = deltaX / xLength

			newKX = newKX > MIN_SIZE_KX || newKX < 0 ? newKX : MIN_SIZE_KX
		}

		if ( !keepKY && isNotNil( kY ) && notOnCenterY( y, cy ) ) {
			const deltaY: number = py - cy
			const yLength: number = ( y - cy ) / kY
			newKY = deltaY / yLength

			newKY = newKY > MIN_SIZE_KY || newKY < 0 ? newKY : MIN_SIZE_KY
		}

		return {
			kX: newKX,
			kY: newKY
		}

		function notOnCenterX( x: number, cx: number ) {
			return x !== cx
		}

		function notOnCenterY( y: number, cy: number ) {
			return y !== cy
		}
	}
}
