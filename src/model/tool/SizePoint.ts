import Cell from "../Cell"
import SizePoints from "./SizePoints"
import Item from "../Item"
import SizeUtils from "../../util/geometry/SizeUtils"

const { PI } = Math

class SizePoint extends Cell {
	sizePoints: SizePoints

	constructor( props ) {
		super( props )

		this.sizePoints = props.sizePoints
	}

	get path2d(): Path2D {
		const path = new Path2D()
		path.arc( this.x, this.y, 5, 0, PI * 2 )
		return path
	}

	get point(): Point2D {
		return { x: 0, y: 0 }
	}

	get x(): number {
		return this.point.x
	}

	get y(): number {
		return this.point.y
	}

	get target(): Item {
		return this.sizePoints.target
	}

	get targetUnitKX(): number {
		return this.target.unitKX
	}

	get targetUnitKY(): number {
		return this.target.unitKY
	}

	render() {
		const { ctx } = this.getters

		ctx.save()
		ctx.fillStyle = "black"
		ctx.fill( this.path2d )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.sharedActions.translatePoint( this.point, deltaX, deltaY )

		this.getters.draw.render()
	}
}

export class LeftTop extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.leftTopPoint
	}

	updateDrag( event ) {
		const { rightBottomPoint } = this.sizePoints
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		const { kX, kY } = this.target
		const { x, y } = this.point
		const potentialNewPoint: Point2D = {
			x: x + deltaX,
			y: y + deltaY
		}
		const sizeK: SizeK = SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			rightBottomPoint
		)

		const newKX = sizeK.kX
		const newKY = sizeK.kY

		this.sharedActions.sizeItem( this.target, newKX, newKY, rightBottomPoint )

		this.getters.draw.render()
	}
}
