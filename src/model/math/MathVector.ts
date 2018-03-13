import { isNumber } from "lodash"
import MathPoint from "./MathPoint"

const { sqrt, pow } = Math

export default class MathVector {
	x: number

	y: number

	constructor( a: any, b: any ) {
		if ( isNumber( a ) && isNumber( b ) ) {
			this.x = a
			this.y = b
		}

		if ( isMathPoint( a ) && isMathPoint( b ) ) {
			this.x = b.x - a.x
			this.y = b.y - a.y
		}

		function isMathPoint( value: any ) {
			return value instanceof MathPoint
		}
	}

	get unit(): MathVector {
		const absolute: number = sqrt( pow( this.x, 2 ) + pow( this.y, 2 ) )
		return this.divide( absolute )
	}

	add( { x, y }: MathVector ) {
		return new MathVector( this.x + x, this.y + y )
	}

	subtract( { x, y }: MathVector ) {
		return new MathVector( this.x - x, this.y - y )
	}

	multiply( k: number ) {
		return new MathVector( this.x * k, this.y * k )
	}

	divide( k: number ) {
		return new MathVector( this.x / k, this.y / k )
	}

	rotate( angle: number ): MathVector {
		const radian = angle * Math.PI / 180

		const { x, y } = this

		const rotated: MathVector = new MathVector(
			x * Math.cos( radian ) - y * Math.sin( radian ),
			x * Math.sin( radian ) + y * Math.cos( radian )
		)

		return rotated
	}
}
