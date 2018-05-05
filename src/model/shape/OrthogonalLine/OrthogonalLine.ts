import Segment from "../../Segment"
import Line from ".././Line"
import Path from "../../Path"
import { isNotNil } from "../../../util/index"
import Item from "../../Item"
import { isNil, cloneDeep } from "lodash"
import { LINE, SEGMENT } from "../../../store/constant/cellType"
import {
	isLast,
	notFirstElement,
	notFirst,
	notLastElement,
	isFirst
} from "../../../util/js/array"
import {
	notNextCornerSegment,
	mapCreateSegmentInConstructor,
} from "../../../drawUtil/model/orthogonalLine/index"
import { isIndexFound, notNil } from "../../../util/lodash/index"
import { isLineVertical } from "../../../drawUtil/model/orthogonalLine/index"
import StartSegment from "./StartSegment"
import EndSegment from "./EndSegment"
import StartLine from './StartLine';
import EndLine from './EndLine';
import InnerLine from "./InnerLine"
import CornerSegment from './CornerSegment';
import { findArrayFirstIndex } from '../../../util/js/array';
import StartCenterSegment from './StartCenterSegment';
import EndCenterSegment from './EndCenterSegment';
import InnerCenterSegment from './InnerCenterSegment';

const { abs } = Math

export default class OrthogonalLine extends Item {
	startSegment: StartSegment = null

	endSegment: EndSegment = null

	cornerSegments: CornerSegment[] = []

	startLine: StartLine = null

	endLine: EndLine = null

	innerLines: InnerLine[] = []

	constructor( props ) {
		super( props )

		const { points } = props

		const segments = points.map( mapCreateSegmentInConstructor( this ) )
		const potentialStartSegment = segments[ 0 ]
		const potentialEndSegment = segments[ segments.length - 1 ]

		if ( notNil( potentialStartSegment ) ) {
			this.startSegment = potentialStartSegment
			this.startSegment.orthogonalLine = this
		}

		if ( notNil( potentialEndSegment ) ) {
			this.endSegment = potentialEndSegment
		}

		this.cornerSegments = segments
			.filter( notFirstElement )
			.filter( notLastElement )

		this._initializeCornerSegments()

		this._initializeLines()
	}

	// ===============================
	// =========== getters ===========
	// ===============================
	contain() {
		return false
	}

	get segments(): any[] {
		return [ this.startSegment, ...this.cornerSegments, this.endSegment ]
	}

	get lines(): any[] {
		return [ this.startLine, ...this.innerLines ,this.endLine ]
	}

	// ===============================
	// =========== mutations =========
	// ===============================
	/**
	 * Initialization
	 */
	createStartSegment( props: any ) {
		return new StartSegment( {
			draw: this.draw,
			orthogonalLine: this,
			...props
		} )
	}

	createEndSegment( props: any ) {
		return new EndSegment( {
			draw: this.draw,
			orthogonalLine: this,
			...props
		} )
	}

	createCornerSegment( props: any ) {
		return new CornerSegment( {
			draw     : this.draw,
			...props,
			orthogonalLine: this,
			fillColor: "grey",
			draggable: false
		} )
	}

	createStartCenterSegment( props: any ) {
		return new StartCenterSegment( {
			draw: this.draw,
			orthogonalLine: this,
			...props
		} )
	}

	createEndCenterSegment( props: any ) {
		return new EndCenterSegment( {
			draw: this.draw,
			orthogonalLine: this,
			...props
		} )
	}

	createEndInnerCenterSegment( props: any ) {
		return new InnerCenterSegment( {
			draw: this.draw,
			orthogonalLine: this,
			...props
		} )
	}

	createStartLine( props: any ) {
		return new StartLine( {
			draw     : this.draw,
			...props,
			orthogonalLine: this,
			fillColor: "red",
			draggable: false
		} )
	}

	createEndLine( props: any ) {
		return new EndLine( {
			draw     : this.draw,
			...props,
			orthogonalLine: this,
			fillColor: "blue",
			showArrow: true,
			draggable: false
		} )
	}

	createInnerLine( props: any ) {
		return new InnerLine( {
			draw     : this.draw,
			...props,
			orthogonalLine: this,
			draggable: false
		} )
	}



	_createCornerSegmentBetween( a: Segment, b: Segment ) {
		const { segments } = this

		const { x: ax, y: ay } = a
		const { x: bx, y: by } = b

		const notVerticalOrHorizontal = ax !== bx && ay !== by

		if ( notVerticalOrHorizontal ) {
			const perp: Point2D = {
				x: ax,
				y: by
			}

			const cornerSegment = this.createCornerSegment( perp )

			return cornerSegment
		}
	}

	_initializeCornerSegments() {
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
					const cornerSegment = self._createCornerSegmentBetween(
						prev,
						segment
					)
					isNotNil( cornerSegment ) &&
						self._insertCornerSegment( segment, cornerSegment )
				}
			}
		}
	}

	_insertCornerSegment( segment: Segment, corner: any ) {
		const index = findArrayFirstIndex( this.segments.map( ( { id } ) => id ), segment.id )
		if ( notNil( index ) ) {
			const cornerIndex = index - 1
			this.cornerSegments.splice( cornerIndex, 0, corner )
		}
	}

	_initializeLines() {
		const { segments } = this
		let startLine: StartLine = null
		let endLine: EndLine = null
		let innerLines: InnerLine[] = []
		segments.reduce( ( accumulator, value, index ) => {
			if ( isNil( accumulator ) || isNil( value ) ) {
				return
			}

			if ( index === 1 ) {
				startLine = this.createStartLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )
			} else if ( isLast( index, segments ) ) {
				endLine = this.createEndLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )
			} else {
				const line = this.createInnerLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )

				innerLines.push( line )
			}

			return value
		} )

		this.startLine = startLine
		this.endLine = endLine
		this.innerLines = innerLines
	}

	// ===============================
	// =========== actions ===========
	// ===============================
	render() {}

	updateCenterSegmentsPosition() {
		this.lines.map( line => line.updateCenterSegmentPosition() )
	}
  }
