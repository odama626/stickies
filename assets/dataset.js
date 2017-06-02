import * as gun from 'gun';
import * as moment from 'moment';

var gun = Gun('wss://notes.exceptionallyrecursive.com/gun');
var nextId = 0;
export var items = {};
let path = window.location.pathname.split('/').filter((value) => value.length>0);
let i = 0, l = path.length;
let debug = false;

for (i; i < l; i++) {
	gun = gun.get(path[i]);
}

export var gun;

var entry = gun.get(':items');

export var updateCallback = () => {};

function update(item, id) {
	if (debug) console.log('GET', id, item);
	if (typeof item !== 'undefined' && (item !== null || typeof items[id] !== 'undefined')) {
		items[id] = item;
		
  //Custom implementation of Synchronous..... which only sometimes works
		/*let nested = Object.keys(item).filter(key => typeof item[key]['#'] !== 'undefined' && item[key]['#'] && key !== '_');
		if (nested && nested.length > 0) {
			
			nested.forEach(key => {
				entry.get(id).get(key).map().on((nestedItem, nestedId) => {						
					items[id][key][nestedId] = nestedItem;
						//item = items[id];
					//console.log(items[id][key]);
					
					//console.log(item, id));
				});
			});
			//delete items[id][key]['#'];
			updateCallback(item);
		} else {
			updateCallback(item);
		}*/
		updateCallback(item);
	}
}

export function registerCallbackFunction(func) {
	updateCallback = func;
}

entry.map().on(update);

gun.get(':nextKey', (val, id) => {
	if (val.put) {
		nextId = val.put.nextKey;
	} else {
		nextId = 0;
	}
});

export function CreateComponent(creator, item) {
	item.id = item.key = nextId++;
	item.color = item.color || null;
	item.type = creator;
	item.created = item.modified = moment().toJSON();
	
	entry.put({[item.key]: item});
	gun.get(':nextKey').put({ nextKey: nextId});
}

export function UpdateComponentMeta(key, changes) {
	// ONLY USE FOR NON-USER CHANGES
	// doesn't update modified timestamp
	
	if (typeof key !== 'undefined' && typeof changes !== 'undefined') {
		if (debug) console.log('PUT', key, changes);
		entry.put({[key]: changes});
	}
}

export function UpdateComponent(key, changes) {
	if (typeof key !== 'undefined' && typeof changes !== 'undefined') {
		if (changes !== null) {
			changes.modified = moment().toJSON();
		}
		UpdateComponentMeta(key, changes);	
	}
}

// let no = Gun('wss://notes.exceptionallyrecursive.com/gun');
// window.no = no;
// window.onload = () => {
// 	no.get('nonsense').map().on((blah => {console.log(blah)}));
// }

// function startNonsense(nonsenseCount) {
// 	let nonsense = '';
// 	let i = 0;
	
// 	let timer = () => {
// 		i++;
// 		nonsense += String.fromCharCode(Math.floor((Math.random()*24)+65));
// 		no.get('nonsense').put({ nonsense: nonsense });
// 		if (i < nonsenseCount) {
// 			setTimeout(timer, Math.floor(Math.random()*1000));		
// 		}
// 	}
// 	setTimeout(timer, Math.floor(Math.random()*1000));
// }

// window.nonsense = startNonsense;
