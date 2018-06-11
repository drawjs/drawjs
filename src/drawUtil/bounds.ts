import getRectPoints from "../util/getRectPoints";
import connectPolygonPoints from "../util/canvas/connectPolygonPoints";
import Item from '../model/Item';

const { min, max } = Math

export function getItemsBounds( items: any[] ) {
	const itemsBounds = items.map( ( { bounds } ) => bounds )
    return getBoundsByManyBounds( itemsBounds )
}

/**
 * Get bounds by many bounds
 */
export function getBoundsByManyBounds( bs: Bounds[] ) {
	let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    left = min( ...bs.map( ( { left } ) => left ) )
    right = max( ...bs.map( ( { right } ) => right ) )
    top = min( ...bs.map( ( { top } ) => top ) )
    bottom = max( ...bs.map( ( { bottom } ) => bottom ) )

    return { left, right, top, bottom }
}


export function getBoundsPath( bounds: Bounds ) {
	const { left, top, right, bottom } = bounds
    const rectPoints = getRectPoints( { left, top, right, bottom } )
    const { leftTop, rightTop, rightBottom, leftBottom } = rectPoints
	const points: Point2D[] = [ leftTop, rightTop, rightBottom, leftBottom ]
	return connectPolygonPoints( points )
}

