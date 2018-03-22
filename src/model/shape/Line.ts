import Path from "../Path"
import { LINE } from "store/constant/cellType"
import { isNotNil } from "util/index"

export default class Line extends Path {
	type = LINE

	rotatable: boolean = false
	sizable: boolean = false

	source: Point2D = { x: 0, y: 0 }

	target: Point2D = { x: 0, y: 0 }

	lineWidth: number = 1

	/**
	 * Override
	 */
	t = 1

	constructor( props ) {
		super( setPropsPointsDangerously( props ) )

		this.source = isNotNil( props.source ) ? props.source : this.source
		this.target = isNotNil( props.target ) ? props.target : this.target

		this.sharedActions.clearSegmentsHandles( this.segments )
		this.sharedActions.hideSegmentsHandles( this.segments )
		// this.sharedActions.hideSegments( this.segments )

		console.log( 'Line', this.sizable )

		function setPropsPointsDangerously( props ) {
			const { source, target } = props

			const points: Point2D[] = [ source, target ]

			props.points = points

			return props
		}
	}


	get hitRegionPath(): Path2D {

		return
	}

	render() {
		super.render()

	}
}
