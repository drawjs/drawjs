import Graph from "model/Graph"
import pointInPolygon from "util/geometry/pointInPolygon"
import RectContainer from "model/tool/RectContainer"
import translatePoints from "util/geometry/translatePoints"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints";

export default class Polygon extends Graph {

	basicPoints: Point2D[] = []
	// rectContainer: RectContainer

	get pathPoints(): Point2D[] {
		const rotatedPoints: Point2D[] = rotatePoints( this.basicPoints, this.radianAngle, this.rectContainer.basicCenter )
		return rotatedPoints
	}

	get path(): Path2D {
		const path: Path2D = connectPolygonPoints( this.pathPoints )
		return path
	}

	get rectContainer(): RectContainer {
		return new RectContainer( this.basicPoints, this )
	}

	constructor( props ) {
		super( props )

		this.basicPoints = props.points
		// this.rectContainer = new RectContainer( this.points, this )

	}

	translate( x: number, y: number ) {
		this.basicPoints = translatePoints( this.basicPoints, x, y )
	}

	render() {
		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()

		this.rectContainer.render()
	}

	contain( x: number, y: number ) {
		const res: boolean = this.draw.ctx.isPointInPath( this.path, x, y )

		return res
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		const { x, y } = event
		const { x: prevX, y: prevY } = this._prevDraggingPoint
		const deltaX = x - prevX
		const deltaY = y - prevY

		this.translate( deltaX, deltaY )

		this._updatePrevDraggingPoint( event )

		this.draw.render()
	}
	// ******* Drag ******
}
