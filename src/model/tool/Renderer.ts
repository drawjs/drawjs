import Particle from "../Particle"

export default class Renderer extends Particle {
	constructor( props ) {
		super( props )
	}

	get ctx(): CanvasRenderingContext2D {
		return this.getters.ctx
	}

	clear() {
		this.getters.renderer.resetTransform()
		this.getters.ctx.clearRect( 0, 0, this.getters.canvasWidth, this.getters.canvasHeight )
	}

	resetTransform() {
		this.ctx.setTransform( 1, 0, 0, 1, 0, 0 )
	}

	setTransformViewPort() {
		const { zoom, movementX, movementY } = this.getters
		this.ctx.setTransform( zoom, 0, 0, zoom, movementX, movementY )
	}
}
