import Cell from "./Cell"
import SizeContainer from "../model/tool/SizeContainer"
import RotationArrow from "./tool/RotationArrow"
import { isBoolean } from "lodash"
import rotate from "../util/geometry/rotate"
import SizePoints from "./tool/SizePoints"

export default abstract class Item extends Cell {
	sizeContainer: SizeContainer
	sizePoints: SizePoints

	/**
	 * // Rotation
	 */
	rotatable: boolean = true
	rotationArrow: RotationArrow

	/**
	 * // Size
	 */
	/**
	 * Be able to size
	 */
	sizable: boolean = true

	constructor( props ) {
		super( props )

		if ( this.sizable ) {
			this.sizeContainer = new SizeContainer( {
				draw  : this.draw,
				target: this
			} )
		}

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

	implementInUpperConstructor() {
		this.sizePoints = new SizePoints( {
			draw         : this.draw,
			sizeContainer: this.sizeContainer
		} )
	}

	/**
	 * Bounds
	 */
	get bounds(): Bounds {
		return this.itemInitialBounds
	}

	get boundsExtra(): BoundsExtra {
		const { left, top, right, bottom } = this.bounds
		return {
			left,
			top,
			right,
			bottom,
			leftCenter: {
				x: left,
				y: ( bottom + top ) / 2,
			},
			topCenter: {
				x: ( left + right ) / 2,
				y: top
			},
			rightCenter: {
				x: right,
				y: ( bottom + top ) / 2
			},
			bottomCenter: {
				x: ( left + right ) / 2,
				y: bottom
			}
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
			bottom: 0,
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
		const bothPositive = uX > 0 && uY > 0
		// const uX = 1
		// const uY = 1
		let updated1: Point2D = {
			x: rotated1.x,
			y: rotated1.y
		}

		let updated2: Point2D = {
			x: rotated2.x,
			y: rotated2.y
		}

		let updated3: Point2D = {
			x: rotated3.x,
			y: rotated3.y
		}

		let updated4: Point2D = {
			x: rotated4.x,
			y: rotated4.y
		}

		if ( uX > 0 && uY > 0 ) {
			// No need to update
		}

		if ( uX < 0 && uY < 0 ) {
			updated1 = {
				x: rotated3.x,
				y: rotated3.y
			}
			updated2 = {
				x: rotated4.x,
				y: rotated4.y
			}
			updated3 = {
				x: rotated1.x,
				y: rotated1.y
			}
			updated4 = {
				x: rotated2.x,
				y: rotated2.y
			}
		}

		if ( uX > 0 && uY < 0 ) {
			updated1 = {
				x: rotated4.x,
				y: rotated4.y
			}
			updated2 = {
				x: rotated3.x,
				y: rotated3.y
			}
			updated3 = {
				x: rotated2.x,
				y: rotated2.y
			}
			updated4 = {
				x: rotated1.x,
				y: rotated1.y
			}
		}

		if ( uX < 0 && uY > 0 ) {
			updated1 = {
				x: rotated2.x,
				y: rotated2.y
			}
			updated2 = {
				x: rotated1.x,
				y: rotated1.y
			}
			updated3 = {
				x: rotated4.x,
				y: rotated4.y
			}
			updated4 = {
				x: rotated3.x,
				y: rotated3.y
			}
		}

		const res: Container = {
			leftTop    : updated1,
			rightTop   : updated2,
			rightBottom: updated3,
			leftBottom : updated4
		}

		return res
	}

	size( kX: number, kY: number, center: Point2D ) {}

	renderTransformWidget() {
		const { shouldSelect } = this

		if ( shouldSelect ) {
			this.sizeContainer.render()
			this.sizePoints.render()
		}

		if ( this.rotationArrow.shouldRender ) {
			this.sizeContainer.render()
			this.rotationArrow.render()
		}
	}
}
