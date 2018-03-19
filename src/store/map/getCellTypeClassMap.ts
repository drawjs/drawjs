import * as cellTypeList from "store/constant/cellType"
import {
	POLYGON,
	RECT,
	LINE,
	POINT,
	RECT_IMAGE,
	SIZE_POINT
} from "store/constant/cellType"
import RectImage from "model/image/RectImage"
import ScalePoint from "../../model/tool/ScalePoint"
import Rect from "../../model/shape/Rect"
import Line from "../../model/shape/Line"
import Point from "../../model/shape/Point"
import Polygon from "../../model/shape/Polygon"

export default function() {
	return {
		/**
		 * Shape
		 */
		[ RECT ]   : Rect,
		[ LINE ]   : Line,
		[ POINT ]  : Point,
		[ POLYGON ]: Polygon,

		/**
		 * Image
		 */
		[ RECT_IMAGE ]: RectImage,

		/**
		 * Tool
		 */
		[ SIZE_POINT ]: ScalePoint
	}
}
