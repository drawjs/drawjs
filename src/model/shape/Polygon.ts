import Path from '../Path';
import { POLYGON } from '../../store/constant/cellType';

export default class Polygon extends Path {
	type = POLYGON

	shouldRenderInMiniMap: boolean = true

	constructor( props ) {
		super( props )
	}


}
