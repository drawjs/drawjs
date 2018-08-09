import MathPoint from "./MathPoint"
import { isNumber } from "../lodash/index"

const { sqrt, pow, atan, abs, PI } = Math

export default class MathVector {
	type = "MATH_VECTOR"

	x: number

	y: number

	constructor( a: any, b?: any ) {
		if ( isNumber( a ) && isNumber( b ) ) {
			this.x = a
			this.y = b
		}

		if ( isPoint( a ) && ! isPoint( b ) ) {
			this.x = a.x
			this.y = a.y
		}

		if ( isPoint( a ) && isPoint( b ) ) {
			this.x = b.x - a.x
			this.y = b.y - a.y
		}

		function isPoint( value: any ) {
			let res: boolean = false
			try {
				res = isNumber( value.x ) && isNumber( value.y )
			} catch( e ) {}
			return res
		}
	}

	get length(): number {
		const length: number = sqrt( pow( this.x, 2 ) + pow( this.y, 2 ) )
		return length
	}

	get unit(): MathVector {
		return this.divide( this.length )
	}

	/**
	 * Angle to positive x axis
	 */
	get angle(): number {
		const { x, y } = this

		const absoluteRadian = atan( abs( y / x ) )
		const absoluteAngle = absoluteRadian * 180 / PI
		let angle: number

		if ( isPointOnOrigin( this ) || isPointOnXAxisPositive( this ) ) {
			angle = 0
		}

		if ( isPointOnXAxisNegative( this ) ) {
			angle = 180
		}

		if ( isPointOnYAxisPositive( this ) ) {
			angle = 180 / 2
		}

		if ( isPointOnYAxisNegative( this ) ) {
			angle = 180 * 3 / 2
		}

		if ( isPointOn1Quadrant( this ) ) {
			angle = absoluteAngle
		}

		if ( isPointOn2Quadrant( this ) ) {
			angle = 180 - absoluteAngle
		}

		if ( isPointOn3Quadrant( this ) ) {
			angle = 180 + absoluteAngle
		}

		if ( isPointOn4Quadrant( this ) ) {
			angle = 360 - absoluteAngle
		}

		return angle

		function isPointOnOrigin( P: Point2D ) {
			return P.x === 0 && P.y === 0
		}

		function isPointOnXAxisPositive( P: Point2D ) {
			return P.y === 0 && P.x > 0
		}

		function isPointOnXAxisNegative( P: Point2D ) {
			return P.y === 0 && P.x < 0
		}

		function isPointOnYAxisPositive( P: Point2D ) {
			return P.x === 0 && P.y > 0
		}

		function isPointOnYAxisNegative( P: Point2D ) {
			return P.x === 0 && P.y < 0
		}

		function isPointOn1Quadrant( P: Point2D ) {
			return P.x > 0 && P.y > 0
		}

		function isPointOn2Quadrant( P: Point2D ) {
			return P.x < 0 && P.y > 0
		}

		function isPointOn3Quadrant( P: Point2D ) {
			return P.x < 0 && P.y < 0
		}

		function isPointOn4Quadrant( P: Point2D ) {
			return P.x > 0 && P.y < 0
		}
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

	absoluteParallelWith( V: MathVector ) {
		return this.angle === V.angle
	}
}
