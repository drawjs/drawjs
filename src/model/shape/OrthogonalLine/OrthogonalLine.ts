import Segment from "../../Segment"
import Line from ".././Line"
import Path from "../../Path"
import { isNotNil } from "../../../util/index"
import Item from "../../Item"
import { LINE, SEGMENT } from "../../../store/constant/cellType"
import {
	isLast,
	notFirstElement,
	notFirst,
	notLastElement,
	isFirst
} from "../../../util/js/array"
import { isIndexFound, notNil, isNil } from "../../../util/lodash/index"
import {
	isLineVertical,
	isNextCornerPoint,
	mapCreateSegmentInConstructor
} from "../../../drawUtil/model/orthogonalLine/index"
import StartSegment from "./StartSegment"
import EndSegment from "./EndSegment"
import StartLine from "./StartLine"
import EndLine from "./EndLine"
import InnerLine from "./InnerLine"
import CornerSegment from "./CornerSegment"
import {
	findArrayFirstIndex,
	removeElement,
	prevElement,
	nextElement,
	findArrayLastIndex
} from "../../../util/js/array"
import StartCenterSegment from "./StartCenterSegment"
import EndCenterSegment from "./EndCenterSegment"
import InnerCenterSegment from "./InnerCenterSegment"
import CommonLine from "./CommonLine"
import MathSegmentLine from "../../../util/math/MathSegmentLine"
import { clonePoints } from "../../../util/js/clone"
import { firstElement, lastElement } from "../../../util/js/array"
import StartLinking from "./StartLinking"
import EndLinking from "./EndLinking"
import { EXPORTABLE } from "../../../store/constant/name"

const { abs, min, max } = Math

export default class OrthogonalLine extends Item {
	startLinking: StartLinking = null

	endLinking: EndLinking = null

	cornerSegments: CornerSegment[] = []

	startLine: StartLine = null

	endLine: EndLine = null

	innerLines: InnerLine[] = []

	/**
	 * // Settings
	 */
	showArrow: boolean = true

	showCenterSegment: boolean = true

	showCorner: boolean = true

	startLineFillColor: string = "red"
	endLineFillColor: string = "blue"
	innerLineFillColor: string = "grey"

	startSegmentFillColor: string = "darkRed"
	endSegmentFillColor: string = "darkBlue"

	static COMBINE_INTERVAL = 10

	addedToBottom: boolean = false


	constructor( props ) {
		super( props )

		const { points = [], startSegment, endSegment, corners = [] } = props
		const { length } = points

		this.showArrow = notNil( props.showArrow ) ?
			props.showArrow :
			this.showArrow
		this.showCenterSegment = notNil( props.showCenterSegment ) ?
			props.showCenterSegment :
			this.showCenterSegment
		this.showCorner = notNil( props.showCorner ) ?
			props.showCorner :
			this.showCorner
		this.startLineFillColor = notNil( props.startLineFillColor ) ?
			props.startLineFillColor :
			this.startLineFillColor
		this.endLineFillColor = notNil( props.endLineFillColor ) ?
			props.endLineFillColor :
			this.endLineFillColor
		this.innerLineFillColor = notNil( props.innerLineFillColor ) ?
			props.innerLineFillColor :
			this.innerLineFillColor
		this.startSegmentFillColor = notNil( props.startSegmentFillColor ) ?
			props.startSegmentFillColor :
			this.startSegmentFillColor
		this.endSegmentFillColor = notNil( props.endSegmentFillColor ) ?
			props.endSegmentFillColor :
			this.endSegmentFillColor
		this.addedToBottom = notNil( props.addedToBottom ) ?
			props.addedToBottom :
			this.addedToBottom

		if ( notNil( startSegment ) && notNil( endSegment ) ) {
			this.startLinking = new StartLinking( {
				draw          : this.draw,
				orthogonalLine: this,
				segment       : startSegment
			} )
			this.endLinking = new EndLinking( {
				draw          : this.draw,
				orthogonalLine: this,
				segment       : endSegment
			} )

			this.cornerSegments = corners.map( point =>
				this.createCornerSegment( point )
			)
			this._initializeCornerSegments()

			this._refreshLines()
			return
		}

		if ( length < 2 ) {
			throw "Orthgonal line: Require at lest 2 points!"
		}

		if ( length >= 2 ) {
			const segments = points.map( mapCreateSegmentInConstructor( this ) )
			const startSegment = firstElement( segments )
			const endSegment = lastElement( segments )
			this.startLinking = new StartLinking( {
				draw          : this.draw,
				orthogonalLine: this,
				segment       : startSegment
			} )
			this.endLinking = new EndLinking( {
				draw          : this.draw,
				orthogonalLine: this,
				segment       : endSegment
			} )

			this.cornerSegments = segments
				.filter( notFirstElement )
				.filter( notLastElement )

			this._initializeCornerSegments()
			this._refreshLines()
		}
	}

