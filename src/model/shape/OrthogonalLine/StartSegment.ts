import Segment from '../../Segment';
import OrthogonalLine from './OrthogonalLine';
import StartLine from './StartLine';

export default class StartSegment extends Segment {
	orthogonalLine: OrthogonalLine


	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	get startLine(): StartLine {
		return this.orthogonalLine.startLine
	}

	updateDrag() {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const deltaX = this.dragger.getDeltaXToPrevPoint( point )
			const deltaY = this.dragger.getDeltaYToPrevPoint( point )


			const { x, y } = this.point
			const newX = x + deltaX
			const newY = y + deltaY
			this.sharedActions.updateSegmentX( this, newX )
			this.sharedActions.updateSegmentY( this, newY )



			if ( this.startLine.isVertical ) {
				console.log( 123 )
			}
		}
	}
}
