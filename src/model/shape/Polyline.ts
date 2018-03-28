import { POLYLINE } from "../../store/constant/cellType"
import Segment from "../Segment"
import getLineRotatableBounds from "../../util/geometry/getLineRotatableBounds"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"
import Line from './Line';
import getArrowPoints from "../../util/geometry/getArrowPoints";

export default class Polyline extends Line {
	type: string = POLYLINE


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
		const self = this
		const { lineWidth } = this
		let path2d: Path2D = new Path2D()

		this.twoPointsLines.map( resolve )

		return path2d

		function resolve( twoPointsLine: TwoPointsLineType ) {
			const hitBounds: RotatableBounds = getLineRotatableBounds(
				twoPointsLine.source,
				twoPointsLine.target,
				lineWidth
			)

			const {
				leftTop,
				rightTop,
				rightBottom,
				leftBottom
			}: RotatableBounds = hitBounds

			connectPolygonPoints( [ leftTop, rightTop, rightBottom, leftBottom ], path2d )
		}
	}

	get targetArrowPath2d(): Path2D {
		const { length } = this.segments
		const source: Point2D = this.segments[ length - 2 ].point
		const target: Point2D = this.target.point

		const points = getArrowPoints( source, target, 20 )
		const { top, right, bottom, left } = points
		const path2d: Path2D = connectPolygonPoints( [ top, right, bottom, left ] )
		return path2d
	}
}
