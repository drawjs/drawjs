import Graph from "model/Graph"
import pointInPolygon from "util/geometry/pointInPolygon"
import RectContainer from "model/tool/RectContainer"
import translatePoints from "util/geometry/translatePoints"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import { POLYGON } from "store/constant/cellType"
import { isNotNil } from "util/index"
import { isNil } from 'lodash';

export default class Polygon extends Graph {
	type = POLYGON

	basicPoints: Point2D[] = []
	// rectContainer: RectContainer

	get pathPoints(): Point2D[] {
		const rotatedPoints: Point2D[] = rotatePoints(
			this.basicPoints,
			this.radianAngle,
			this.rectContainer.basicCenter
		)
		return rotatedPoints
	}

	get path(): Path2D {
		const path: Path2D = connectPolygonPoints( this.pathPoints )
		return path
	}

	get rectContainer(): RectContainer {
		return new RectContainer( {
			points: this.basicPoints,
			target: this,
			draw: this.draw
		} )
	}

	constructor( props ) {
		super( props )

		this.basicPoints = props.points
	}

	translate( deltaX: number, deltaY: number ) {
		this.basicPoints = translatePoints( this.basicPoints, deltaX, deltaY )
	}

	render() {
		const { ctx } = this.getters
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()

		this.rectContainer.render()
	}

	contain( x: number, y: number ) {
		const isContain = this.getters.pointOnPath( { x, y }, this.path )
		return isContain
	}


	// ******* Drag ******
	public updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		this.translate( deltaX, deltaY )

		this.draw.render()
	}
	// ******* Drag ******
}
