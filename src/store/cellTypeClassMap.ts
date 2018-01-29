import * as cellTypeList from 'store/constant_cellTypeList'
import * as Shape from 'model/shape/index'
import { SizePoint } from 'model/tool/index'
import { RECT, LINE, POINT, RECT_IMAGE, SIZE_POINT } from './constant_cellTypeList';
import RectImage from 'model/image/RectImage';

export default ( {
	/**
	 * Shape
	 */
	[ RECT ]      : Shape.Rect,
	[ LINE ]      : Shape.Line,
	[ POINT ]     : Shape.Point,

	/**
	 * Image
	 */
	[ RECT_IMAGE ]: RectImage,

	/**
	 * Tool
	 */
	[ SIZE_POINT ]: SizePoint,
} )
