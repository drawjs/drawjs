import Cell from "model/Cell"
import RectContainer from "./RectContainer"
import getRectVertices from "util/geometry/getRectVertices"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import coupleRotatingCell from "../../mixin/coupleRotatingCell"
import coupleSelectCell from "../../mixin/coupleSelectCell"
import { getPointAngleToOrigin } from "../../util/index"
import { RADIAN_TO_DEGREE, ROTATION_ARROW_SRC } from '../../store/constant/index';
import rotate from "../../util/geometry/rotate"

export default class RotationArrow extends Cell {
	/**
	 * Graph target to rotate
	 */
	target: any


	img: HTMLImageElement = new Image()

	/**
	 * Graph target's radian
	 */
	get radian(): number {
		return this.target.radianAngle
	}

	get rectContainer(): RectContainer {
		return this.target.rectContainer
	}

	get basicCenter(): Point2D {
		const { SPACE } = RotationArrow
		const { basicCenter: basicCenter_r, basicTop } = this.rectContainer
		const basicCenter: Point2D = {
			x: basicCenter_r.x,
			y: basicTop - SPACE
		}

		return basicCenter
	}

	get rotatedCenter(): Point2D {
		const { basicCenter: basicCenter_r } = this.rectContainer
		const res: Point2D = rotate(
			this.basicCenter,
			this.radian,
			basicCenter_r
		)
		return res
	}

	/**
	 * Space between icon and graph the topo of target's rect container
	 */
	static SPACE: number = 20

	static SIZE: number = 20

	get path(): Path2D {
		const { SIZE } = RotationArrow
		const { basicCenter: basicCenter_r } = this.rectContainer

		const basicRectPoints: Point2D[] = getRectVertices(
			this.basicCenter,
			SIZE,
			SIZE
		)

		const rotatedRectPoints: Point2D[] = rotatePoints(
			basicRectPoints,
			this.radian,
			basicCenter_r
		)

		const path: Path2D = connectPolygonPoints( rotatedRectPoints )

		return path
	}

	constructor( props ) {
		super( props )
		this.target = props.target

		this.img.src = ROTATION_ARROW_SRC
	}

	render() {
		const { ctx } = this.draw
		const { SIZE } = RotationArrow
		ctx.save()
		ctx.transform( 1, 0, 0, 1, this.rotatedCenter.x, this.rotatedCenter.y )
		ctx.drawImage(
			this.img,
			-SIZE / 2,
			-SIZE / 2,
			SIZE,
			SIZE
		)
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const res: boolean = this.draw.ctx.isPointInPath( this.path, x, y )
		return res
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		const { x: eventX, y: eventY }: Point2D = event
		const x = eventX - this.draw.canvasLeft
		const y = eventY - this.draw.canvasTop

		const { x: prevEventX, y: prevEventY } = this._prevDraggingPoint
		const prevX = prevEventX - this.draw.canvasLeft
		const prevY = prevEventY - this.draw.canvasTop

		const {
			x: centerX_r,
			y: centerY_r
		}: Point2D = this.rectContainer.basicCenter

		const deltaRadian =
			getPointAngleToOrigin( { x: x - centerX_r, y: y - centerY_r } ) -
			getPointAngleToOrigin( {
				x: prevX - centerX_r,
				y: prevY - centerY_r
			} )


		const radian = this.radian + deltaRadian

		// console.log( radian * RADIAN_TO_DEGREE )

		this._updatePrevDraggingPoint( event )

		this.target.angle = radian * RADIAN_TO_DEGREE

		this.draw.render()
	}
	// ******* Drag ******
}
