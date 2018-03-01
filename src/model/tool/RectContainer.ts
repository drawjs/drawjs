const { max, min } = Math

export default class RectContainer {
	contentPoints: Point2D[] = []

	get _contentPointsX(): number[] {
		const res: number[] = this.contentPoints.map(
			( point: Point2D ) => point.x
		)
		return res
	}
	get _contentPointsY(): number[] {
		const res: number[] = this.contentPoints.map(
			( point: Point2D ) => point.y
		)
		return res
	}
	get left(): number {
		const res: number = min( ...this._contentPointsX )
		return res
	}
	get right(): number {
		const res: number = max( ...this._contentPointsX )
		return res
	}
	get top(): number {
		const res: number = min( ...this._contentPointsY )
		return res
	}
	get bottom(): number {
		const res: number = max( ...this._contentPointsY )
		return res
	}
	get width(): number {
		return this.right - this.left
	}
	get height(): number {
		return this.bottom - this.top
	}
	get center(): Point2D {
		return {
			x: ( this.left + this.right ) / 2,
			y: ( this.top + this.bottom ) / 2
		}
	}
	constructor( props: Point2D[] ) {
		this.contentPoints = props
	}
}
