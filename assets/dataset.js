export var gun = Gun('wss://notes.exceptionallyrecursive.com/gun');
var entry = gun.get('random/stuff');
export var nextId = 0;
export var notes = {};
export var Types = {};

export var updateCallback = () => {};

function update(note, id) {
	if (note && typeof note !== 'undefined') {
		notes[id] = note;
		updateCallback(note);
	}
}

export function RegisterType(type) {
	Types[type.getClassName()] = type;
}

export function registerCallbackFunction(func) {
	updateCallback = func;
}

entry.map().on(update);

gun.get('nextKey', (val, id) => {
	if (val.put) {
		nextId = val.put.nextKey;
	} else {
		nextId = 0;
	}
});

export function CreateComponent(creator, note) {
		note.id = note.key = nextId++;
		note.color = note.color || null;
		console.log(creator, creator.toString());
		note.type = creator;
		
		entry.put({[note.key]: note});
		gun.get('nextKey').put({ nextKey: nextId});
}

export function UpdateComponent(key, changes) {
	entry.put({[key]: changes});
}
