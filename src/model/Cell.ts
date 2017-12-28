import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'

export default class Cell {
	private id: string = generateUniqueId()
	private draw
	constructor() {

	}

	private set(  field: string, value: any  ) {
		this[ field ] = value
	}

}
