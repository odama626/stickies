var url = 'wss://73.32.82.8:9000/gun';
if (window.location.href.includes('10.0.0.100')) {
	url = 'wss://10.0.0.100:9000/gun'
}

var gun = Gun(url);
var notes = gun.get('random/stuff');

dataset = {};
dataset.nextId = 0;
dataset.notes = {};

gun.get('nextKey', (val, id) => {
	if (val.put) {
		dataset.nextId = val.put.nextKey;
	} else {
		dataset.nextId = 0;
	}
});

dataset.AddNote = (note) => {
		note.id = note.key = dataset.nextId++;
		notes.put({[note.key]: note});
		gun.get('nextKey').put({ nextKey: dataset.nextId});
}

dataset.UpdateNote = (key, changes) => {
	notes.put({[key]: changes});
}

dataset.generateRandomNote = _ => {
	let ret = fetch(`https://www.dogeipsum.com/api/?type=so-doge&start-with-lorem=1`)
	.then(e => { return e.json()})
	.then( e=> {
		return {
			type: 'note',
			title: e[2].substr(0,Math.random()*50),
			body: e[1],
			style: {
				backgroundColor: `#${parseInt(Math.random()*1000)}`
			}
		}
	})
	return ret;
}
