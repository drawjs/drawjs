import intersect from "./intersect"
import isSegmentLinesIntersected from "./isSegmentLinesIntersected"

export default function( segmentLine: LineTwoPoints, rectBorder: RectBorder ) {
	const { left, top, right, bottom } = rectBorder
	const leftBorder: LineTwoPoints = [
		{
			x: left,
			y: top
		},
		{
			x: left,
			y: bottom
		}
	]
	const topBorder: LineTwoPoints = [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		}
	]

	const rightBorder: LineTwoPoints = [
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		}
	]

	const bottomBorder: LineTwoPoints = [
		{
			x: left,
			y: bottom
		},
		{
			x: left,
			y: top
		}
	]

	const res: boolean =
		isSegmentLinesIntersected( segmentLine, leftBorder ) ||
		isSegmentLinesIntersected( segmentLine, topBorder ) ||
		isSegmentLinesIntersected( segmentLine, rightBorder ) ||
		isSegmentLinesIntersected( segmentLine, bottomBorder )

	return res

	function isSameLineOrParallel( line1: LineTwoPoints, line2: LineTwoPoints ) {
		const intersected: any = intersect( line1, line2 )
		return intersected === null
	}
}
