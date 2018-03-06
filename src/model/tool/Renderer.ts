import getters from "../../store/draw/getters"

export default class Renderer {
	get ctx(): CanvasRenderingContext2D {
		return getters.ctx
	}

	clear() {
		getters.renderer.resetTransform()
		getters.ctx.clearRect( 0, 0, getters.canvasWidth, getters.canvasHeight )
	}

	resetTransform() {
		this.ctx.setTransform( 1, 0, 0, 1, 0, 0 )
	}

	setTransformViewPort() {
		const { zoom, movementX, movementY } = getters
		this.ctx.setTransform( zoom, 0, 0, zoom, movementX, movementY )
	}
}
