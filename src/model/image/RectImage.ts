import Rect from "model/shape/Rect"
import { RECT_IMAGE } from "store/constant/cellType"
import { transformCenterPointForContext } from "mixin/index"
import { DEGREE_TO_RADIAN } from "store/constant/index"
import getters from "../../store/draw/getters";

export default class RectImage extends Rect {
	public type: string = RECT_IMAGE
	public image: HTMLImageElement = new Image()

	constructor( props ) {
		super( props )
		this.image.src = props.src

		this.image.onload = this.draw.render.bind( this.draw )
	}

	public render() {
		const ctx = getters.ctx

		ctx.save()
		transformCenterPointForContext(
			this.draw,
			{
				x: this.originX,
				y: this.originY
			},
			this
		)
		ctx.rotate( this.angle * DEGREE_TO_RADIAN )
		ctx.drawImage(
			this.image,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		)

		ctx.translate( 0, 0 )
		ctx.restore()

		/**
		 * render rotation icon
		 */
		if ( this.isRotating || this.isSelected ) {
			this._rotationIcon.renderByInstance()
		}

		/**
		 * render size points
		 */
		if ( this.isSizing || this.isSelected ) {
			this.sizePoints.map( renderSizePoint )
		}
		function renderSizePoint( sizePoint ) {
			return sizePoint.renderByInstance()
		}
	}
}
