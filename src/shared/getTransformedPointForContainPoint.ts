import { Point } from "interface/index"
import { getRotatedPoint } from "util/index"
import * as _ from "lodash"
import { SIZE_POINT, ROTATE_ICON } from 'store/constant_cellTypeList';

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
): Point {
	let res: Point = instance.draw.zoomPan.transformPointReversely( point )

	res = {
		x: res.x - instance.originX,
		y: res.y - instance.originY
	}

	if ( isInstanceHasAngle ) {
		const angle: number = getAngle()
		res = getRotatedPoint( res,  angle)
	}

	return res

	function isInstanceHasAngle() {
		const angle: number = getAngle()
		const res = !_.isNil( angle )
		return res
	}

	function isSizePoint(): boolean {
		return instance.type === SIZE_POINT
	}

	function isRotateIcon(): boolean {
		return instance.type === ROTATE_ICON
	}

	function getAngle(): number {
		let angle: number
		const isTool = isSizePoint() || isRotateIcon()
		if ( isTool ) {
			angle = -instance.instance.angle
		}
		if ( ! isTool ) {
			angle = -instance.angle
		}
		return angle
	}
}
