import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'
import Selection from 'mixin/Selection'
import RotationArrow from 'model/tool/RotationArrow';
import applyRotationArrow from '../shared/applyRotationArrow';
import applySelection from '../shared/applySelection';

export default abstract class Graph extends Geometry {
	rotationArrow: RotationArrow
	constructor( props ) {
		super( props )

		this.rotationArrow = new RotationArrow( { draw: this.draw, target: this } )
	}

	public render() {
		const ctx = this.draw.ctx
		super.render()

		applySelection( this )

		applyRotationArrow( this )
	}
}
