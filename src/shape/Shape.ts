import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Geometry from 'model/Geometry'

export default class Shape extends Geometry {
	constructor(
		{
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			onDragStart,
			onDragging,
			onDragStop,
		}: {
			top: number,
			left: number,
			width: number,
			height: number,
			fill: string,
			angle: number,
			draggable: boolean,
			onDragStart: Function,
			onDragging: Function,
			onDragStop: Function,
		}
	) {
		super( {
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			onDragStart,
			onDragging,
			onDragStop,
		} )
	}
}
