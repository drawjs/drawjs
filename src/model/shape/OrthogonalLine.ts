import Segment from '../Segment';
import Line from './Line';
import Path from '../Path';
import { isNotNil } from '../../util/index';
import Item from '../Item';
import { isNil } from 'lodash';

export default class OrthogonalLine extends Item{
	segments: Segment[] = []

	startSegment: Segment = null

	endSegment: Segment= null

	cornerSegments: Segment[] = []

	centerSegments: Segment[] = []

	lines: Line[]

	constructor( props ) {
		super( props )

		if ( isNotNil( props.segments ) ) {
			this.segments = props.segments
		}

		if ( isNil( props.segments ) ) {
			this.segments = isNotNil( props.points ) ?
				props.points.map( point =>
						this.sharedGetters.createSegmentByPoint(
							point,
							this.draw,
						)
				  ) :
				this.segments
		}

		const { segments } = this
		const { length } = segments
		this.startSegment = isNotNil( segments[ 0 ] ) ? segments[ 0 ] : this.startSegment
		this.endSegment = isNotNil( segments[ length - 1 ] ) ? segments[ 0 ] : this.endSegment



	}



	render() {
	}

	contain() {
		return false
	}
}
