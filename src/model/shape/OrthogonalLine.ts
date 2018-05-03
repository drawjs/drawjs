import Segment from '../Segment';
import Line from './Line';
import Path from '../Path';
import { isNotNil } from '../../util/index';

export default class OrthogonalLine extends Path{
	startSegment: Segment = null

	endSegment: Segment= null

	cornerSegments: Segment[] = []

	centerSegments: Segment[] = []

	lines: Line[]

	constructor( props ) {
		super( props )

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
