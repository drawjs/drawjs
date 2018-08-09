import RotationArrow from "../model/tool/RotationArrow"
import SizeContainer from "./tool/SizeContainer"
import ScalePoint from "./tool/ScalePoint"
import Geometry from "./Geometry"

export default abstract class Graph extends Geometry {
	// SizeContainer: SizeContainer



	/**
	 * Scale
	 */
	scalable: boolean = true
	scalePoint: ScalePoint

	constructor( props ) {
		super( props )

		// const { rotatable, scalable } = props

		/**
		 * // Rotation
		 */
		// if ( isBoolean( rotatable ) ) {
		// 	this.rotatable = rotatable
		// }

		// if ( this.rotatable ) {
		// 	this.rotationArrow = new RotationArrow( {
		// 		draw  : this.draw,
		// 		target: this
		// 	} )
		// }

		/**
		 * // Scale
		 */
		// if ( isBoolean( scalable ) ) {
		// 	this.scalable = scalable
		// }

		// if ( this.scalable ) {
		// 	// this.scalePoint = new ScalePoint( { draw: this.draw, target: this } )
		// }
	}

	public render() {
		const { ctx } = this.getters
		super.render()

		// this.sharedActions.applySelectionBorder( this )

		// this.rotatable && this.sharedActions.applyRotationArrow( this )
	}
}
