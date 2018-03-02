import Cell from "../Cell"
import getters from "../../store/draw/getters";
import DESELECT_ALL_CELLS from "../../store/draw/actions";

export default class Selector extends Cell {
	startPoint: Point2D
	endPoint: Point2D

	get path(): Path2D {
		return
	}

	constructor( props ) {
		super( props )

		const self = this

		const canvas = getters.canvas

		canvas.removeEventListener( "mousedown", mousedownListener )
		canvas.addEventListener( "mousedown", mousedownListener )

		canvas.removeEventListener( "mousemove", mousemoveListener )
		canvas.addEventListener( "mousemove", mousemoveListener )

		canvas.removeEventListener( "mouseup", mouseupListener )
		canvas.addEventListener( "mouseup", mouseupListener )

		function mousedownListener( event ) {
			const point = getters.getPoint( event )
			if ( getters.pointOnEmpty( point ) ) {
				DESELECT_ALL_CELLS()
			}
		}

		function mousemoveListener() {

		}

		function mouseupListener() {

		}
	}

	contain( x: number, y: number ) {}

	render() {}
}
