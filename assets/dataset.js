import * as gun from 'gun';

var gun = Gun('wss://notes.exceptionallyrecursive.com/gun');

var nextId = 0;
export var items = {};

let path = window.location.pathname.split('/').filter((value) => value.length>0);
let i = 0, l = path.length;

for (i; i < l; i++) {
	gun = gun.get(path[i]);
}

var entry = gun.get(':items');

export var updateCallback = () => {};

function update(item, id) {
	if (item && typeof item !== 'undefined') {
		items[id] = item;
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
	console.log(creator, item);
	item.type = creator;
	
	entry.put({[item.key]: item});
	gun.get(':nextKey').put({ nextKey: nextId});
}

export function UpdateComponent(key, changes) {
	entry.put({[key]: changes});
}
