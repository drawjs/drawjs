import Particle from "../model/Particle"
import DrawStore from "../store/draw/DrawStore"
import Getters from "../store/draw/Getters"
import { includes, cloneDeep } from "lodash"
import selectionRendererExcludingCellTypes from "../store/exclude/selectionRendererExcludingCellTypes"
import drawRenderExcludingCellTypes from "../store/exclude/drawRenderExcludingCellTypes"
import { Cell } from "../model/index"
import Segment from "../model/Segment"
import { getRotatedPoint } from "util/index"
import Handle from "../model/Handle"
import distance from "../util/geometry/distance"
import absolute from "../util/geometry/absolute"

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
	renderParticle( particle: any ) {
		particle.render()
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

		function isLast( i, array ) {
			return i === array.length - 1
		}
	}
	ajustSegmentsPreviousAndNext( segments: Segment[] ) {
		segments.map( segment =>
			this.ajustSegmentPreviousAndNext( segment, segments )
		)
	}
	renderSegments( segments: Segment[] ) {
		segments.map( segment => this.renderParticle( segment ) )
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
		const rotatedPoint: Point2D = getRotatedPoint(
			segment,
			angle,
			centerPoint
		)
		this.updateSegmentPoint( segment, rotatedPoint )
	}
	rotateSegments( segments: Segment[], angle: number, centerPoint?: Point2D ) {
		segments.map( segment => this.rotateSegment( segment, angle, centerPoint ) )
	}

	/**
	 * // Handle
	 */
	updateHandlePoint( handle: Handle, point: Point2D ) {
		handle.point = cloneDeep( point )
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
		let newParterPoint: Point2D

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
		newParterPoint = {
			x: OB.x + sx,
			y: OB.y + sy
		}

		this.updateHandlePoint( partner, newParterPoint )
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
