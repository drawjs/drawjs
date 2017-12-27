import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import { validShapeFields } from 'store/index'


export default class Shape {
	private id: string
	private draw: any

	constructor() {
		this.id = generateUniqueId()
	}

	public set( field: string, value: any ) {
		if ( _.includes ( validShapeFields, field ) ) {
			this[ field ] = value
		}
	}
}
