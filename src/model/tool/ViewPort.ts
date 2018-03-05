import getters from "store/draw/getters"
import zoomPoint from "util/geometry/zoom"

const { abs } = Math

/**
 * View port
 * For that canvas is always fixed, and the origin is always ( 0, 0 ),
 * so if we want a convenient viewPort, we have to mock canvas view
 * port used for zooming and panning calculation.
 *
 * Canvas dom is the initial view port(Like initial transfomable rectange)
 * After panned or zoomed, view port(rectangle) would zoom and pan.
 *
 * We can calculate the change of every tranformed point's position on
 * canvas based on tranformed view port's two key points:
 * 1. the left top vertex of canvas
 * 2. the center point of canvas
 */
export default class ViewPort {
	/**
	 * Zoom rate
	 */
	zoom: number = 1


	/**
	 * Used to calculate the change of every point's position on
	 * canvas after view port is zoomed and panned
	 */
	leftTop: Point2D = {
		x: 0,
		y: 0
	}
	/**
	 * Used to calculate the change of every point's position on
	 * canvas after view port is zoomed and panned
	 */
	center: Point2D

	get basicLeftTop(): Point2D {
		return {
			x: 0,
			y: 0
		}
	}


	get basicWidth(): number {
		const width: number = getters.canvasWidth
		return width
	}

	get basicHeight(): number {
		const height: number = getters.canvasHeight
		return height
	}

	get width(): number {
		const width: number = abs( ( this.leftTop.x - this.center.x ) * 2 )
		return width
	}

	get height(): number {
		const height: number = abs( ( this.leftTop.y - this.center.y ) * 2 )
		return height
	}

	/**
	 * The movement of viewPort when zoom equals 1
	 */
	get pan(): Point2D {
		const { leftTop, center, zoom, basicLeftTop } = this
		const res: Point2D =  {
			x: leftTop.x / zoom - basicLeftTop.x,
			y: leftTop.y / zoom - basicLeftTop.y,
		}
		return res
	}

	constructor() {
		const { canvasWidth, canvasHeight } = getters

		this.center = {
			x: canvasWidth / 2,
			y: canvasHeight / 2
		}
	}

	zoomBy(
		center: Point2D = {
			x: 0,
			y: 0
		},
		deltaZoom: number
	) {
		this.zoom = this.zoom + deltaZoom

		const { leftTop, center: viewPortCenter, zoom } = this

		this.leftTop = zoomPoint( leftTop, zoom, center )
		this.center = zoomPoint( viewPortCenter, zoom, center )
	}

	panBy( deltaX: number, deltaY: number ) {
		const { x: leftTopX, y: leftTopY }: Point2D = this.leftTop
		this.leftTop = {
			x: leftTopX + deltaX,
			y: leftTopY + deltaY
		}

		const { x: centerX, y: centerY }: Point2D = this.center
		this.center = {
			x: centerX + deltaX,
			y: centerY + deltaY
		}
	}
}