	// ===============================
	// =========== getters ===========
	// ===============================
	contain( x: number, y: number ) {
		return this.lines.some( line => line.contain( x, y ) )
	}

	get startSegment(): Segment {
		return this.startLinking.segment
	}

	get endSegment(): Segment {
		return this.endLinking.segment
	}

	get segments(): Segment[] {
		return [ this.startSegment, ...this.cornerSegments, this.endSegment ]
	}

	get lines(): CommonLine[] {
		return [ this.startLine, ...this.innerLines, this.endLine ]
	}

	get centerSegments(): Segment[] {
		return this.lines.map( ( { centerSegment } ) => centerSegment )
	}

	get isSimpleLine(): boolean {
		return this.segments.length === 2
	}

	get notSimpleLine(): boolean {
		return !this.isSimpleLine
	}

	get bounds(): Bounds {
		const { segments } = this
		let left = null
		let right = null
		let top = null
		let bottom = null
		segments.map( ( { x, y } ) => {
			if ( isNil( left ) ) {
				left = x
			}
			if ( notNil( left ) ) {
				left = min( x, left )
			}

			if ( isNil( right ) ) {
				right = x
			}
			if ( notNil( right ) ) {
				right = max( x, right )
			}

			if ( isNil( top ) ) {
				top = y
			}
			if ( notNil( top ) ) {
				top = min( y, top )
			}

			if ( isNil( bottom ) ) {
				bottom = y
			}
			if ( notNil( bottom ) ) {
				bottom = max( y, bottom )
			}
		} )

		left = notNil( left ) ? left : 0
		right = notNil( right ) ? right : 0
		top = notNil( top ) ? top : 0
		bottom = notNil( bottom ) ? bottom : 0

		return { left, right, top, bottom }
	}

	getNextLine( line: CommonLine ): CommonLine {
		const index = findArrayLastIndex( this.lines, line )

		if ( notNil( index ) ) {
			return this.lines[ index + 1 ]
		}

		return null
	}

	getPrevLine( line: CommonLine ): CommonLine {
		const index = findArrayFirstIndex( this.lines, line )

		if ( notNil( index ) ) {
			return this.lines[ index - 1 ]
		}

		return null
	}

	// ===============================
	// =========== mutations =========
	// ===============================
	/**
	 * Initialization
	 */
	createStartSegment( props: any ) {
		return new Segment( {
			draw          : this.draw,
			orthogonalLine: this,
			fillColor     : this.startSegmentFillColor,
			...props
		} )
	}

	createEndSegment( props: any ) {
		return new Segment( {
			draw          : this.draw,
			orthogonalLine: this,
			fillColor     : this.endSegmentFillColor,
			...props
		} )
	}

	createCornerSegment( props: any ) {
		return new CornerSegment( {
			draw          : this.draw,
			...props,
			orthogonalLine: this,
			fillColor     : "grey",
			draggable     : false,
			show          : this.showCorner
		} )
	}

