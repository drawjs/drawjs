import Graph from "model/Graph"
import pointInPolygon from "util/geometry/pointInPolygon"
import RectContainer from "model/tool/RectContainer"
import translatePoints from "util/geometry/translatePoints"
import rotatePoints from "util/geometry/rotatePoints"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"
import { POLYGON } from "store/constant/cellType"
import { isNotNil } from "util/index"
import { isNil, cloneDeep } from 'lodash';
import Segment from "../Segment"

export default class Polygon extends Graph {
	type = POLYGON

	// rectContainer: RectContainer

	constructor( props ) {
		super( props )

		this.segments = props.points.map(
			point => new Segment( { draw: this.draw, x: point.x, y: point.y } )
		)
	}

	get path(): Path2D {
		this.rotate()

		const path: Path2D = connectPolygonPoints( this.segments )
		return path
	}

	get rectContainer(): RectContainer {
		return new RectContainer( {
			segments: this.segments,
			target  : this,
			draw    : this.draw
		} )
	}

	translate( deltaX: number, deltaY: number ) {
		this.sharedActions.translateSegments( this.segments, deltaX, deltaY )
	}



	render() {
		const { ctx } = this.getters
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()

		// this.rectContainer.render()

		this.sharedActions.renderSegments( this.segments )
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
