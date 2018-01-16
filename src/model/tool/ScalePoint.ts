import { SCALE_POINT } from "../../store/constant_cellTypeList";
import Cell from "../Cell";
import Point from "model/shape/Point";
import * as _ from "lodash";
import { getRotatedPoint } from 'util/index'
import * as i from "interface/index"


export default class ScalePoint extends Point {
	public instance: any

	get instanceWidth(): number {
		return this.instance.width
	}

	get instanceHeight(): number {
		return this.instance.height
	}

	get instanceCenterX(): number {
		return this.instance.left + this.instance.width / 2
	}

	get instanceCenterY(): number {
		return this.instance.top + this.instance.height / 2
	}

	constructor(props) {
		super(props)

		this.type = SCALE_POINT
		this.color = 'blue'

		this.instance = props.instance
	}

	public render() {
		const ctx = this.draw.ctx

		ctx.save()
		ctx.translate(this.x + this.instanceCenterX, this.y + this.instanceCenterY)
		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor

		ctx.fill(this.path)
		!_.isNil(this.strokeColor) && ctx.stroke(this.path)

		ctx.restore()
	}

	public setRotatedPoint( point: i.Point ) {
		const rotatedPoint = getRotatedPoint( point, this.instance.angle )

		this.x = rotatedPoint.x
		this.y = rotatedPoint.y
	}
}

export class ScalePointTopLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: - this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		} )

		this.render()
	}

	public
}

export class ScalePointTop extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: 0,
			y: - this.instanceHeight / 2,
		} )
		this.render()
	}
}

export class ScalePointTopRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: this.instanceWidth / 2,
			y: - this.instanceHeight / 2,
		} )
		this.render()
	}
}

export class ScalePointLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: - this.instanceWidth / 2,
			y: 0,
		} )
		this.render()
	}
}

export class ScalePointRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: this.instanceWidth / 2,
			y: 0,
		} )
		this.render()
	}
}

export class ScalePointBottomLeft extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: - this.instanceWidth / 2,
			y: this.instanceHeight / 2,
		} )
		this.render()
	}
}

export class ScalePointBottom extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: 0,
			y: this.instanceHeight / 2,
		} )
		this.render()
	}
}

export class ScalePointBottomRight extends ScalePoint {
	constructor(props) {
		super(props)
	}

	public renderByInstance() {
		this.setRotatedPoint( {
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2,
		} )
		this.render()
	}
}
