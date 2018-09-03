import Path from '../Path'
import { POLYGON } from '../../store/constant/cellType'
import { EXPORTABLE } from '../../store/constant/name'

export default class Polygon extends Path {
	type = POLYGON

	shouldRenderInMiniMap: boolean = true

	constructor( props ) {
		super( props )
	}


}