	createStartCenterSegment( props: any ) {
		return new StartCenterSegment( {
			draw          : this.draw,
			orthogonalLine: this,
			show          : this.showCenterSegment,
			...props
		} )
	}

	createEndCenterSegment( props: any ) {
		return new EndCenterSegment( {
			draw          : this.draw,
			orthogonalLine: this,
			show          : this.showCenterSegment,
			...props
		} )
	}

	createEndInnerCenterSegment( props: any ) {
		return new InnerCenterSegment( {
			draw          : this.draw,
			orthogonalLine: this,
			show          : this.showCenterSegment,
			...props
		} )
	}

	createStartLine( props: any ) {
		const { isSimpleLine, showArrow } = this
		return new StartLine( {
			draw          : this.draw,
			...props,
			orthogonalLine: this,
			fillColor     : this.isSimpleLine ?
				this.innerLineFillColor :
				this.startLineFillColor,
			draggable            : false,
			showArrow            : isSimpleLine ? showArrow : false,
			isPart               : true,
			shouldRenderInMiniMap: this.shouldRenderInMiniMap,
			addedToBottom        : this.addedToBottom,
		} )
	}

	createEndLine( props: any ) {
		const { showArrow } = this
		return new EndLine( {
			draw                 : this.draw,
			...props,
			orthogonalLine       : this,
			fillColor            : this.endLineFillColor,
			showArrow            : showArrow,
			draggable            : false,
			isPart               : true,
			shouldRenderInMiniMap: this.shouldRenderInMiniMap,
			addedToBottom        : this.addedToBottom
		} )
	}

	createInnerLine( props: any ) {
		return new InnerLine( {
			draw                 : this.draw,
			...props,
			orthogonalLine       : this,
			draggable            : false,
			fillColor            : this.innerLineFillColor,
			isPart               : true,
			shouldRenderInMiniMap: this.shouldRenderInMiniMap,
			addedToBottom        : this.addedToBottom
		} )
	}

	/**
	 * // Corner segment
	 */
	addCornerSegmentStart( point: Point2D ) {
		const corner: CornerSegment = this.createCornerSegment( point )

		this.cornerSegments = [ corner, ...this.cornerSegments ]
	}
	addCornerSegmentEnd( point: Point2D ) {
		const corner: CornerSegment = this.createCornerSegment( point )

		this.cornerSegments = [ ...this.cornerSegments, corner ]
	}
	removeCornerSegment( corner: CornerSegment ) {
		removeElement( this.cornerSegments, corner )
		this.actions.REMOVE_ELEMENT( corner )
	}

	removeCornerSegments( corners: CornerSegment[] ) {
		corners.map( this.removeCornerSegment.bind( this ) )
	}

	/**
	 * // Add temporary line
	 */
	addTmpStartLine( props: any ) {
		return this.createStartLine( props )
	}

	addTmpEndLine( props: any ) {
		return this.createEndLine( props )
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
		const points: Point2D[] = this.segments.map( ( { point } ) => point )

		const clonedSegmentsPoints = clonePoints(
			this.segments.map( segment => segment.point )
		)
		if ( isNotNil( this.startSegment ) ) {
			clonedSegmentsPoints.map( createCorner )
		}

		const repeatedCorners: CornerSegment[] = this.cornerSegments.filter(
			notSameDirection
		)

		this.removeCornerSegments( repeatedCorners )

		function createCorner(
			segmentPoint: Segment,
			index: number,
			clonedSegmentsPoints
		) {
			if ( notFirst( index ) ) {
				const prev: Segment = clonedSegmentsPoints[ index - 1 ]

				if ( isNextCornerPoint( prev, segmentPoint ) ) {
					const cornerSegment = self._createCornerSegmentBetween(
						prev,
						segmentPoint
					)
					isNotNil( cornerSegment ) &&
						self._insertCornerSegment( segmentPoint, cornerSegment )
				}
			}
		}

		function notSameDirection(
			corner: CornerSegment,
			index: number,
			array: CornerSegment[]
		) {
			if ( !isFirst( index ) && !isLast( index, array ) ) {
				const prev: CornerSegment = prevElement( array, index )
				const next: CornerSegment = nextElement( array, index )

				const { x, y } = corner
				const { x: px, y: py } = prev
				const { x: nx, y: ny } = next
				return ( x === px && x === nx ) || ( y === py && y === ny )
			}

			return false
		}
	}

