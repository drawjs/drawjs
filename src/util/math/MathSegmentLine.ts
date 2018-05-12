import MathRect from "./MathRect"
import MathVector from "./MathVector"
import { allElementsEqual, equalPoint } from "../js/compare"
import intersect from "../geometry/intersect";
import { includes } from 'lodash';
import { notNil } from "../lodash/index";

const { abs } = Math

export default class MathSegmentLine {
	start: Point2D
	end: Point2D

	constructor( start: Point2D, end: Point2D ) {
		this.start = start
		this.end = end
	}

	get points(): [Point2D, Point2D] {
		return [ this.start, this.end ]
	}

	get isHorizontal(): boolean {
		return this.start.y === this.end.y
	}

	get isVertical(): boolean {
		return this.start.x === this.end.x
	}

	pointOnEndPoints( point: Point2D ) {
		return equalPoint( point, this.start ) || equalPoint( point, this.end )
	}

	include( P: Point2D ) {
		const { start: s, end: t } = this
		const OA = new MathVector( s )
		const OB = new MathVector( t )
		const OP = new MathVector( P )

		const AP = OP.subtract( OA )
		const PB = OB.subtract( OP )

		return this.pointOnEndPoints( P )  || AP.absoluteParallelWith( PB )
	}

	parallelWith( segmentLine: MathSegmentLine ) {
		const { start: s1, end: t1 } = this
		const { start: s2, end: t2 } = segmentLine

		const OA = new MathVector( s1 )
		const OB = new MathVector( t1 )
		const OC = new MathVector( s2 )
		const OD = new MathVector( t2 )

		const AB = OB.subtract( OA )
		const BA = OA.subtract( OB )
		const CD = OD.subtract( OC )

		return AB.angle === CD.angle || BA.angle === CD.angle
	}

	perpWith( segmentLine: MathSegmentLine ) {
		const { start: s1, end: t1 } = this
		const { start: s2, end: t2 } = segmentLine

		const OA = new MathVector( s1 )
		const OB = new MathVector( t1 )
		const OC = new MathVector( s2 )
		const OD = new MathVector( t2 )

		const AB = OB.subtract( OA )
		const CD = OD.subtract( OC )

		const delta: number  = AB.angle - CD.angle

		return abs( delta / 90 % 2 ) === 1
	}

	onSameStraightLineWith( segmentLine: MathSegmentLine ) {
		const { start: s1, end: t1 } = segmentLine
		const { start: s2, end: t2 } = segmentLine

		const OA = new MathVector( s1 )
		const OB = new MathVector( s1 )
		const OC = new MathVector( s2 )
		const OD = new MathVector( s2 )

		const AB = OB.subtract( OA )
		const CD = OD.subtract( OC )

		const AC = OC.subtract( OA )
		const BC = OC.subtract( OB )
		const AD = OD.subtract( OA )
		const BD = OD.subtract( OB )

		const comparing = [ AB, CD, AC, BC, AD, BD ].map( ( { angle } ) => angle )
		return allElementsEqual( comparing )
	}

	intersect( segmentLine: MathSegmentLine ) {
		let res = {
			isInfinite: false,
			point     : null
		}

		const { start: s1, end: t1 } = this
		const { start: s2, end: t2 } = segmentLine


		if ( this.parallelWith( segmentLine ) ) {
			if ( this.onSameStraightLineWith( segmentLine ) ) {
				if ( this.include( s2 ) && this.include( t2 ) ) {
					if ( s2 === t2 ) {
						res.point = s2
					} else {
						res.isInfinite = true
					}
				}

				if ( this.include( s2 ) && !this.include( t2 ) ) {
					if ( equalPoint( s1, s2 ) || equalPoint( t1, s2 )) {
						res.point = s2
					} else {
						res.isInfinite = true
					}
				}

				if ( this.include( t2 ) && !this.include( s2 ) ) {
					if ( equalPoint( s1, t2 ) || equalPoint( t1, t2 ) ) {
						res.point = t2
					} else {
						res.isInfinite = true
					}
				}
			}
		} else {
			const intersectedInfo = intersect( this.points, segmentLine.points )
			const { intersected: point } = intersectedInfo
			if ( notNil( point ) && this.include( point ) && segmentLine.include( point ) ) {
				res.point = point
			}
		}

		return res
	}
}
