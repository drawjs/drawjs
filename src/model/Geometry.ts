import * as _ from 'lodash'

import { generateUniqueId } from 'util/index'
import Cell from 'model/Cell'


export default abstract class Geometry extends Cell {
	public top: number
	public left: number
	public width: number
	public height: number
	public fill: string

	public draggable: boolean

	constructor( props ) {
		super( props )
	}



	public render() {
		super.render()
	}

	public abstract contain( x: number, y: number ): void
}
