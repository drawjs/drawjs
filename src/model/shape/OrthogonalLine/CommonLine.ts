import Line from '../Line';
import OrthogonalLine from './OrthogonalLine';

export default class CommonLine extends Line {
	orthogonalLine: OrthogonalLine

	centerSegment: any = null

	renderFnInMiniMap: Function = () => {
		const { ctx } = this.getters
		ctx.lineWidth = 5
		ctx.fillStyle = "#2aaffa"
		ctx.strokeStyle = "#2aaffa"
    this.hitRegionPath2d && ctx.fill( this.hitRegionPath2d )
    this.hitRegionPath2d && ctx.stroke( this.hitRegionPath2d )
	}

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	updateCenterSegmentPosition() {
		this.sharedActions.updateSegmentPoint(
			this.centerSegment, this.center
		)
	}
}
