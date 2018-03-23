import MathVector from "util/math/MathVector"
import { cloneDeep } from "lodash"
import { getRotatedPoint } from "util/index"

interface RotatableBounds {
	leftTop: Point2D
	rightTop: Point2D
	rightBottom: Point2D
	leftBottom: Point2D
}

export default function(
	source: Point2D,
	target: Point2D,
	space: number
): RotatableBounds {
	let clonedSource: Point2D = cloneDeep( source )
	let clonedTarget: Point2D = cloneDeep( target )


	let S = clonedSource
	let T = clonedTarget

	/**
	 * Reversely rotated T
	 */
	let R: Point2D

	/**
	 * Angle that can ensure R(rotated T) is on the right of S
	 */
	let angle: number

	let basicLeftTop: Point2D
	let basicRightTop: Point2D
	let basicRightBottom: Point2D
	let basicLeftBottom: Point2D

	let leftTop: Point2D
	let rightTop: Point2D
	let rightBottom: Point2D
	let leftBottom: Point2D

	// Bese on source point
	const ST: MathVector = new MathVector( S, T )
	angle = ST.angle

	R = getRotatedPoint( T, -angle, S )

	const { x: sx, y: sy }: Point2D = S
	const { x: rx, y: ry }: Point2D = R

	basicLeftTop = {
		x: sx - space,
		y: sy - space
	}

	basicRightTop = {
		x: rx + space,
		y: ry - space
	}

	basicRightBottom = {
		x: rx + space,
		y: ry + space
	}

	basicLeftBottom = {
		x: sx - space,
		y: sy + space
	}

	leftTop = getRotatedPoint( basicLeftTop, angle, S )
	rightTop = getRotatedPoint( basicRightTop, angle, S )
	rightBottom = getRotatedPoint( basicRightBottom, angle, S )
	leftBottom = getRotatedPoint( basicLeftBottom, angle, S )

	const res: RotatableBounds = {
		leftTop,
		rightTop,
		rightBottom,
		leftBottom
	}

	return res
}
