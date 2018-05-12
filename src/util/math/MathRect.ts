import MathSegmentLine from "./MathSegmentLine"
import { notNil, notUndefined } from "../lodash/index"

export const BORDER_TYPES = {
	LEFT: 'left',
	TOP: 'top',
	RIGHT: 'right',
	BOTTOM: 'bottom',
}

export default class MathRect {
	center: Point2D
	width: number
	height: number

	/**
	 * Extending distance
	 */
	ed: number

	constructor(
		center: Point2D,
		width: number,
		height: number,
		extendingDistance: number = 10
	) {
		this.center = center
		this.width = width
		this.height = height

		this.ed = extendingDistance
	}

	get cx() {
		return this.center.x
	}

	get cy() {
		return this.center.y
	}

	get left() {
		return this.cx - this.width / 2
	}

	get right() {
		return this.cx + this.width / 2
	}

	get top() {
		return this.cy - this.height / 2
	}

	get bottom() {
		return this.cy + this.height / 2
	}

	get topCenter(): Point2D {
		return {
			x: this.cx,
			y: this.top
		}
	}

	get bottomCenter(): Point2D {
		return {
			x: this.cx,
			y: this.bottom
		}
	}

	get leftCenter(): Point2D {
		return {
			x: this.left,
			y: this.cy
		}
	}

	get rightCenter(): Point2D {
		return {
			x: this.right,
			y: this.cy
		}
	}

	get leftTop(): Point2D {
		return {
			x: this.left,
			y: this.top
		}
	}

	get rightTop(): Point2D {
		return {
			x: this.right,
			y: this.top
		}
	}

	get leftBottom(): Point2D {
		return {
			x: this.left,
			y: this.bottom
		}
	}

	get rightBottom(): Point2D {
		return {
			x: this.right,
			y: this.bottom
		}
	}

	get leftLine(): LineTwoPoints {
		return [ this.leftBottom, this.leftTop ]
	}

	get rightLine(): LineTwoPoints {
		return [ this.rightTop, this.rightBottom ]
	}

	get topLine(): LineTwoPoints {
		return [ this.leftTop, this.rightTop ]
	}

	get bottomLine(): LineTwoPoints {
		return [ this.rightBottom, this.leftBottom ]
	}

	get leftSegmentLine(): MathSegmentLine {
		return new MathSegmentLine( this.leftBottom, this.leftTop )
	}

	get rightSegmentLine(): MathSegmentLine {
		return new MathSegmentLine( this.rightTop, this.rightBottom )
	}

	get topSegmentLine(): MathSegmentLine {
		return new MathSegmentLine( this.leftTop, this.rightTop )
	}

	get bottomSegmentLine(): MathSegmentLine {
		return new MathSegmentLine( this.rightBottom, this.leftBottom )
	}

	get segmentLines(): MathSegmentLine[] {
		return [
			this.leftSegmentLine,
			this.topSegmentLine,
			this.rightSegmentLine,
			this.bottomSegmentLine
		]
	}

	/**
	 * // Extension
	 */
	get lce(): Point2D {
		return {
			x: this.left - this.ed,
			y: this.cy
		}
	}

	get tce(): Point2D {
		return {
			x: this.cx,
			y: this.top - this.ed
		}
	}

	get rce(): Point2D {
		return {
			x: this.right + this.ed,
			y: this.cy
		}
	}

	get bce(): Point2D {
		return {
			x: this.cx,
			y: this.bottom + this.ed
		}
	}

	get lte(): Point2D {
		return {
			x: this.lce.x,
			y: this.tce.y
		}
	}

	get rte(): Point2D {
		return {
			x: this.rce.x,
			y: this.tce.y
		}
	}

	get rbe(): Point2D {
		return {
			x: this.rce.x,
			y: this.bce.y
		}
	}

	get lbe(): Point2D {
		return {
			x: this.lce.x,
			y: this.bce.y
		}
	}

	get lbci(): BorderCenterInfo {
		return {
			type: 		BORDER_TYPES.LEFT,
			extension       : this.lce,
			cornerExtensions: [ this.lbe, this.lte ],
			mathRect        : this,
		}
	}

	get tbci(): BorderCenterInfo {
		return {
			type: 		BORDER_TYPES.TOP,
			extension       : this.tce,
			cornerExtensions: [ this.lte, this.rte ],
			mathRect        : this
		}
	}

	get rbci(): BorderCenterInfo {
		return {
			type: 		BORDER_TYPES.RIGHT,
			extension       : this.rce,
			cornerExtensions: [ this.rte, this.rbe ],
			mathRect        : this
		}
	}

	get bbci(): BorderCenterInfo {
		return {
			type: 		BORDER_TYPES.BOTTOM,
			extension       : this.bce,
			cornerExtensions: [ this.rbe, this.lbe ],
			mathRect        : this
		}
	}

	intersectSegmentLineInfo( segmentLine: MathSegmentLine ) {
		const res = {
			isInfinite: false,
			intersectd: [
				// {
				// 	point: null,
				// 	segmentLines: []
				// }
			]
		}

		this.segmentLines.map( intersect )
		return res

		function intersect( theSegmentLine: MathSegmentLine ) {
			const { isInfinite, point } = segmentLine.intersect( theSegmentLine )

			if ( isInfinite ) {
				res.isInfinite = true
			}

			notNil( point ) &&
				res.intersectd.push( {
					point,
					segmentLines: [ theSegmentLine, segmentLine ]
				} )
		}
	}

	/**
	 * // MathRect
	 */
	translateCenter( dx: number, dy: number ) {
		const { x, y } = this.center
		this.center = {
			x: x + dx,
			y: y + dy
		}
	}
}
