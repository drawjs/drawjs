import Particle from "../Particle"
import zoomPoint from 'util/geometry/zoom';
import MiniMapViewBox from './MiniMapViewBox';


export default class MiniMap extends Particle {
	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0

	viewBox: MiniMapViewBox

	constructor( props ) {
		super( props )

		this.width = 300
		this.height = 200
		this.left = 0
		this.top = this.getters.canvasHeight - this.height

		this.viewBox = new MiniMapViewBox( { draw: this.draw, miniMap: this } )
	}

	get path(): Path2D {
		const { left, top, width, height } = this
		const path = new Path2D()
		path.rect( left, top, width, height )
		return path
	}

	get canvasWidthInMiniMap(): number {
		return 0
	}

	get canvasHeightInMiniMap(): number {
		return 0
	}

	get fixedPanelPath2d(): Path2D {
		const { canvasWidth, canvasHeight } = this.getters
		const {
			left: miniMapLeft,
			top: miniMapTop,
			width: miniMapWidth,
			height: miniMapHeight
		} = this
		const { initialRatio } = this.viewBox
		const width = canvasWidth / initialRatio
		const height = canvasHeight / initialRatio
		const left = miniMapLeft + miniMapWidth / 2 - width / 2
		const top = miniMapTop + miniMapHeight / 2 - height / 2

		let path2d: Path2D = new Path2D()
		path2d.rect( left, top, width, height )

		return path2d
	}

	render() {
		const { ctx } = this.getters

		this.getters.renderer.resetTransform()

		ctx.strokeStyle = "black"
		ctx.stroke( this.path )

		ctx.fillStyle = "grey"
		ctx.fill( this.path )


		this.renderFixedPanel()

		this.viewBox.render()
	}

	renderFixedPanel() {
		const { ctx } = this.getters

		this.getters.renderer.resetTransform()

		ctx.fillStyle = "white"
		ctx.fill( this.fixedPanelPath2d )

	}
}
