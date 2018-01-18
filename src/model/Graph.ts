import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'
import Selection from 'mixin/Selection'

export default abstract class Graph extends Geometry {
	constructor( props ) {
		super( props )
	}

	public render() {
		const ctx = this.draw.ctx
		super.render()

		this.isSelected && Selection.render( this )
	}
}
