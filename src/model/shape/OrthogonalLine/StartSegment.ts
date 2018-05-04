import Segment from '../../Segment';

export default class StartSegment extends Segment {
	constructor( props ) {
		super( props )
	}

	updateDrag() {
		if ( this.draggable ) {
			const point: Point2DInitial = this.getters.getInitialPoint( event )

			const deltaX = this.dragger.getDeltaXToPrevPoint( point )
			const deltaY = this.dragger.getDeltaYToPrevPoint( point )

			console.log( deltaX, deltaY )

			const { x, y } = this.point
			const newX = x + deltaX
			const newY = y + deltaY
			this.sharedActions.updateSegmentX( this, newX )
			this.sharedActions.updateSegmentY( this, newY )
		}
	}
}
