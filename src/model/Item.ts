import Cell from "./Cell"
import SizeContainer from "model/tool/SizeContainer"
import RotationArrow from "./tool/RotationArrow"
import { isBoolean } from "lodash"
import rotate from "../util/geometry/rotate"

export default abstract class Item extends Cell {
	sizeContainer: SizeContainer

	/**
	 * Rotation
	 */
	rotatable: boolean = true
	rotationArrow: RotationArrow

	constructor( props ) {
		super( props )

		this.sizeContainer = new SizeContainer( {
			draw  : this.draw,
			target: this
		} )

		/**
		 * // Rotation
		 */
		if ( this.rotatable ) {
			this.rotationArrow = new RotationArrow( {
				draw  : this.draw,
				target: this
			} )
		}
	}

	/**
	 * { abstract }
	 * Item center, which is used to rotate and size item
	 */
	get itemCenter(): Point2D {
		return {
			x: 0,
			y: 0
		}
	}

	/**
	 * { abstract }
	 * Item initial bounds,
	 * which rotates `angle` on item center
	 * to get item container
	 */
	get itemInitialBounds(): Bounds {
		return {
			left  : 0,
			right : 0,
			top   : 0,
			bottom: 0
		}
	}

	get itemContainer(): Container {
		const { left, right, top, bottom } = this.itemInitialBounds
		const { radian, itemCenter } = this

		const point1: Point2D = {
			x: left,
			y: top
		}
		const point2: Point2D = {
			x: right,
			y: top
		}
		const point3: Point2D = {
			x: right,
			y: bottom
		}
		const point4: Point2D = {
			x: left,
			y: bottom
		}

		const rotated1: Point2D = rotate( point1, radian, itemCenter )
		const rotated2: Point2D = rotate( point2, radian, itemCenter )
		const rotated3: Point2D = rotate( point3, radian, itemCenter )
		const rotated4: Point2D = rotate( point4, radian, itemCenter )

		const res: Container = {
			leftTop: rotated1,
			rightTop: rotated2,
			rightBottom: rotated3,
			leftBottom: rotated4,
		}

		return res
	}
}
