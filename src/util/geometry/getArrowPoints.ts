import MathVector from "../../util/math/MathVector"
import { getRotatedPoint } from "../../util/index"
import { clonePoint } from '../js/clone';

/**
 *     #  top
 *       ###
 *  left  ####  right
 *       ###
 *     #  bottom
 */
interface ArrowType {
	top: Point2D
	left: Point2D
	bottom: Point2D
	right: Point2D
}

export default function(
	source: Point2D,
	target: Point2D,
	size: number = 20
): ArrowType {
	let clonedSource: Point2D = clonePoint( source )
	let clonedTarget: Point2D = clonePoint( target )

	// Ensure source is on the left
	let S: Point2D = clonedSource
	let T: Point2D = clonedTarget

	/**
	 * Reversely rotated T
	 */
	let R: Point2D

	/**
	 * Angle that can ensure R(rotated T) is on the right of S
	 */
	let angle: number

	let basicTop: Point2D
	let basicLeft: Point2D
	let basicBottom: Point2D

	/**
	 * Top point of arrow
	 */
	let top: Point2D
	/**
	 * Left point of arrow
	 */
	let left: Point2D
	/**
	 * Bottom point of arrow
	 */
	let bottom: Point2D

	// Bese on source point
	const ST: MathVector = new MathVector( S, T )
	angle = ST.angle


	R = getRotatedPoint( T, -angle, S )

	const { x: rx, y: ry }: Point2D = R

	basicTop = {
		x: rx - size,
		y: ry - size / 2
	}

	basicLeft = {
		x: rx - size * 4 / 5,
		y: ry
	}

	basicBottom = {
		x: rx - size,
		y: ry + size / 2
	}

	top = getRotatedPoint( basicTop, angle, S )
	left = getRotatedPoint( basicLeft, angle, S )
	bottom = getRotatedPoint( basicBottom, angle, S )

	const res: ArrowType = {
		top,
		right: T,
		bottom,
		left
	}
	return res
}
