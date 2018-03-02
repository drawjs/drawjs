import Graph from '../model/Graph';

/**
 * Select cell or not
 */
export default function ( target: Graph, value: boolean ) {
	target.shouldRotate = value
}
