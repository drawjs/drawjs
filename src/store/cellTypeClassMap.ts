import * as cellTypeList from 'store/constant_cellTypeList'
import * as Shape from 'model/shape/index'

export default ({
	[cellTypeList.RECT]: Shape.Rect,
	[cellTypeList.LINE]: Shape.Line,
})