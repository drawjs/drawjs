import * as _ from "lodash"
import { generateUniqueId } from "util/index"
import Geometry from "model/Geometry"
import RotationArrow from "model/tool/RotationArrow"
import { isBoolean } from "lodash"
import RectContainer from "./tool/RectContainer"
import ScalePoint from "./tool/ScalePoint";

export default abstract class Graph extends Geometry {
	rectContainer: RectContainer

	/**
	 * Rotation
	 */
	rotatable: boolean = true
	rotationArrow: RotationArrow

	/**
	 * Scale
	 */
	scalable: boolean = true
	scalePoint: ScalePoint

	constructor( props ) {
		super( props )

		const { rotatable, scalable } = props

		/**
		 * // Rotation
		 */
		if ( isBoolean( rotatable ) ) {
			this.rotatable = rotatable
		}

		if ( this.rotatable ) {
			this.rotationArrow = new RotationArrow( {
				draw  : this.draw,
				target: this
			} )
		}

		/**
		 * // Scale
		 */
		if ( isBoolean( scalable ) ) {
			this.scalable = scalable
		}

		if ( this.scalable ) {
			// this.scalePoint = new ScalePoint( { draw: this.draw, target: this } )
		}
	}

	public render() {
		const { ctx } = this.getters
		super.render()

		this.sharedActions.applySelectionBorder( this )

		this.rotatable && this.sharedActions.applyRotationArrow( this )
	}
}
