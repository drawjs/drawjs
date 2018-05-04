import * as cellTypeList from "../../store/constant/cellType"
import {
	POLYGON,
	RECT,
	LINE,
	POINT,
	RECT_IMAGE,
	SIZE_POINT
} from "../../store/constant/cellType"
import RectImage from "../../model/image/RectImage"
import ScalePoint from "../../model/tool/ScalePoint"
import Rect from "../../model/shape/Rect"
import Line from "../../model/shape/Line"
import Point from "../../model/shape/Point"
import Polygon from "../../model/shape/Polygon"
import { SEGMENT, TEXT, POLYLINE, ORTHOGONAL_LINE } from '../constant/cellType';
import Segment from "../../model/Segment"
import DrawText from '../../model/text/DrawText';
import Polyline from '../../model/shape/Polyline';
import OrthogonalLine from '../../model/shape/OrthogonalLine/OrthogonalLine';

export default function() {
	return {
		[ SEGMENT ]: Segment,

		/**
		 * Shape
		 */
		[ RECT ]   : Rect,
		[ LINE ]   : Line,
		[ POLYLINE ]   : Polyline,
		[ ORTHOGONAL_LINE ]   : OrthogonalLine,
		[ POINT ]  : Point,
		[ POLYGON ]: Polygon,

		/**
		 * Text
		 */
		[ TEXT ]: DrawText,

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
