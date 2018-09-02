import Cell from "../Cell"
import zoomPoint from "../../util/geometry/zoom"
import MiniMapViewBox from "./MiniMapViewBox"
import { isNotNil } from "../../util/index"
import { MINI_MAP } from '../../store/constant/cellType'
import renderBackground from "../../util/canvas/renderBackground"
import { notNil } from "../../util/lodash/index"

export default class MiniMap extends Cell {
	type = MINI_MAP

	left: number = 0
	top: number = 0
	width: number = 0
	height: number = 0

	show: boolean = false

	viewBox: MiniMapViewBox

	imageDataInRigion: any

	renderingMainCells: boolean = false

	preventDefaultCellsRenderInMiniMap: boolean = false

	shouldRender: boolean


	constructor( props ) {
		super( props )

		this.shouldRender = notNil( props.shouldRender ) ? props.shouldRender : this.shouldRender

		const { miniMapWidth, miniMapHeight } = this.drawStore.setting
		this.width = notNil( miniMapWidth ) ? miniMapWidth : 300
		this.height = notNil( miniMapHeight ) ? miniMapHeight : 200
		this.left = this.getters.canvasRight - this.width
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

	enablePreventDefaultCellsRenderInMiniMap() {
		return this.preventDefaultCellsRenderInMiniMap = true
	}

	enableRender() {
		this.shouldRender = true
	}

	disableRender() {
		this.shouldRender = false
	}

	renderMainCells() {
		const { renderer, canvas } = this.getters

		this.draw.renderBackground()

		renderer.setTransformViewPortToRenderMiniMap()

		this.renderingMainCells = true

		this.draw.renderMain()

		this.renderingMainCells = false

		// renderer.resetTransform()
		// this.getters.miniMap.viewBox.render()
	}

	render() {
		const { ctx } = this.getters
		const { basicLeft, basicTop } = this.viewBox

		ctx.save()


		/* render background */
		ctx.fillStyle = "#20232a"
		ctx.fill( this.path2d )

		ctx.strokeStyle = "#20232a"
		ctx.stroke( this.path2d )

		/* Unexcptional white line occurs because of following code line */
		// this.renderViewBoxBasicPanel()

		if ( isNotNil( this.imageDataInRigion ) ) {
			ctx.putImageData( this.imageDataInRigion, basicLeft, basicTop )
		}

		ctx.restore()
	}

	contain( x: number, y: number ) {
		this.getters.renderer.resetTransform()

		const transformed: Point2D = this.getters.viewPort.transform( { x, y } )

		const isContain = this.show && this.getters.ctx.isPointInPath(
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
