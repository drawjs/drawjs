import Cell from "../Cell"
import SizePoints from "./SizePoints"
import Item from "../Item"
import SizeUtils from "../../shared/SizeUtils"
import { SIZE_POINT } from "../../store/constant/cellType"

const { PI } = Math

export abstract class SizePoint extends Cell {
	type = SIZE_POINT

	sizePoints: SizePoints

	constructor( props ) {
		super( props )

		this.sizePoints = props.sizePoints
	}

	get sizable(): boolean {
		return this.target.sizable
	}

	get path2d(): Path2D {
		const path = new Path2D()
		path.arc( this.x, this.y, 5, 0, PI * 2 )
		return path
	}

	get point(): Point2D {
		return { x: 0, y: 0 }
	}

	get center(): Point2D {
		return this.target.itemCenter
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
		const isContain =
			this.sizable && this.getters.pointOnPath( { x, y }, this.path2d )
		return isContain
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const deltaX = this.dragger.getDeltaXToPrevPoint( point )
			const deltaY = this.dragger.getDeltaYToPrevPoint( point )

			const { kX, kY } = this.target
			const { x, y } = this.point
			const potentialNewPoint: Point2D = {
				x: x + deltaX,
				y: y + deltaY
			}

			const sizeK: SizeK = this.getNewK(
				kX,
				kY,
				this.point,
				potentialNewPoint,
				this.center,
				this.target.angle
			)

			const newKX = sizeK.kX
			const newKY = sizeK.kY

			this.sharedActions.sizeItem( this.target, newKX, newKY, this.center )
		}
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return
	}
}

export class LeftTop extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.leftTopPoint
	}

	get center(): Point2D {
		return this.sizePoints.rightBottomPoint
	}
	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle
		)
	}
}

export class Top extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.topPoint
	}

	get center(): Point2D {
		return this.sizePoints.bottomPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle,
			true,
			false
		)
	}
}

export class RightTop extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.rightTopPoint
	}

	get center(): Point2D {
		return this.sizePoints.leftBottomPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle
		)
	}
}

export class Left extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.leftPoint
	}

	get center(): Point2D {
		return this.sizePoints.rightPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle,
			false,
			true
		)
	}
}

export class Right extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.rightPoint
	}

	get center(): Point2D {
		return this.sizePoints.leftPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle,
			false,
			true
		)
	}
}

export class LeftBottom extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.leftBottomPoint
	}

	get center(): Point2D {
		return this.sizePoints.rightTopPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle
		)
	}
}

export class Bottom extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.bottomPoint
	}

	get center(): Point2D {
		return this.sizePoints.topPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle,
			true,
			false
		)
	}
}

export class RightBottom extends SizePoint {
	constructor( props ) {
		super( props )
	}

	get point(): Point2D {
		return this.sizePoints.rightBottomPoint
	}

	get center(): Point2D {
		return this.sizePoints.leftTopPoint
	}

	getNewK(
		kX: number,
		kY: number,
		point: Point2D,
		potentialNewPoint: Point2D,
		center: Point2D,
		rotatedAngle: number
	): SizeK {
		return SizeUtils.getNewK(
			kX,
			kY,
			this.point,
			potentialNewPoint,
			this.center,
			this.target.angle
		)
	}
}
