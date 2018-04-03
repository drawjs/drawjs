import { Cell } from "../../model/index"
import MiniMap from "./MiniMap"
import { MINI_MAP_VIEW_BOX } from "../../store/constant/cellType"

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

	get basicCenter(): Point2D {
		const {
			left: miniMapLeft,
			top: miniMapTop,
			width: miniMapWidth,
			height: miniMapHeight
		} = this.miniMap
		const x: number = miniMapLeft + miniMapWidth / 2
		const y: number = miniMapTop + miniMapHeight / 2
		const res: Point2D = {
			x,
			y
		}
		return res
	}

	get center(): Point2D {
		const { initialRatio } = this
		const { viewPort } = this.getters
		const { zoom, panX, panY } = viewPort
		const { x: basicX, y: basicY } = this.basicCenter

		const deltaX: number = panX / initialRatio / zoom
		const deltaY: number = panY / initialRatio / zoom

		const res: Point2D = {
			x: basicX - deltaX,
			y: basicY - deltaY
		}
		return res
	}

	get basicLeft(): number {
		const { left, width } = this.miniMap
		const { basicWidth } = this
		const res: number = left + width / 2 - basicWidth / 2
		return res
	}

	get basicTop(): number {
		const { top, height } = this.miniMap
		const { basicHeight } = this
		const res: number = top + height / 2 - basicHeight / 2
		return res
	}

	get basicWidth(): number {
		const { initialRatio } = this
		const { canvasWidth } = this.getters
		const basicWidth: number = canvasWidth / initialRatio
		return basicWidth
	}

	get basicHeight(): number {
		const { initialRatio } = this
		const { canvasHeight } = this.getters
		const basicHeight: number = canvasHeight / initialRatio
		return basicHeight
	}

	get width(): number {
		const { basicWidth } = this
		const { zoom } = this.getters
		const res: number = basicWidth / zoom
		return res
	}

	get height(): number {
		const { basicHeight } = this
		const { zoom } = this.getters
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

		const isContain = this.getters.ctx.isPointInPath(
			this.path2d,
			transformed.x,
			transformed.y
		)

		return isContain
	}

	render() {
		const { ctx } = this.getters

		ctx.save()

		ctx.lineWidth = 1
		ctx.strokeStyle = "red"
		ctx.stroke( this.path2d )

		ctx.restore()
	}

	updateDrag( event ) {
		if ( this.draggable ) {
			const { initialRatio } = this
			const { zoom } = this.getters

			const deltaX = event.x - this.dragger.prevEvent.x
			const deltaY = event.y - this.dragger.prevEvent.y

			const deltaXViewPort = -deltaX * initialRatio * zoom
			const deltaYViewPort = -deltaY * initialRatio * zoom

			this.getters.viewPort.panBy( deltaXViewPort, deltaYViewPort )
		}
	}
}
