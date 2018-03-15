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

	delayRenderPoint( point: Point2D, color?: string ) {
		setTimeout( () => {
			this.renderPoint( point, color )
		}, 1 )
	}


}
