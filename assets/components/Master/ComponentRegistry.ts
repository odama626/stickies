function register(types, component) {
	types[component.getClassName()] = component
	console.debug('[ComponentRegistry] registering type',component.getClassName());
}

/**
 *	Import Your Component Here
 */

import { Note } from '../Note/Note';

//**************

export function getComponentTypes() {
	let types = {};

	/**
	 *	Register Your Component Here
	 *	register(types, ${component name})
	 */

	register(types, Note);

	//************


	return types;
}
