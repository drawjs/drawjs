import Cell from "../Cell"
import zoomPoint from "util/geometry/zoom"
import MiniMapViewBox from "./MiniMapViewBox"
import { isNotNil } from "../../util/index";
import { MINI_MAP } from '../../store/constant/cellType';

export default class MiniMap extends Cell {
	type = MINI_MAP

	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0

	viewBox: MiniMapViewBox

	imageDataInRigion: any

	constructor( props ) {
		super( props )

		this.width = 300
		this.height = 200
		this.left = 0
		this.top = this.getters.canvasHeight - this.height

		this.viewBox = new MiniMapViewBox( { draw: this.draw, miniMap: this } )
	}

	get path2d(): Path2D {
		const { left, top, width, height } = this
		const path2d = new Path2D()
		path2d.rect( left, top, width, height )
		return path2d
	}

	get canvasWidthInMiniMap(): number {
		return 0
	}

	get canvasHeightInMiniMap(): number {
		return 0
	}

	get viewBoxBasicPanelPath2d(): Path2D {
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
		const { basicLeft, basicTop } = this.viewBox

		ctx.save()

		ctx.fillStyle = "#ddd"
		ctx.fill( this.path2d )

		this.renderViewBoxBasicPanel()

		if ( isNotNil( this.imageDataInRigion ) ) {
			ctx.putImageData( this.imageDataInRigion, basicLeft, basicTop )
		}

		ctx.restore()
	}

	contain( x: number, y: number ) {
		this.getters.renderer.resetTransform()

		const transformed: Point2D = this.getters.viewPort.transform( { x, y } )

		const isContain = this.getters.ctx.isPointInPath(
			this.path2d,
			transformed.x,
			transformed.y
		)

		return isContain
	}

	renderViewBoxBasicPanel() {
		const { ctx } = this.getters

		ctx.save()
		ctx.fillStyle = "white"
		ctx.fill( this.viewBoxBasicPanelPath2d )
		ctx.restore()
	}

	saveImageDataInRigion() {
		const { basicWidth, basicHeight, basicLeft, basicTop } = this.viewBox
		this.imageDataInRigion = this.getters.ctx.getImageData( basicLeft, basicTop, basicWidth, basicHeight )
	}
}
