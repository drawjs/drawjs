import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Draw from '../Draw'

export default class Cell {
	private id: string = generateUniqueId()
	public _draw: Draw
	public _isInstance: boolean = true
	public type:string
	constructor() {

	}

	private set(  field: string, value: any  ) {
		this[ field ] = value
	}

	public render( ctx: CanvasRenderingContext2D ) {

	}
}