	_insertCornerSegment( segment: Segment, corner: any ) {
		const index = findArrayFirstIndex(
			this.segments.map( ( { id } ) => id ),
			segment.id
		)
		if ( notNil( index ) ) {
			const cornerIndex = index - 1
			this.cornerSegments.splice( cornerIndex, 0, corner )
		}
	}

	_refreshLines() {
		this._removeLines()

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

	_removeLines() {
		this.lines.map( line => {
			if ( notNil( line ) ) {
				this.actions.REMOVE_ELEMENT( line.centerSegment )
				this.actions.REMOVE_ELEMENT( line )
			}
		} )
	}

	/**
	 * Base on startSegment, endSegment, cornerSegments,
	 * then refresh startLine, endLine, innerLines, centerSegments
	 */
	refresh() {
		this._refreshLines()
	}

	/**
	 * // Translation
	 */
	translateStartToPoint( point: Point2D ) {
		notNil( this.startSegment ) && this.startSegment.translateToPoint( point )
		this.refresh()
	}
	translateTargetToPoint( point: Point2D ) {
		notNil( this.endSegment ) && this.endSegment.translateToPoint( point )
		this.refresh()
	}

	// ===============================
	// =========== actions ===========
	// ===============================
	render() {}

	updateCenterSegmentsPosition() {
		this.lines.map( line => line.updateCenterSegmentPosition() )
	}

	select() {
		this.sharedActions.selectCells( this.lines )
		super.select()
	}

	updateDrag( event, dragger ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const dx = dragger.getDeltaXToPrevPoint( point )
			const dy = dragger.getDeltaYToPrevPoint( point )

			this.sharedActions.translateSegments( this.segments, dx, dy )
			this.updateCenterSegmentsPosition()
		}
	}

	reGenerate( cornerPoints ) {
		this.removeChildrenElements()

		const segments = cornerPoints.map( mapCreateSegmentInConstructor( this ) )
		const potentialStartSegment = segments[ 0 ]
		const potentialEndSegment = segments[ segments.length - 1 ]

		// this.getters.testUtils.delayRenderPoints( cornerPoints, 'purple' )

		// if ( notNil( potentialStartSegment ) ) {
		// 	this.startSegment = potentialStartSegment
		// 	this.startSegment.orthogonalLine = this
		// }

		// if ( notNil( potentialEndSegment ) ) {
		// 	this.endSegment = potentialEndSegment
		// }

		this.cornerSegments = segments
			.filter( notFirstElement )
			.filter( notLastElement )

		this._initializeCornerSegments()

		this._refreshLines()
	}

	removeChildrenElements() {
		this.actions.REMOVE_ELEMENTS( [
			...this.cornerSegments,
			...this.lines,
			...this.centerSegments,
			this.startLinking,
			this.endLinking,
		] )

		this.startLinking = null
		this.endLinking = null
		this.cornerSegments = []
	}

	forceRemove() {
		this.startLinking && this.startLinking.forceRemove()
		this.endLinking && this.endLinking.forceRemove()
		this.removeChildrenElements()
		this.remove()
	}

	// ===============================
	// =========== Interfaces ===========
	// ===============================
	handleStartSegmentStopDrag( event ) {}
	handleEndSegmentStopDrag( event ) {}
}
