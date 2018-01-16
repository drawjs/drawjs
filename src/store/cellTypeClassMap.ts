import * as cellTypeList from 'store/constant_cellTypeList'
import * as Shape from 'model/shape/index'
import { ScalePoint } from '../model/tool/index';

export default ({
	[cellTypeList.RECT]: Shape.Rect,
	[cellTypeList.LINE]: Shape.Line,
	[cellTypeList.POINT]: Shape.Point,
	[cellTypeList.SCALE_POINT]: ScalePoint,
})
