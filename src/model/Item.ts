import Cell from "./Cell"
import SizeContainer from "model/tool/SizeContainer"
import RotationArrow from "./tool/RotationArrow"
import { isBoolean } from "lodash"
import rotate from "../util/geometry/rotate"
import SizePoints from "./tool/SizePoints"

export default abstract class Item extends Cell {
	sizeContainer: SizeContainer
	sizePoints: SizePoints

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

		const { unitKX: uX, unitKY: uY } = this

		const updated1: Point2D = {
			x: uX > 0 ? rotated1.x : rotated3.x,
			y: uY > 0 ? rotated1.y : rotated3.y
		}

		const updated2: Point2D = {
			x: uX > 0 ? rotated2.x : rotated4.x,
			y: uY > 0 ? rotated2.y : rotated4.y
		}

		const updated3: Point2D = {
			x: uX > 0 ? rotated3.x : rotated1.x,
			y: uY > 0 ? rotated3.y : rotated1.y
		}

		const updated4: Point2D = {
			x: uX > 0 ? rotated4.x : rotated2.x,
			y: uY > 0 ? rotated4.y : rotated2.y
		}

		const res: Container = {
			leftTop    : updated1,
			rightTop   : updated2,
			rightBottom: updated3,
			leftBottom : updated4
		}

		// const res: Container = {
		// 	leftTop: rotated1,
		// 	rightTop: rotated2,
		// 	rightBottom: rotated3,
		// 	leftBottom: rotated4
		// }

		return res
	}

	implementInTopConstructor() {
		this.sizePoints = new SizePoints( {
			draw         : this.draw,
			sizeContainer: this.sizeContainer
		} )
	}

	size( kX: number, kY: number, center: Point2D ) {}
}
