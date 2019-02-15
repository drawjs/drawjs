import { isNotNil } from "./index"

export default function getRectPoints( {
		left,
		top,
		right,
		bottom,
		width,
		height
	}: {
		left: number
		top: number
		right?: number
		bottom?: number
		width?: number
		height?: number
	} ): RectPoints {
		right = isNotNil( right ) ? right : left + width
		bottom = isNotNil( bottom ) ? bottom : top + height

		const leftTop: Point2D = {
			x: left,
			y: top
		}

		const rightTop: Point2D = {
			x: right,
			y: top
		}

		const rightBottom: Point2D = {
			x: right,
			y: bottom
		}

		const leftBottom: Point2D = {
			x: left,
			y: bottom
		}

		const topCenter: Point2D = {
			x: ( left + right ) / 2,
			y: top
		}
		const rightCenter: Point2D = {
			x: right,
			y: ( top + bottom ) / 2
		}
		const bottomCenter: Point2D = {
			x: ( left + right ) / 2,
			y: bottom
		}
		const leftCenter: Point2D = {
			x: left,
			y: ( top + bottom ) / 2
		}

		const rectPoints: RectPoints = {
			leftTop,
			rightTop,
			rightBottom,
			leftBottom,
			topCenter,
			rightCenter,
			bottomCenter,
			leftCenter,
			cornerPoints: [
				leftTop,
				rightTop,
				rightBottom,
				leftBottom
			]
		}

		return rectPoints
	}


	export function getReactCornerPoints( props: any ) {
		return getRectPoints( props ).cornerPoints
	}