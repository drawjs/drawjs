import { MIN_SIZE_KX, MIN_SIZE_KY } from "../../store/constant/index";

export default class SizeUtils {
	static getNewK(
		kX: number,
		kY: number,
		leftTopPoint: Point2D,
		potentialNewLeftTopPoint: Point2D,
		center: Point2D,
		angle: number = 0
	): SizeK {
		const { x, y } = leftTopPoint
		const { x: px, y: py } = potentialNewLeftTopPoint
		const { x: cx, y: cy } = center

		let newKX: number = 0
		let newKY: number = 0

		const radian: number = angle * Math.PI / 180

		if ( notOnCenterX( x, cx ) ) {
			const deltaX: number = px - cx
			const xLength: number = ( x - cx ) / kX
			newKX = deltaX / xLength

			newKX = ( newKX > MIN_SIZE_KX || newKX < 0 )? newKX : MIN_SIZE_KX
		}

		if ( notOnCenterY( y, cy ) ) {
			const deltaY: number = py - cy
			const yLength: number = ( y - cy ) / kY
			newKY = deltaY / yLength * Math.cos( radian )

			newKY = ( newKY > MIN_SIZE_KY || newKY < 0 ) ? newKY : MIN_SIZE_KY
		}

		return {
			kX: 1,
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
