import { generateUniqueId } from "util/index"
import getters from "../store/draw/getters";
import { includes } from 'lodash';

export default function() {
	let id: string = generateUniqueId()
	id = checkAndUpdateIdIfNeeded( id )

	function checkAndUpdateIdIfNeeded( id: string ) {
		return includes( getters.storeElementsIds, id ) ?
			checkAndUpdateIdIfNeeded( generateUniqueId() ) :
			id
	}
	return id
}
