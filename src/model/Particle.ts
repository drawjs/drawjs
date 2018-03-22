import Draw from "../index";
import DrawStore from "../store/draw/DrawStore";
import Getters from "../store/draw/Getters";
import Actions from "../store/draw/Actions";
import SharedActions from '../shared/SharedActions';
import SharedGetters from '../shared/SharedGetters';
import TestUtils from "../shared/TestUtils";

export default class Particle {
	draw: Draw

	constructor( props ) {
		const { draw } = props
		this.draw = draw
	}

	get drawStore(): DrawStore {
		return this.draw.drawStore
	}

	get getters(): Getters {
		return this.draw.getters
	}

	get actions(): Actions {
		return this.draw.actions
	}

	get sharedGetters(): SharedGetters {
		return this.draw.sharedGetters
	}

	get sharedActions(): SharedActions {
		return this.draw.sharedActions
	}


}
