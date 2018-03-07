import Graph from "../Graph"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints";
import Particle from '../Particle';
const { max, min } = Math

export default class RectContainer extends Particle {
	/**
	 * Graph target
	 */
	target: Graph
	contentPoints: Point2D[] = []

	/**
	 *
	 * @param points Bound points
	 * @param target Graph target
	 */
	constructor( props) {
		super( props )

		this.contentPoints = props.points
		this.target = props.target
	}

	get _contentPointsX(): number[] {
		const res: number[] = this.contentPoints.map(
			( point: Point2D ) => point.x
		)
		return res
	}
	get _contentPointsY(): number[] {
		const res: number[] = this.contentPoints.map(
			( point: Point2D ) => point.y
		)
		return res
	}
	get _radian() {
		return this.target.radianAngle
	}
	get basicLeft(): number {
		const res: number = min( ...this._contentPointsX )
		return res
	}
	get basicRight(): number {
		const res: number = max( ...this._contentPointsX )
		return res
	}
	get basicTop(): number {
		const res: number = min( ...this._contentPointsY )
		return res
	}
	get basicBottom(): number {
		const res: number = max( ...this._contentPointsY )
		return res
	}
	get basicWidth(): number {
		return this.basicRight - this.basicLeft
	}
	get basicHeight(): number {
		return this.basicBottom - this.basicTop
	}
	get basicCenter(): Point2D {
		return {
			x: ( this.basicLeft + this.basicRight ) / 2,
			y: ( this.basicTop + this.basicBottom ) / 2
		}
	}
	/**
	 * Points not rotated and sized
	 */
	get basicPoints(): Point2D[] {
		return [
			{
				x: this.basicLeft,
				y: this.basicTop
			},
			{
				x: this.basicRight,
				y: this.basicTop
			},
			{
				x: this.basicRight,
				y: this.basicBottom
			},
			{
				x: this.basicLeft,
				y: this.basicBottom
			}
		]
	}

	get points(): Point2D[] {
		const res: Point2D[] = rotatePoints( this.basicPoints, this._radian, this.basicCenter )
		return res
	}

	render() {
		const { ctx } = this.getters
		const path: Path2D = connectPolygonPoints( this.points )

		ctx.save()
		ctx.lineWidth = 5
		ctx.strokeStyle = "black"
		ctx.stroke( path )
		ctx.restore()
	}
}
