import { Point } from 'interface/index';
import log from './log';
import Draw from '../Draw';


export default function renderGrid( draw: Draw ) {
	const ctx = draw.canvas.getContext( '2d' )
	const width = draw.canvas.width
	const height = draw.canvas.height
	const spaceSmall = 10
	const spaceBig = 50

	renderGridBySpace( spaceSmall, () => {
		ctx.setLineDash( [ 2, 1 ] )
		ctx.strokeStyle = '#ddd'
	} )
	renderGridBySpace( spaceBig, () => {
		ctx.strokeStyle = '#ddd'
	} )


	function renderGridBySpace( space: number, beforeStrokeFn?: Function ) {
		let path = new Path2D()
		const zoomedSpace = space * draw.zoomPan.zoom
		const spaceDeltaX = getSpaceDeltaX( zoomedSpace )
		const spaceDeltaY = getSpaceDeltaY( zoomedSpace )

		ctx.save()
		ctx.translate( 0, 0 )
		log( 123 )

		for ( let i = 0; i < width; i++ ) {
			const x = i * zoomedSpace
			path.moveTo( x + spaceDeltaX, 0 )
			path.lineTo( x + spaceDeltaX, height )

			const y = i * zoomedSpace
			path.moveTo( 0, y + spaceDeltaY )
			path.lineTo( width, y + spaceDeltaY )
		}

		ctx.lineWidth = 1
		ctx.strokeStyle = 'grey'
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
		const res = ( zoomedSpace + draw.zoomPan.deltaXForZoomPan ) % zoomedSpace
		return res
	}

	function getSpaceDeltaY( zoomedSpace ) {
		const res = ( zoomedSpace + draw.zoomPan.deltaYForZoomPan ) % zoomedSpace
		return res
	}

}
