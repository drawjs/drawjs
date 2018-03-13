export default class MathPoint {
	x: number
	y: number
	constructor( x: number, y: number ) {
		this.x = x
		this.y = y
	}

	add( { x, y }: MathPoint ) {
		return new MathPoint( this.x + x, this.y + y )
	}

	subtract( { x, y }: MathPoint ) {
		return new MathPoint( this.x - x, this.y - y )
	}

	multiply( k: number ) {
		return new MathPoint( this.x * k, this.y * k )
	}

	divide( k: number ) {
		return new MathPoint( this.x / k, this.y / k )
	}

	rotate( angle: number, { x = 0, y = 0 }: MathPoint ): MathPoint {
		const radian = angle * Math.PI / 180

		const relative = {
			x: this.x - x,
			y: this.y - y
		}

		const { x: xr, y: yr } = relative

		const rotated = {
			x: xr * Math.cos( radian ) - yr * Math.sin( radian ) + x,
			y: xr * Math.sin( radian ) + yr * Math.cos( radian ) + y
		}

		return new MathPoint( rotated.x, rotated.y )
	}
}
