import Draw from "../index"
import DrawStore from "../store/draw/DrawStore"
import Getters from "../store/draw/Getters"
import Actions from "../store/draw/Actions"
import SharedActions from '../shared/SharedActions'
import SharedGetters from '../shared/SharedGetters'
import TestUtils from "../shared/TestUtils"

export default class Particle {
	draw: Draw
	id: string = null

	drawStore: DrawStore
	store: DrawStore
	getters: Getters
	actions: Actions

	sharedGetters: SharedGetters
	sharedActions: SharedActions
	constructor( props ) {
		const { draw } = props
		this.draw = draw

		this.drawStore = this.draw.drawStore
		this.store = this.draw.store
		this.store = this.draw.store
		this.getters = this.draw.getters
		this.getters = this.draw.getters
		this.actions = this.draw.actions

		this.sharedGetters = this.draw.sharedGetters
		this.sharedActions = this.draw.sharedActions

		this.id = this.getters.generateUniqueDrawElementId()
	}

	// get drawStore(): DrawStore {
	// 	return this.draw.drawStore
	// }

	// get store(): DrawStore {
	// 	return this.drawStore
	// }

	// get getters(): Getters {
	// 	return this.draw.getters
	// }

	// get actions(): Actions {
	// 	return this.draw.actions
	// }

	// get sharedGetters(): SharedGetters {
	// 	return this.draw.sharedGetters
	// }

	// get sharedActions(): SharedActions {
	// 	return this.draw.sharedActions
	// }

	/**
	 * Remove
	 */
	remove() {
		this.actions.REMOVE_ELEMENT( this )
	}
}
