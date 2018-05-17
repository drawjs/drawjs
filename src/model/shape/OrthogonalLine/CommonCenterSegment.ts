import Segment from "../../Segment"
import OrthogonalLine from "./OrthogonalLine"
import { getPropsAddedFillColor } from "../../../drawUtil/index"
import CommonLine from './CommonLine';
import { LINE_DEFAULT_COLOR } from '../../../store/constant/color';

export default class CommonCenterSegment extends Segment {
	orthogonalLine: OrthogonalLine
	line: CommonLine = null

	constructor( props ) {
		super( getPropsAddedFillColor( props, "deepSkyBlue" ) )
		this.orthogonalLine = props.orthogonalLine

		this.line = props.line
	}

	_updateLineColorToDefault() {
		this.line.fillColor = LINE_DEFAULT_COLOR
	}

	// updateDrag( event ) {
	// 	if ( this.draggable ) {
	// 		const point: Point2DInitial = this.getters.getInitialPoint( event )

	// 		const dx = this.dragger.getDeltaXToPrevPoint( point )
	// 		const dy = this.dragger.getDeltaYToPrevPoint( point )

	// 		// this.line.isVertical && this.translate( dx, 0 )
	// 		// this.line.isHorizontal && this.translate( 0, dy )
	// 	}
	// }

	handleDragging( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const dx = this.dragger.getDeltaXToPrevPoint( point )
		const dy = this.dragger.getDeltaYToPrevPoint( point )

		const { isVertical, isHorizontal } = this.line

		isVertical && this.line.translate( dx, 0 )
		isHorizontal && this.line.translate( 0, dy )

		this._updateLineColorToDefault()

		// super.handleDragging( event )

		this.orthogonalLine.updateCenterSegmentsPosition()
	}
}
