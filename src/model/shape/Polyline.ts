import Path from "../Path"
import { POLYLINE } from "../../store/constant/cellType"
import Segment from "../Segment"

export default class Polyline extends Path {
	type: string = POLYLINE

	rotatable: boolean = false
	sizable: boolean = false

	/**
	 * Override
	 */
	t = 1

	color: string = "#999"

	segments: Segment[]

	lineWidth: number = 1

	showArrow: boolean = true

	constructor( props: PolylineProps ) {
		super( props )
	}

	get twoPointsLines(): TwoPointsLineType[] {
		const res: TwoPointsLineType[] = this.sharedGetters.getTwoPointsLine(
			this.points
		)
		return res
	}

	get hitRegionPath2d(): Path2D {
		console.log( this.twoPointsLines )


		return new Path2D()
	}

	render() {
		this.renderHitRegion()
	}

	renderHitRegion() {
		const { ctx } = this.getters
		ctx.save()
		ctx.fillStyle = this.color
		ctx.fill( this.hitRegionPath2d )
		ctx.restore()
	}

	contain( x: number, y: number ) {
		return false
	}
}
