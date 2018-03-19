import { Cell } from "model/index"
import MiniMap from "./MiniMap"
import { MINI_MAP_VIEW_BOX } from '../../store/constant/cellType';

export default class MiniMapViewBox extends Cell {
	type = MINI_MAP_VIEW_BOX

	miniMap: MiniMap

	constructor( props ) {
		super( props )

		this.miniMap = props.miniMap
	}

	/**
	 * Initial ratio
	 * Get initial view box's width and height by canvas width divides this ratio
	 */
	get initialRatio(): number {
		const { canvasWidth, canvasHeight } = this.getters
		const { width, height } = this.miniMap
		const xRate: number = canvasWidth / width
		const yRate: number = canvasHeight / height
		const res: number = xRate > yRate ? xRate : yRate
		return res
	}

	get center(): Point2D {
		const { width, height } = this
		const { panX, panY } = this.getters
		const {
			left: miniMapLeft,
			top: miniMapTop,
			width: miniMapWidth,
			height: miniMapHeight
		} = this.miniMap
		const basicX: number = miniMapLeft + miniMapWidth / 2
		const basicY: number = miniMapTop + miniMapHeight / 2

		const deltaX: number = panX / this.initialRatio
		const deltaY: number = panY / this.initialRatio

		const res: Point2D = {
			x: basicX + deltaX,
			y: basicY + deltaY
		}
		return res
	}

	get width(): number {
		const { initialRatio } = this
		const { canvasWidth, zoom } = this.getters
		const basicWidth = canvasWidth / initialRatio
		const res: number = basicWidth / zoom
		return res
	}

	get height(): number {
		const { initialRatio } = this
		const { canvasHeight, zoom } = this.getters
		const basicHeight = canvasHeight / initialRatio
		const res: number = basicHeight / zoom
		return res
	}

	get path2d(): Path2D {
		const { x, y }: Point2D = this.center
		const { width, height } = this

		// this.getters.testUtils.renderPoint( this.center )

		let path2d: Path2D = new Path2D()
		path2d.rect( x - width / 2, y - height / 2, width, height )
		return path2d
	}


	contain( x: number, y: number ) {
		this.getters.renderer.resetTransform()

		const transformed: Point2D = this.getters.viewPort.transform( { x, y } )

		// this.getters.testUtils.delayRenderPoint( transformed, "orange" )

		const isContain = this.getters.ctx.isPointInPath( this.path2d, transformed.x, transformed.y )

		// console.log( isContain )

		return isContain
	}

	render() {
		const { ctx } = this.getters

		this.getters.renderer.resetTransform()

		ctx.fillStyle = "white"
		ctx.fill( this.path2d )

		ctx.strokeStyle = "red"
		ctx.stroke( this.path2d )
	}



	updateDrag( event ) {
		const { initialRatio } = this
		const { zoom } = this.getters

		const deltaX = event.x - this.dragger.prevEvent.x
		const deltaY = event.y - this.dragger.prevEvent.y

		const deltaXViewPort = deltaX * initialRatio * zoom
		const deltaYViewPort = deltaY * initialRatio * zoom

		this.getters.viewPort.panBy( deltaXViewPort , deltaYViewPort )

		this.draw.render()
	}


}
