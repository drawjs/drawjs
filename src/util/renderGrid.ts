import { Point } from "interface/index"
import log from "./log"
import Draw from "../Draw"

export default function renderGrid(
	draw: Draw,
	width: number,
	height: number,
	origin: Point = { x: 0, y: 0 },
	gridZoom: number = 1
) {
	const ctx = draw.canvas.getContext( "2d" )
	const spaceSmall = 10 * gridZoom
	const spaceBig = 50 * gridZoom

	renderGridBySpace( spaceSmall, () => {
		ctx.setLineDash( [ 2, 1 ] )
		ctx.strokeStyle = "#ddd"
	} )
	renderGridBySpace( spaceBig, () => {
		ctx.strokeStyle = "#aaa"
	} )

	function renderGridBySpace( space: number, beforeStrokeFn?: Function ) {
		let path = new Path2D()
		const zoomedSpace = space * draw.zoomPan.zoom
		const spaceDeltaX = getSpaceDeltaX( zoomedSpace )
		const spaceDeltaY = getSpaceDeltaY( zoomedSpace )

		ctx.save()
		ctx.translate( origin.x, origin.y )

		/**
		 * Draw vertical lines
		 */
		for ( let i = 0, x = 0; x < width; i++ ) {
			x = i * zoomedSpace
			path.moveTo( x + spaceDeltaX, 0 )
			path.lineTo( x + spaceDeltaX, height )
		}
		/**
		 * Draw horizontal lines
		 */
		for ( let i = 0, y = 0; y < height; i++ ) {
			y = i * zoomedSpace
			path.moveTo( 0, y + spaceDeltaY )
			path.lineTo( width, y + spaceDeltaY )
		}

		ctx.lineWidth = 1
		ctx.strokeStyle = "grey"
		beforeStrokeFn && beforeStrokeFn()
		ctx.stroke( path )

		ctx.restore()
	}

	function originX() {
		return 0
	}

	function originY() {
		return 0
	}

	function getSpaceDeltaX( zoomedSpace ) {
		const res =
			( zoomedSpace +
				draw.zoomPan.deltaXForZoom * gridZoom +
				draw.zoomPan.deltaXForPan * gridZoom ) %
			zoomedSpace
		return res
	}

	function getSpaceDeltaY( zoomedSpace ) {
		const res =
			( zoomedSpace +
				draw.zoomPan.deltaYForZoom * gridZoom +
				draw.zoomPan.deltaYForPan * gridZoom ) %
			zoomedSpace
		return res
	}
}
