import { Point } from "interface/index"
import log from "util/log"
import Draw from "../Draw"

export default function renderGrid( {
	canvas,
	width,
	height,
	origin = { x: 0, y: 0 },
	zoom = 1,
	deltaXForZoom = 0,
	deltaYForZoom = 0,
	deltaXForPan = 0,
	deltaYForPan = 0,
	strokeStyleForSmallSpace = '#ddd',
	strokeStyleForBigSpace = '#aaa'
}:{
	canvas: HTMLCanvasElement
	width: number
	height: number
	origin?: Point
	zoom?: number,
	deltaXForZoom?: number,
	deltaYForZoom?: number,
	deltaXForPan?: number,
	deltaYForPan?: number,
	strokeStyleForSmallSpace?: string,
	strokeStyleForBigSpace?: string,
	}
) {
	const ctx = canvas.getContext( "2d" )
	const spaceSmall = 10
	const spaceBig = 50

	renderGridBySpace( spaceSmall, () => {
		ctx.setLineDash( [ 2, 1 ] )
		ctx.strokeStyle = strokeStyleForSmallSpace
	} )
	renderGridBySpace( spaceBig, () => {
		ctx.strokeStyle = strokeStyleForBigSpace
	} )

	function renderGridBySpace( space: number, beforeStrokeFn?: Function ) {
		let path = new Path2D()
		const zoomedSpace = space * zoom
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

	function getSpaceDeltaX( zoomedSpace ) {
		const res =
			( zoomedSpace +
				deltaXForZoom +
				deltaXForPan ) %
			zoomedSpace
		return res
	}

	function getSpaceDeltaY( zoomedSpace ) {
		const res =
			( zoomedSpace +
				deltaYForZoom +
				deltaYForPan ) %
			zoomedSpace
		return res
	}
}
