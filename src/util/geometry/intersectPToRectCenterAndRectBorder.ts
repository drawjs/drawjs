import MathVector from "../math/MathVector"
import intersect from "./intersect"
/**
 *       ********************
 *       *                  *
 *       *                  *
 *       *       O *        *
 *       *                  *
 *       *      I           *
 *     A *******_************ B
 * 			   *
 * 	          *
 *           *
 *          *
 *         *
 *      P *
 *
 *
 * Get I intersected by AB and PO
 *
 */
export default function( rectCenter, rectLeft, rectTop, P ): Point2D {
	const O = rectCenter
	const { x: ox, y: oy } = O

	const left: number = rectLeft
	const right: number = left + ( ox - left ) * 2
	const top: number = rectTop
	const bottom: number = top + ( oy - top ) * 2

	const LT: Point2D = { x: left, y: top }
	const RT: Point2D = { x: right, y: top }
	const LB: Point2D = { x: left, y: bottom }
	const RB: Point2D = { x: right, y: bottom }

	const OLT: MathVector = new MathVector( O, LT )
	const ORT: MathVector = new MathVector( O, RT )
	const OLB: MathVector = new MathVector( O, LB )
	const ORB: MathVector = new MathVector( O, RB )

	const OP: MathVector = new MathVector( O, P )
	const angle = OP.angle

	const AB: LineTwoPoints = getAB( angle )

	const intersected: Point2D = intersect( AB, [ O, P ] )

	return intersected

	function getAB( angle ): LineTwoPoints {
		let res: LineTwoPoints = null

		if (
			( angle >= ORT.angle && angle < 360 ) ||
			( angle >= 0 && angle < ORB.angle )
		) {
			res = [ RT, RB ]
		}

		if ( angle >= ORB.angle && angle < OLB.angle ) {
			res = [ RB, LB ]
		}

		if ( angle >= OLB.angle && angle < OLT.angle ) {
			res = [ LB, LT ]
		}

		if ( angle >= OLT.angle && angle < ORT.angle ) {
			res = [ LT, RT ]
		}
		return res
	}
}
