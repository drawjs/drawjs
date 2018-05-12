import renderPoint from "../util/canvas/renderPoint"
import Getters from "../store/draw/Getters"

export default class TestUtils {
	getters: Getters

	constructor( getters ) {
		this.getters = getters
	}

	renderPoint( point: Point2D, color?: string ) {
		return renderPoint( point, this.getters.canvas, color )
	}

	renderPoints( points: Point2D[], color?: string ) {
		points.map( point => this.renderPoint( point, color ) )
	}

	delayRenderPoint( point: Point2D, color?: string ) {
		setTimeout( () => {
			this.renderPoint( point, color )
		}, 1 )
	}

	delayRenderPoints( points: Point2D[], color?: string ) {
		points.map( point => this.delayRenderPoint( point, color ) )
	}


}
