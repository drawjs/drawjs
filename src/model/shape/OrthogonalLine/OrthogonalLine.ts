import Segment from "../../Segment"
import Line from ".././Line"
import Path from "../../Path"
import { isNotNil } from "../../../util/index"
import Item from "../../Item"
import { isNil, findIndex, cloneDeep } from "lodash"
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
import StartLine from "./StartLine"
import EndLine from "./EndLine"
import InnerLine from "./InnerLine"
import CornerSegment from "./CornerSegment"
import CenterSegment from "./CenterSegment"

const { abs } = Math

export default class OrthogonalLine extends Item {
	startSegment: StartSegment = null

	endSegment: EndSegment = null

	cornerSegments: CornerSegment[] = []

	centerSegments: CenterSegment[] = []

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

	// ===============================
	// =========== mutations =========
	// ===============================
	/**
	 * Initialization
	 */
	createStartSegment( props: any ) {
		return new StartSegment( {
			draw: this.draw,
			...props
		} )
	}

	createEndSegment( props: any ) {
		return new EndSegment( {
			draw: this.draw,
			...props
		} )
	}

	createCornerSegment( props: any ) {
		return new CornerSegment( {
			draw     : this.draw,
			...props,
			fillColor: "grey",
			draggable: false
		} )
	}

	createCenterSegment( props: any ) {
		return new CenterSegment( {
			draw: this.draw,
			...props
		} )
	}

	createStartLine( props: any ) {
		return new StartLine( {
			draw     : this.draw,
			...props,
			fillColor: "red",
			draggable: false
		} )
	}

	createEndLine( props: any ) {
		return new EndLine( {
			draw     : this.draw,
			...props,
			fillColor: "blue",
			draggable: false
		} )
	}

	createInnerLine( props: any ) {
		return new InnerLine( {
			draw     : this.draw,
			...props,
			draggable: false
		} )
	}

	createLine( props: any ) {
		return this.draw.addElement( LINE, {
			...props,
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

	_insertCornerSegment( segment: Segment, corner: Segment ) {
		const index = findIndex( this.segments, segment )
		if ( isIndexFound( index ) ) {
			const cornerIndex = index - 1
			this.cornerSegments.splice( cornerIndex, 0, corner )
		}
	}

	_initializeLines() {
		const { segments } = this
		segments.reduce( ( accumulator, value, index ) => {
			if ( isNil( accumulator ) || isNil( value ) ) {
				return
			}

			if ( index === 1 ) {
				this.createStartLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )
			} else if ( isLast( index, segments ) ) {
				this.createEndLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )
			} else {
				this.createInnerLine( {
					sourceSegment: accumulator,
					targetSegment: value
				} )
			}

			return value
		} )
	}
	// regenerateLines() {
	// 	const { length } = this.segments
	// 	const cachedlines = []

	// this.segments.reduce( ( accumulator, value, index ) => {
	// 	const line = this.createLine( {
	// 		sourceSegment: accumulator,
	// 		targetSegment: value,
	// 		showArrow    : isLast( index, this.segments )
	// 	} )
	// 	cachedlines.push( line )
	// 	return value
	// } )

	// 	this.lines = cachedlines
	// }

	// ===============================
	// =========== actions ===========
	// ===============================
	render() {}

	// ===============================
	// =========== methods ===========
	// ===============================
}
