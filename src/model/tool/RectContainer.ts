import Graph from "../Graph"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints";
import Particle from '../Particle';
import Segment from '../Segment'
const { max, min } = Math

export default class RectContainer extends Particle {
	// /**
	//  * Graph target
	//  */
	// target: Graph

	// /**
	//  *
	//  * @param points Bound points
	//  * @param target Graph target
	//  */
	// constructor( props) {
	// 	super( props )

	// 	this.target = props.target
	// }

	// get targetCenter(): Point2D {
	// 	// return this.target.segmentsCenter
	// }
	// get targetSegments(): Segment[] {
	// 	// return this.target.segments
	// }
	// get targetAngle(): number {
	// 	return this.target.angle
	// }
	// get targetRadian() {
	// 	return this.target.radian
	// }
	// get targetPoints(): Segment[] {
	// 	// return this.target.segments.map( segment => segment.point )
	// }
	// get targetBasicPoints(): Point2D[] {
	// 	const res: Point2D[] = rotatePoints( this.targetPoints, - this.targetRadian, this.targetCenter )
	// 	return res
	// }
	// get targetSegmentsX(): number[] {
	// 	const res: number[] = this.targetBasicPoints.map(
	// 		( segment: Segment ) => segment.x
	// 	)
	// 	return res
	// }
	// get targetSegmentsY(): number[] {
	// 	const res: number[] = this.targetBasicPoints.map(
	// 		( segment: Segment ) => segment.y
	// 	)
	// 	return res
	// }
	// get basicLeft(): number {
	// 	const res: number = min( ...this.targetSegmentsX )
	// 	return res
	// }
	// get basicRight(): number {
	// 	const res: number = max( ...this.targetSegmentsX )
	// 	return res
	// }
	// get basicTop(): number {
	// 	const res: number = min( ...this.targetSegmentsY )
	// 	return res
	// }
	// get basicBottom(): number {
	// 	const res: number = max( ...this.targetSegmentsY )
	// 	return res
	// }
	// get basicWidth(): number {
	// 	return this.basicRight - this.basicLeft
	// }
	// get basicHeight(): number {
	// 	return this.basicBottom - this.basicTop
	// }
	// get basicCenter(): Point2D {
	// 	return this.targetCenter
	// }
	// /**
	//  * Points not rotated and sized
	//  */
	// get basicPoints(): Point2D[] {
	// 	return [
	// 		{
	// 			x: this.basicLeft,
	// 			y: this.basicTop
	// 		},
	// 		{
	// 			x: this.basicRight,
	// 			y: this.basicTop
	// 		},
	// 		{
	// 			x: this.basicRight,
	// 			y: this.basicBottom
	// 		},
	// 		{
	// 			x: this.basicLeft,
	// 			y: this.basicBottom
	// 		}
	// 	]
	// }

	// get points(): Point2D[] {
	// 	const res: Point2D[] = rotatePoints( this.basicPoints, this.targetRadian, this.targetCenter )
	// 	return res
	// }

	// render() {
	// 	const { ctx } = this.getters
	// 	const path: Path2D = connectPolygonPoints( this.points )

	// 	ctx.save()
	// 	ctx.lineWidth = 5
	// 	ctx.strokeStyle = "black"
	// 	ctx.stroke( path )
	// 	ctx.restore()
	// }
}
