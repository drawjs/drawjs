import Particle from "../model/Particle"
import DrawStore from "../store/draw/DrawStore"
import Getters from "../store/draw/Getters"
import { includes } from "lodash"
import selectionRendererExcludingCellTypes from "../store/exclude/selectionRendererExcludingCellTypes"
import drawRenderExcludingCellTypes from "../store/exclude/drawRenderExcludingCellTypes"
import { Cell } from "../model/index"
import Segment from "../model/Segment"
import { getRotatedPoint } from "util/index"

export default class SharedActions {
	drawStore: DrawStore
	getters: Getters

	constructor( drawStore: DrawStore, getters: Getters ) {
		this.drawStore = drawStore
		this.getters = getters
	}

	/**
	 * Cell
	 */
	startDragCell( cell: Cell, event: any ) {
		cell.dragger.start( event )
	}

	draggingCell( cell: Cell, event: any ) {
		cell.dragger.dragging( event )
	}

	stopDragCell( cell: Cell, event: any ) {
		cell.dragger.stop( event )
	}

	selectCell( cell: Cell ) {
		cell.shouldSelect = true
	}

	deselectCell( cell: Cell ) {
		cell.shouldSelect = false
	}

	enableCellRotate( cell: Cell ) {
		cell.shouldRotate = true
	}

	disableCellRotate( cell: Cell ) {
		cell.shouldRotate = false
	}

	/**
	 * // Render
	 */
	renderCell( cell: any ) {
		cell.render()
	}
	renderElement( cell: any ) {
		isInclude( cell.type ) && cell.render()
		function isInclude( type: String ): boolean {
			return !includes( drawRenderExcludingCellTypes, type )
		}
	}

	/**
	 * Segment
	 */
	updateSegmentX( segment: Segment, x: number ) {
		segment.x = x
	}
	updateSegmentY( segment: Segment, y: number ) {
		segment.y = y
	}
	updateSegmentPoint( segment: Segment, { x, y }: Point2D ) {
		segment.x = x
		segment.y = y
	}
	renderSegments( segments: Segment[] ) {
		segments.map( segment => this.renderCell( segment ) )
	}
	translateSegment( segment: Segment, deltaX: number, deltaY: number ) {
		const { x, y } = segment
		this.updateSegmentPoint( segment, {
			x: x + deltaX,
			y: y + deltaY
		} )
	}
	translateSegments( segments: Segment[], deltaX: number, deltaY: number ) {
		segments.map( segment => this.translateSegment( segment, deltaX, deltaY ) )
	}
	rotateSegment( segment: Segment, angle: number, centerPoint?: Point2D ) {
		const rotatedPoint: Point2D = getRotatedPoint( segment, angle, centerPoint )
		this.updateSegmentPoint( segment, rotatedPoint )
	}
	rotateSegments( segments: Segment[], angle: number, centerPoint?: Point2D ) {
		segments.map( segment => this.rotateSegment( segment, angle, centerPoint ) )
	}


	/**
	 * // Rotation
	 */
	applyRotationArrow( element ) {
		element.rotationArrow.render()
	}

	/**
	 * // Scale
	 */
	applyScalePoint( element ) {}

	/**
	 * // Selection
	 */
	applySelectionBorder( element ) {
		const { shouldSelect, type, draw, path } = element
		const { ctx } = this.getters
		if (
			shouldSelect &&
			!includes( selectionRendererExcludingCellTypes, type )
		) {
			ctx.save()
			ctx.lineWidth = 1
			ctx.setLineDash( [ 5, 5 ] )
			ctx.strokeStyle = "black"
			ctx.stroke( path )
			ctx.restore()
		}
	}
}
