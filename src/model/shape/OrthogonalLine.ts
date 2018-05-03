import Segment from '../Segment';
import Line from './Line';
import Path from '../Path';
import { isNotNil } from '../../util/index';
import Item from '../Item';
import { isNil } from 'lodash';
import { LINE, SEGMENT } from '../../store/constant/cellType';
import { isLast } from '../../util/array';

export default class OrthogonalLine extends Item{
	segments: Segment[] = []

	startSegment: Segment = null

	endSegment: Segment= null

	cornerSegments: Segment[] = []

	centerSegments: Segment[] = []

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
							this.draw,
						)
				  ) :
				this.segments
		}

		const { segments } = this
		const { length } = segments
		this.startSegment = isNotNil( segments[ 0 ] ) ? segments[ 0 ] : this.startSegment
		this.endSegment = isNotNil( segments[ length - 1 ] ) ? segments[ length - 1  ] : this.endSegment


		if ( this.segmentsLength2 ) {
			this._convertTwoSegmentsToThree()
		}

		this.regenerateLines()

		this.bindDragStartSegment()
		this.bindDragEndSegment()
	}

	// ===============================
	// =========== getters ===========
	// ===============================
	get segmentsLength2(): boolean {
		const { length } = this.segments
		return length === 2
	}

	contain() {
		return false
	}

	// ===============================
	// =========== mutations =========
	// ===============================
	/**
	 * Initialization
	 */
	_convertTwoSegmentsToThree() {
		if ( this.segmentsLength2 ) {
			const { x: x1, y: y1 } = this.startSegment
			const { x: x2, y: y2 } = this.endSegment

			const notVerticalOrHorizontal = x1 !== x2 && y1 !== y2

			if ( notVerticalOrHorizontal ) {
				const perp: Point2D = {
					x: x1,
					y: y2
				}

				const perpSegment = this.draw.addElement( SEGMENT, {
					...perp,
					fillColor: 'grey'
				} )

				this.segments.splice( 1, 0, perpSegment )
			}
		}
	}

	regenerateLines() {
		const { length } = this.segments
		this.segments.reduce( ( accumulator, value, index ) => {
			this.draw.addElement( LINE, {
				sourceSegment: accumulator,
				targetSegment: value,
				showArrow: isLast( index, length )
			} )
			return value
		} )

	}

	// ===============================
	// =========== actions ===========
	// ===============================
	render() {
	}


	// ===============================
	// =========== methods ===========
	// ===============================
	bindSegmentDrag( segment, method ) {
		segment.dragger.interfaceDragging = method
	}

	bindDragStartSegment() {
		this.bindSegmentDrag( this.startSegment, handle )

		function handle( event ) {
			console.log( 'start segment is being dragged' )
		}
	}

	bindDragEndSegment() {

	}

	handleDragStartSegment() {

	}
}
