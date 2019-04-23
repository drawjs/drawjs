import Particle from "../model/Particle"
import DrawStore from "../store/draw/DrawStore"
import Getters from "../store/draw/Getters"
import selectionRendererExcludingCellTypes from "../store/exclude/selectionRendererExcludingCellTypes"
import drawRenderExcludingCellTypes from "../store/exclude/drawRenderExcludingCellTypes"
import { Cell } from "../model/index"
import Segment from '../model/Segment'
import { getRotatedPoint } from "../util/index"
import Handle from "../model/Handle"
import distance from "../util/geometry/distance"
import absolute from "../util/geometry/absolute"
import Item from "../model/Item"
import sizePoint from "../util/geometry/sizePoint"
import origin from "../util/geometry/origin"
import TextInput from '../model/tool/TextInput'
import DrawText from '../model/text/DrawText'
import Path from '../model/Path'
import { isLast } from '../util/js/array'
import { clonePoint } from '../util/js/clone'
import mockDragCellPerformanceTest from "../drawUtil/performance/mockDragCellPerformanceTest"
import { averagePerformanceTest } from '../util/performance/index'
import { notNil, includes, isNil } from '../util/lodash/index'

/**
 * Feature: Emphasize that one method is couple with other class or classes
 */
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

	clickCell( cell: Cell, event: any ) {
		cell.handleClick && cell.handleClick( event )
	}

	doubleClickCell( cell: Cell, event: any ) {
		cell.handleDoubleClick && cell.handleDoubleClick( event )
	}

	mouseUpCell( cell: Cell, event: any ) {
		cell.handleMouseUp && cell.handleMouseUp( event )
	}

	mouseInCell( cell: Cell, event: any ) {
		cell.handleMouseIn && cell.handleMouseIn( event )
	}

	mouseMoveCell( cell: Cell, event: any ) {
		cell.handleMouseMove && cell.handleMouseMove( event )
	}

	mouseOutCell( cell: Cell, event: any ) {
		cell.handleMouseOut && cell.handleMouseOut( event )
	}

	rightClickCell( cell: Cell, event: any ) {
		cell.handleRightClick && cell.handleRightClick( event )
	}

	rotateCell( cell: Cell, angle: number ) {
		cell.rotate( angle )
	}

	selectCell( cell: Cell ) {
		cell.select()
	}

	selectCells( cells: Cell[] ) {
		cells.map( cell => cell.select() )
	}

	deselectCell( cell: Cell ) {
		cell.deselect()
	}

	deselectCells( cells: Cell[] ) {
		cells.map( cell => cell.deselect() )
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
	renderParticle( particle: any ) {
		particle.render()
	}
	renderElement( cell: Cell, miniMapRenderingMainCells: boolean = false ) {
		if ( ! miniMapRenderingMainCells ) {
			cell.render()
		}

		if ( miniMapRenderingMainCells ) {
			notNil( cell.renderFnInMiniMap ) && cell.renderFnInMiniMap()
			isNil( cell.renderFnInMiniMap ) && cell.render()
		}
	}


	/**
	 * Segment
	 */
	updateSegmentPrevious( segment: Segment, previous: Segment ) {
		segment.previous = previous
	}
	updateSegmentNext( segment: Segment, next: Segment ) {
		segment.next = next
	}
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
	ajustSegmentPreviousAndNext( segment: Segment, segments: Segment[] ) {
		const { length } = segments
		if ( length > 1 ) {
			const lastIndex = length - 1

			const first = segments[ 0 ]
			const last = segments[ lastIndex ]

			for ( let i = 0; i < length; i++ ) {
				const current: Segment = segments[ i ]
				if ( current === segment ) {
					const previous: Segment = isFirst( i ) ?
						last :
						segments[ i - 1 ]
					const next: Segment = isLast( i, segments ) ?
						first :
						segments[ i + 1 ]

					this.updateSegmentPrevious( segment, previous )
					this.updateSegmentNext( segment, next )
				}
			}
		}

		function isFirst( i ) {
			return i === 0
		}
	}
	ajustSegmentsPreviousAndNext( segments: Segment[] ) {
		segments.map( segment =>
			this.ajustSegmentPreviousAndNext( segment, segments )
		)
	}
	showSegment( segment: Segment ) {
		segment.show = true
	}
	showSegments( segments: Segment[] ) {
		segments.map( segment => this.showSegment( segment ) )
	}
	hideSegment( segment: Segment ) {
		segment.show = false
	}
	hideSegments( segments: Segment[] ) {
		segments.map( segment => this.hideSegment( segment ) )
	}
	renderSegments( segments: Segment[] ) {
		segments.map( segment => this.renderParticle( segment ) )
	}
	translateSegment( segment: Segment, deltaX: number, deltaY: number ) {
		segment.translate( deltaX, deltaY )
	}
	translateSegments( segments: Segment[], deltaX: number, deltaY: number ) {
		segments.map( segment => segment.translate( deltaX, deltaY ) )
	}
	translateSegmentTo( segment: Segment, x: number, y: number ) {
		segment.translateTo( x, y )
	}
	translateSegmentsTo( segments: Segment[], x: number, y: number ) {
		segments.map( segment => segment.translateTo( x, y ) )
	}
	translateSegmentToPoint( segment: Segment, point: Point2D ) {
		segment.translateToPoint( point )
	}
	translateSegmentsToPoint( segments: Segment[], point: Point2D ) {
		segments.map( segment => segment.translateToPoint( point ) )
	}
	rotateSegment( segment: Segment, angle: number, center?: Point2D ) {
		const { handleIn, handleOut } = segment

		this.rotateHandle( handleIn, angle, center )
		this.rotateHandle( handleOut, angle, center )

		const rotatedPoint: Point2D = getRotatedPoint( segment, angle, center )
		this.updateSegmentPoint( segment, rotatedPoint )
	}
	rotateSegments( segments: Segment[], angle: number, center?: Point2D ) {
		segments.map( segment => this.rotateSegment( segment, angle, center ) )
	}
	sizeSegment( segment: Segment, kX: number, kY: number, center: Point2D ) {
		const { handleIn, handleOut } = segment
		const { angle } = segment.path

		this.sizeHandle( handleIn, kX, kY, center )
		this.sizeHandle( handleOut, kX, kY, center )

		const rotatedSegmentPoint: Point2D = getRotatedPoint( segment, -angle )
		const rotatedCenter: Point2D = getRotatedPoint( center, -angle )
		const sized: Point2D = sizePoint( rotatedSegmentPoint, kX, kY, rotatedCenter )

		const rotatedSized: Point2D = getRotatedPoint( sized, angle )
		this.updateSegmentPoint( segment, rotatedSized )

	}
	sizeSegments( segments: Segment[], kX: number, kY: number, center: Point2D ) {
		segments.map( segment => this.sizeSegment( segment, kX, kY, center ) )
	}
	showSegmentHandle( segment: Segment ) {
		this.showHandle( segment.handleIn )
		this.showHandle( segment.handleOut )
	}
	showSegmentsHandles( segments: Segment[] ) {
		segments.map( segment => this.showSegmentHandle( segment ) )
	}
	hideSegmentHandle( segment: Segment ) {
		this.hideHandle( segment.handleIn )
		this.hideHandle( segment.handleOut )
	}
	hideSegmentsHandles( segments: Segment[] ) {
		segments.map( segment => this.hideSegmentHandle( segment ) )
	}
	clearSegmentHandle( segment: Segment ) {
		this.clearHandle( segment.handleIn )
		this.clearHandle( segment.handleOut )
	}
	clearSegmentsHandles( segments: Segment[] ) {
		segments.map( segment => this.clearSegmentHandle( segment ) )
	}


	/**
	 * // Handle
	 */
	updateHandleRelativePoint( handle: Handle, relativePoint: Point2D ) {
		handle.relativePoint = clonePoint( relativePoint )
	}
	adjustHandleParterPoint( handle: Handle ) {
		const { partner, segment } = handle

		/**
		 * A
		 */
		const { x, y } = handle.point

		/**
		 * B'
		 */
		const { x: px, y: py } = partner.point

		/**
		 * B
		 */
		let newPartnerRelativePoint: Point2D

		/**
		 * O
		 */
		const { x: sx, y: sy } = segment.point

		const OA: Vector = {
			x: x - sx,
			y: y - sy
		}

		const absoluteOA = absolute( OA )
		const absoluteOB: number = partner.length
		const rate = absoluteOB / absoluteOA

		const OB: Vector = {
			x: -OA.x,
			y: -OA.y
		}
		// const OB: Vector = {
		// 	x: -OA.x * rate,
		// 	y: -OA.y * rate
		// }

		/**
		 * New partner point
		 */
		newPartnerRelativePoint = {
			x: OB.x,
			y: OB.y
		}

		this.updateHandleRelativePoint( partner, newPartnerRelativePoint )
	}
	showHandle( handle: Handle ) {
		handle.show = true
	}
	hideHandle( handle: Handle ) {
		handle.show = false
	}
	rotateHandle( handle: Handle, angle: number, center?: Point2D ) {
		const { point, segmentPoint, relativePoint }: Handle = handle

		const { x, y }: Point2D = point

		const rotatedHandlePoint: Point2D = getRotatedPoint(
			point,
			angle,
			center
		)
		const rotatedSegmentPoint: Point2D = getRotatedPoint(
			segmentPoint,
			angle,
			center
		)

		const newRelativePoint: Point2D = {
			x: rotatedHandlePoint.x - rotatedSegmentPoint.x,
			y: rotatedHandlePoint.y - rotatedSegmentPoint.y
		}

		this.updateHandleRelativePoint( handle, newRelativePoint )
	}
	sizeHandle( handle: Handle, kX: number, kY: number, center: Point2D ) {
		const { point, segmentPoint, relativePoint }: Handle = handle
		const { angle } = handle.segment.path

		const rotatedPoint: Point2D = getRotatedPoint( point, -angle )
		const rotatedSegmentPoint: Point2D = getRotatedPoint( segmentPoint, -angle )
		const rotatedRelativePoint: Point2D = getRotatedPoint( relativePoint, -angle )
		const rotatedCenter: Point2D = getRotatedPoint( center, -angle )

		const { x, y }: Point2D = rotatedPoint

		const sizedHandlePoint: Point2D = sizePoint(
			rotatedPoint,
			kX,
			kY,
			rotatedCenter
		)

		const rotatedSizedHandlePoint: Point2D = getRotatedPoint( sizedHandlePoint, angle )


		const sizedSegmentPoint: Point2D = sizePoint(
			rotatedSegmentPoint,
			kX,
			kY,
			rotatedCenter
		)

		const rotatedSizedSegmentPoint: Point2D = getRotatedPoint( sizedSegmentPoint, angle )


		const newRelativePoint: Point2D = {
			x: rotatedSizedHandlePoint.x - rotatedSizedSegmentPoint.x,
			y: rotatedSizedHandlePoint.y - rotatedSizedSegmentPoint.y
		}

		this.updateHandleRelativePoint( handle, newRelativePoint )
	}
	/**
	 * Set handle relative point to { x: 0, y: 0 }
	 */
	clearHandle( handle: Handle ) {
		this.updateHandleRelativePoint( handle, origin )
	}

	/**
	 * Item
	 */
	sizeItem( item: Item, kX: number, kY: number, center: Point2D ) {
		item.size( kX, kY, center )
	}


	/**
	 * // Path
	 */
	updatePathSegments( path: Path, segments: Segment[] ) {
		path.updateSegments( segments )
	}

	/**
	 * // Point
	 */
	updatePoint( point: Point2D, x: number, y: number ) {
		point.x = x
		point.y = y
	}
	translatePoint( point: Point2D, deltaX: number, deltaY: number ) {
		const { x, y }: Point2D = point
		this.updatePoint( point, x + deltaX, y + deltaY )
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

	/**
	 * // Draw text
	 */
	updateTheTextOfDrawText( drawText: DrawText, value: string ) {
		drawText.text = value
	}
	translateDrawText( drawText: DrawText, deltaX: number, deltaY: number ) {
		drawText.x = drawText.x + deltaX
		drawText.y = drawText.y + deltaY
	}

	/**
	 * // Text input
	 */
	updateTextInputTarget( textInput: TextInput, target: DrawText ) {
		textInput.target = target
	}

	/**
	 * Performance test
	 */
	mockDragCellPerformanceTest( cell, maxStep: number ) {
		return mockDragCellPerformanceTest( cell, maxStep )
	}
	averageMockDragCellPerformanceTest( cell, maxStep: number, count: number, ) {
		return averagePerformanceTest( () => this.mockDragCellPerformanceTest( cell, maxStep ), count )
	}


	/**
	 * // Formmater
	 */
	forceRemoveFlows( flows ) {
		flows.map( flow => flow && flow.forceRemove() )
	}
}
