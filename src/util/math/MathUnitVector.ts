import MathVector from "./MathVector"
import { isNumber, isPlainObject, isNil } from '../lodash/index'

const { PI, sin, cos } = Math

export default class MathUnitVector extends MathVector {
	type: string = "MATH_UNIT_VECTOR"
	x: number
	y: number

	constructor( a ) {
		super( null, null )

		if ( isNumber( a ) ) {
			const angle: number = a
			const radian: number = a * PI / 180
			this.x = cos( radian )
			this.y = sin( radian )
		}

		if ( isPlainObject( a ) && a.type === "MATH_VECTOR" ) {
			const vector: MathVector =  a
			const unit: MathVector = vector.unit
			this.x = unit.x
			this.y = unit.y
		}

		if ( isPlainObject( a ) && isNil( a.type ) ) {
			const value: Vector = a
			const vector: MathVector = new MathVector( a.x, a.y )
			const unit: MathVector = vector.unit
			this.x = unit.x
			this.y = unit.y
		}
	}
}
