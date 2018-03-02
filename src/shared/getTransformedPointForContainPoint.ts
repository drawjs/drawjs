import { getRotatedPoint } from "util/index"
import * as _ from "lodash"
import { SIZE_POINT, ROTATE_ARROW } from 'store/constant/cellType';

/**
 * Get the point
 * which was tansformed or rotated reversely and
 * was related to context origin of coordinate,
 * when relevant context was rotated or transformed,
 * to match original path
 */
export default function getTransformedPointForContainPoint(
	point,
	instance
): Point2D {
	let res: Point2D = instance.draw.zoomPan.transformPointReversely( point )

	res = {
		x: res.x - instance.originX,
		y: res.y - instance.originY
	}

	if ( existAngle() ) {
		const angle: number = getAngle()
		res = getRotatedPoint( res,  angle)
	}

	return res

	function existAngle() {
		const angle: number = getAngle()
		const res = !_.isNil( angle )
		return res
	}

	function isSizePoint(): boolean {
		return instance.type === SIZE_POINT
	}

	function isRotateIcon(): boolean {
		return instance.type === ROTATE_ARROW
	}

	function getAngle(): number {
		let angle: number = null
		const isTool = isSizePoint() || isRotateIcon()
		if ( isTool ) {
			angle = -instance.instance.angle
		}
		if ( ! isTool ) {
			if ( !_.isNil( instance.angle ) ) {
				angle = -instance.angle
			}
		}
		return angle
	}
}
