import Segment from '../Segment';
import Line from "./Line"
import Path from "../Path"
import { isNotNil } from "../../util/index"
import Item from "../Item"
import { isNil, findIndex, cloneDeep } from 'lodash';
import { LINE, SEGMENT } from "../../store/constant/cellType"
import { isLast, notFirstElement, notFirst, notLastElement, isFirst } from '../../util/js/array';
import { notNextCornerSegment } from '../../drawUtil/model/orthogonalLine/index';
import { isIndexFound } from '../../util/lodash/index';

export default class OrthogonalLine extends Item {
	segments: Segment[] = []

	startSegment: Segment = null

	endSegment: Segment = null

	lines: Line[]

	constructor( props ) {
		super( props )

		if ( isNotNil( props.segments ) ) {
			this.segments = props.segments
		}

		if ( isNil( props.segments ) ) {
			this.segments = isNotNil( props.points ) ?
				props.points.map( point =>
						this.sharedGetters.createSegmentByPoint(
							point,
							this.draw
						)
				  ) :
				this.segments
		}

		const { segments } = this
		const { length } = segments
		this.startSegment = isNotNil( segments[ 0 ] ) ?
			segments[ 0 ] :
			this.startSegment
		this.endSegment = isNotNil( segments[ length - 1 ] ) ?
			segments[ length - 1 ] :
			this.endSegment

		this._insertCornerSegmentsIfNecessary()

		this.regenerateLines()

		this.bindDragStartSegment()
		this.bindDragEndSegment()
	}

	// ===============================
	// =========== getters ===========
	// ===============================
	contain() {
		return false
	}

	get cornerSegments(): Segment[] {
		return this.segments.filter( notFirstElement ).filter( notLastElement )
	}

	get centerSegments(): Segment[] {
		return []
	}

	// ===============================
	// =========== mutations =========
	// ===============================
	/**
	 * Initialization
	 */
	// _convertTwoSegmentsToThree() {
	// 	if ( this.segmentsLength2 ) {
	// 		const { x: x1, y: y1 } = this.startSegment
	// 		const { x: x2, y: y2 } = this.endSegment

	// 		const notVerticalOrHorizontal = x1 !== x2 && y1 !== y2

	// 		if ( notVerticalOrHorizontal ) {
	// 			const perp: Point2D = {
	// 				x: x1,
	// 				y: y2
	// 			}

	// 			const perpSegment = this.draw.addElement( SEGMENT, {
	// 				...perp,
	// 				fillColor: "grey"
	// 			} )

	// 			this.segments.splice( 1, 0, perpSegment )
	// 		}
	// 	}
	// }

	_createCornerSegment( a: Segment, b: Segment ) {
		const { segments } = this

		const { x: ax, y: ay } = a
		const { x: bx, y: by } = b

		const notVerticalOrHorizontal = ax !== bx && ay !== by

		if ( notVerticalOrHorizontal ) {
			const perp: Point2D = {
				x: ax,
				y: by
			}

			const cornerSegment = this.draw.addElement( SEGMENT, {
				...perp,
				fillColor: "grey"
			} )

			return cornerSegment
		}
	}

	_insertCornerSegmentsIfNecessary() {
		const self = this
		let corners = []

		const clonedSegments = cloneDeep( this.segments )
		if ( isNotNil( this.startSegment ) ) {
			clonedSegments.map( createCorner )
		}

		function createCorner( segment: Segment, index: number, clonedSegments ) {
			if ( notFirst( index ) ) {
				const prev: Segment = clonedSegments[ index - 1 ]

				if ( notNextCornerSegment( prev, segment ) ) {
					const cornerSegment = self._createCornerSegment( prev, segment )
					isNotNil( cornerSegment ) && self._insertCornerSegment( segment, cornerSegment )
				}
			}
		}
	}

	_insertCornerSegment( segment: Segment, corner: Segment ) {
		const index = findIndex( this.segments, segment )
		if ( isIndexFound( index ) ) {
			this.segments.splice( index, 0, corner )
		}
	}

	regenerateLines() {
		const { length } = this.segments
		this.segments.reduce( ( accumulator, value, index ) => {
			this.draw.addElement( LINE, {
				sourceSegment: accumulator,
				targetSegment: value,
				showArrow    : isLast( index, this.segments )
			} )
			return value
		} )
	}

	// ===============================
	// =========== actions ===========
	// ===============================
	render() {}

	// ===============================
	// =========== methods ===========
	// ===============================
	bindSegmentDrag( segment, method ) {
		segment.dragger.interfaceDragging = method
	}

	bindDragStartSegment() {
		this.bindSegmentDrag( this.startSegment, handle )

		function handle( event ) {
			console.log( "start segment is being dragged" )
		}
	}

	bindDragEndSegment() {}

	handleDragStartSegment() {}
}
