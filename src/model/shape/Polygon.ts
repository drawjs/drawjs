import Graph from "model/Graph"
import pointInPolygon from "util/geometry/pointInPolygon"
import RectContainer from "model/tool/RectContainer"
import translatePoints from "util/geometry/translatePoints"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints";

export default class Polygon extends Graph {

	points: Point2D[] = []
	basicPoints: Point2D[] = []
	// rectContainer: RectContainer

	get path(): Path2D {
		const path: Path2D = connectPolygonPoints( this.points )
		return path
	}

	get rectContainer(): RectContainer {
		return new RectContainer( this.points, this )
	}

	constructor( props ) {
		super( props )

		this.points = props.points

		this.basicPoints = props.points
		// this.rectContainer = new RectContainer( this.points, this )

	}

	translate( x: number, y: number ) {
		this.points = translatePoints( this.points, x, y )
	}
	rotate() {
		const self = this

		// reset()

		this.points = rotatePoints( this.basicPoints, this.radianAngle, this.rectContainer.basicCenter )

		// function reset() {
		// 	self.points = rotatePoints( self.points, 0, self.rectContainer.basicCenter )
		// }
	}

	render() {
		this.rotate()

		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()
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
