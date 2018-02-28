import * as cellTypeList from 'store/constant/cellType'
import * as Shape from 'model/shape/index'
import { SizePoint } from 'model/tool/index'
import { POLYGON, RECT, LINE, POINT, RECT_IMAGE, SIZE_POINT } from 'store/constant/cellType';
import RectImage from 'model/image/RectImage';

export default ( {
	/**
	 * Shape
	 */
	[ RECT ]      : Shape.Rect,
	[ LINE ]      : Shape.Line,
	[ POINT ]     : Shape.Point,
	[ POLYGON ]     : Shape.Polygon,

	/**
	 * Image
	 */
	[ RECT_IMAGE ]: RectImage,

	/**
	 * Tool
	 */
	[ SIZE_POINT ]: SizePoint,
} )
