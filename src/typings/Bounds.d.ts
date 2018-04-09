interface Bounds {
	left: number
	right: number
	top: number
	bottom: number
}

interface BoundsExtra {
	left: number
	right: number
	top: number
	bottom: number
	leftCenter: Point2D
	topCenter: Point2D
	rightCenter: Point2D
	bottomCenter: Point2D,
	width: number,
	height: number,
}

interface RotatableBounds {
	leftTop: Point2D
	rightTop: Point2D
	rightBottom: Point2D
	leftBottom: Point2D
}
