import { findArrayFirstIndex, findArrayLastIndex } from '../../js/array';
import { notNil } from '../../lodash/index';
export default class RectUtil {
	center: Point2D
	width: number
	height: number

	/**
	 * Extending distance
	 */
	ed: number

	constructor( center: Point2D, width: number, height: number, extendingDistance: number = 10 ) {
	  this.center = center
	  this.width = width
	  this.height = height

	  this.ed = extendingDistance

	}

	get cx() {
	  return this.center.x
	}

	get cy() {
	  return this.center.y
	}

	get left() {
	  return this.cx - this.width / 2
	}

	get right() {
	  return this.cx + this.width / 2
	}

	get top() {
	  return this.cy - this.height / 2
	}

	get bottom() {
	  return this.cy + this.height / 2
	}

	get topCenter(): Point2D {
	  return {
		x: this.cx,
		y: this.top
	  }
	}

	get bottomCenter(): Point2D {
	  return {
		x: this.cx,
		y: this.bottom
	  }
	}

	get leftCenter(): Point2D {
	  return {
		x: this.left,
		y: this.cy
	  }
	}

	get rightCenter(): Point2D {
	  return {
		x: this.right,
		y: this.cy
	  }
	}

	get leftTop(): Point2D {
	  return {
		x: this.left,
		y: this.top
	  }
	}

	get rightTop(): Point2D {
	  return {
		x: this.right,
		y: this.top
	  }
	}

	get leftBottom(): Point2D {
	  return {
		x: this.left,
		y: this.bottom
	  }
	}

	get rightBottom(): Point2D {
	  return {
		x: this.right,
		y: this.bottom
	  }
	}

	get leftLine(): LineTwoPoints {
	  return [ this.leftBottom, this.leftTop  ]
	}

	get rightLine(): LineTwoPoints {
	  return [ this.rightTop, this.rightBottom ]
	}

	get topLine(): LineTwoPoints {
	  return [ this.leftTop, this.rightTop ]
	}

	get bottomLine(): LineTwoPoints {
	  return [ this.rightBottom, this.leftBottom ]
	}

	/**
	 * // Extension
	 */
	get lce(): Point2D {
		return {
			x: this.left - this.ed,
			y: this.cy
		}
	}

	get tce(): Point2D {
		return {
			x: this.cx,
			y: this.top - this.ed,
		}
	}

	get rce(): Point2D {
		return {
			x: this.right + this.ed,
			y: this.cy,
		}
	}

	get bce(): Point2D {
		return {
			x: this.cx,
			y: this.bottom + this.ed,
		}
	}


	get lte(): Point2D {
		return {
			x: this.left,
			y: this.top
		}
	}

	get rte(): Point2D {
		return {
			x: this.right,
			y: this.top
		}
	}

	get rbe(): Point2D {
		return {
			x: this.right,
			y: this.bottom
		}
	}

	get lbe(): Point2D {
		return {
			x: this.left,
			y: this.bottom
		}
	}

	get lbci(): BorderCenterInfo {
		return {
			extension: this.lce,
			cornerExtensions: [ this.lbe, this.lte ],
		}
	}

	get tbci(): BorderCenterInfo {
		return {
			extension: this.tce,
			cornerExtensions: [ this.lte, this.rte  ]
		}
	}

	get rbci(): BorderCenterInfo {
		return {
			extension: this.tce,
			cornerExtensions: [ this.rte, this.rbe  ]
		}
	}

	get bbci(): BorderCenterInfo {
		return {
			extension: this.bce,
			cornerExtensions: [ this.rbe, this.lbe  ]
		}
	}

	// getPrevCornerExtension( cornerExtension: Point2D ): Point2D {
	// 	const forFinding: Point2D[] = [
	// 		this.lte,
	// 		this.rte,
	// 		this.rbe,
	// 		this.lbe,
	// 		this.lte,
	// 	]

	// 	const index = findArrayLastIndex( forFinding, cornerExtension )

	// 	return notNil( index )  ? forFinding[ index - 1 ] : null
	// }

	// getNextCornerExtension( cornerExtension: Point2D ): Point2D {
	// 	const forFinding: Point2D[] = [
	// 		this.lbe,
	// 		this.lte,
	// 		this.rte,
	// 		this.rbe,
	// 		this.lbe,
	// 	]

	// 	const index = findArrayFirstIndex( forFinding, cornerExtension )

	// 	return notNil( index )  ? forFinding[ index + 1 ] : null
	// }


  }
