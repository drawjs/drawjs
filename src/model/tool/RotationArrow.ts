import Cell from "model/Cell"
import RectContainer from "./RectContainer"
import getRectVertices from "util/geometry/getRectVertices"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import coupleRotatingCell from "../../mixin/coupleRotatingCell"
import coupleSelectCell from "../../mixin/coupleSelectCell"
import { getPointAngleToOrigin } from "../../util/index"
import { RADIAN_TO_DEGREE } from "../../store/constant/index";

export default class RotationArrow extends Cell {
	/**
	 * Graph target to rotate
	 */
	target: any

	/**
	 * Graph target's radian
	 */
	get radian(): number {
		return this.target.radianAngle
	}

	get rectContainer(): RectContainer {
		return this.target.rectContainer
	}

	/**
	 * Space between icon and graph the topo of target's rect container
	 */
	static SPACE: number = 20

	static SIZE: number = 20

	get path(): Path2D {
		const { SPACE, SIZE } = RotationArrow
		const { basicCenter: basicCenter_r, basicTop } = this.rectContainer
		const basicCenter: Point2D = {
			x: basicCenter_r.x,
			y: basicTop - SPACE
		}

		const basicRectPoints: Point2D[] = getRectVertices(
			basicCenter,
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
	}

	render() {
		const { ctx } = this.draw

		ctx.save()
		ctx.fillStyle = "grey"
		ctx.fill( this.path )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		const res: boolean = this.draw.ctx.isPointInPath( this.path, x, y )
		return res
	}

	// ******* Drag ******
	public handleStartDrag( event ) {
		if ( this.target.isSelected ) {
			coupleRotatingCell( this.target, true )
			coupleSelectCell( this.target, false )
		}
	}

	public _updateDrag( event ) {
		// if ( !this.target.isRotating ) {
		// 	return
		// }
		const { x, y }: Point2D = event
		const { canvasLeft, canvasTop } = this.draw
		const { x: centerX, y: centerY } = this.rectContainer.basicCenter

		const radian =
			getPointAngleToOrigin( {
				x: x - canvasLeft - centerX,
				y: y - canvasTop - centerY
			} ) +
			Math.PI / 2

		console.log( radian )

		this._updatePrevDraggingPoint( event )

		this.target.angle = radian * RADIAN_TO_DEGREE

		this.draw.render()
	}
	public handleStopDrag( event ) {
		// if ( this.target.isRotating ) {
			// coupleRotatingCell( this.target, false )
			// coupleSelectCell( this.target, true )
			// this.draw.render()
		// }
	}
	// ******* Drag ******
}
