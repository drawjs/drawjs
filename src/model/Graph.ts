import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'

export default abstract class Graph extends Geometry {
	constructor( props ) {
		super( props )
	}

	private _renderSelection( ) {
		const ctx = this.draw.ctx
		ctx.save()
		ctx.translate(
			this.left + this.width / 2,
			this.top + this.height / 2,
		)
		ctx.lineWidth = 1
		ctx.setLineDash( [ 5, 5 ] )
		ctx.rotate((Math.PI / 180) * this.angle)
		ctx.strokeStyle = 'grey'
		ctx.strokeRect( - this.width / 2, - this.height / 2, this.width, this.height )
		ctx.restore()
	}

	public render() {
		const ctx = this.draw.ctx
		super.render()

		this.isSelected && this._renderSelection()
	}
}
