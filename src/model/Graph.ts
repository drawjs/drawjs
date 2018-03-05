import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'
import Selection from 'mixin/Selection'
import RotationArrow from 'model/tool/RotationArrow';
import applyRotationArrow from '../shared/applyRotationArrow';
import applySelectionBorder from '../shared/applySelectionBorder';
import { isBoolean } from 'lodash';
import getters from '../store/draw/getters';
import RectContainer from './tool/RectContainer';

export default abstract class Graph extends Geometry {
	rectContainer: RectContainer

	/**
	 * Rotation
	 */
	rotatable: boolean = true
	rotationArrow: RotationArrow


	constructor( props ) {
		super( props )

		const { rotatable } = props

		/**
		 * Rotation
		 */
		if ( isBoolean( rotatable ) ) {
			this.rotatable = rotatable
		}
		if ( this.rotatable ) {
			this.rotationArrow = new RotationArrow( { draw: this.draw, target: this } )
		}

	}

	public render() {
		const ctx = getters.ctx
		super.render()

		applySelectionBorder( this )

		this.rotatable && applyRotationArrow( this )
	}
}
