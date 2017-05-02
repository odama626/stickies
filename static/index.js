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

function generateRandomNote() {
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

class NoteBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.text,
			renderedText: this.markdownFormatter(this.props.text)
		}
	}

	markdownFormatter(text) {
		if (text) {
	    var a = marked(text, {break: true});
	    a = a.replace(/<a/g, '<a target="_blank"')
	         .replace(/<li>\[\s\]/g, '<li class="check-box"><input onclick="return false" type="checkbox">')
	         .replace(/<li>\[x\]/g, '<li class="check-box"><input checked onclick="return false" type="checkbox">');
	    return a;
		} else  {
			return text;
		}
  }

	updateText(event) {
		var output = event.target.innerText;
		this.setState((prevState, props) => {
			if (this.props.listener) {
				this.props.listener(output);
			}
			return {text: output, renderedText: this.markdownFormatter(output)};
		});
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.edit) {
			this.setState((prevState, props) => {
				return { text: nextProps.text, renderedText: this.markdownFormatter(nextProps.text)};
			});
		}
	}

	renderEditable() {
		return React.createElement('div', {
			onClick: e=> e.stopPropagation(),
			className: `${this.props.className} markdown-input`,
			contentEditable: true,
			['data-placeholder']: this.props.placeholder,
			onInput: e => this.updateText(e)
		}, this.props.text);
	}

	render() {
		if (this.props.edit) {
			return this.renderEditable();
		} else {
			return React.createElement('div', {className: `${this.props.className} markdown-view`, dangerouslySetInnerHTML: { __html: this.state.renderedText}});
		}
	}
}

class Button extends React.Component {
	render() {
		return React.createElement('i', {
			className: 'Button material-icons',
			onClick: e => {
				if (this.props.action) {
					this.props.action(e, this.props.name || this.props.icon);
				}
			},
			name: this.props.name
		}, this.props.icon);
	}
}

class NoteToolbar extends React.Component {
	render() {
		if (this.props.popout) {
			return React.createElement('div', { className: 'Toolbar', onClick: e => e.stopPropagation()},
				React.createElement(Button, { action: this.props.action, name: 'close', icon: 'close'}),
				React.createElement(Button, { action: this.props.action, name: 'color', icon: 'color_lens'})/*,
				React.createElement(Button, { icon: 'photo'}),
				React.createElement(Button, { icon: 'person_add'})
			*/);
		} else { return null;}
	}
}

class Note extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			popout: false,
			title: this.props.title,
			body: this.props.body
		}
		this.onButtonAction.bind(this);
	}

	onButtonAction(event, name) {
		console.log(`${name} fired ${event}`);

		switch(name) {
			case 'color':
				break;
			default:
				this.setState(this.open);
		}

	}

	open(prevState, props) {
		return { popout: !prevState.popout };
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.popout) {
			this.setState((prevState, props) => {
				return { title: nextProps.title, body: nextProps.body};
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.popout && nextState.popout) {
			return false;
		} else if (nextState.popout != this.state.popout) {
			return true;
		} else {
			return (JSON.stringify(nextProps) != JSON.stringify(this.props));
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.popout) {
			let colorButton = document.querySelector('i[name="color"]');
			console.log(colorButton);
			new jscolor(colorButton);
		}
	}

	updateText(state, text) {
		this.setState((prevState, props) => {
			if (state == 'title') {
				dataset.UpdateNote(props.id, {title: text});
				return { title: text}
			} else {
				dataset.UpdateNote(props.id, {body: text});
				return { body: text}
			}
		});
	}

	render() {
		return React.createElement('div', {
			className: `note-container`
		},
			React.createElement('div', {
				className: `Note ${this.state.popout? 'popout' : ''}`,
				onClick: _ => this.setState(this.open),
				style: this.props.style
			},
				React.createElement(NoteBody, {
					edit: this.state.popout,
					className: 'title',
					text: this.state.title,
					listener: text => this.updateText('title', text),
					placeholder: 'Title'
				}),
				React.createElement(NoteBody, {
					edit: this.state.popout,
					className: 'body',
					text: this.state.body,
					listener: text => this.updateText('body', text),
					placeholder: 'Take a note...'
				}),
				React.createElement(NoteToolbar, {
					popout: this.state.popout,
					action: (state, text) => this.onButtonAction(state, text, this)
				})
			)
		);
	}
}

class StickyContainer extends React.Component {
	render() {
		let notes = [];
		Object.keys(dataset.notes).forEach( note => {
			notes.push(React.createElement(Note, dataset.notes[note], 'Note'));
		})

		return React.createElement('div', { className: 'StickyContainer'},
			notes
		);
	}
}

class CreateNoteBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			entry: false,
			title: this.props.title,
			body: this.props.body
		}
	}

	toggleEntry(prevState, props) {
		if (prevState.entry) {
			//console.log((this.state.body || this.state.title));
			if (this.state.body || this.state.title) {
				dataset.AddNote({
					type: 'note',
					title: this.state.title || '',
					body: this.state.body || '',
				});
				ReactDOM.render(
					React.createElement(App, {}, null),
					document.getElementById('app')
				);
				this.setState(this.clearText);
			}
		}
		return { entry: !prevState.entry };
	}

	clearText(prevState, props) {
		return { title: null, body: null }
	}

	updateText(state, text) {
		this.setState((prevState, props) => {
			if (state == 'title') {
				return { title: text}
			} else {
				return { body: text}
			}
		});
	}

	onButtonAction(state, text) {
		if (text == 'close') {
			this.setState(this.toggleEntry);
		}
	}

	renderEntry() {
		return React.createElement('div', {
				className: 'CreateNoteBar entry',
				onClick: _ => this.setState(this.toggleEntry)
			},
			React.createElement(NoteBody, { edit: true, className: 'title', listener: text => this.updateText('title', text), placeholder: 'Title'}),
			React.createElement(NoteBody, { edit: true, className: 'body', listener: text => this.updateText('body', text), placeholder: 'Take a note...'}),
			React.createElement(NoteToolbar, { popout: this.state.entry, action: (state, text) => this.onButtonAction(state, text, this)})
		);
	}

	renderDefault() {
		return React.createElement('div', { className: 'CreateNoteBar'},
			React.createElement('div', {
				className: 'textEntry',
				onClick: _ => this.setState(this.toggleEntry)
			}, 'Take a note...'),
			React.createElement(Button, { icon: 'attachment'})
		);
	}

	render() {
		if (this.state.entry) {
			return this.renderEntry();
		} else {
			return this.renderDefault();
		}
	}
}

class App extends React.Component {
	render() {
		return React.createElement('div', {className: 'App'},
			React.createElement(CreateNoteBar, {}),
			React.createElement(StickyContainer, {}, null)
		);
	}
}

window.onload = _ => {
	ReactDOM.render(
		React.createElement(App, {}, null),
		document.getElementById('app')
	);

	notes.map().on((note, id) => {
		//console.log('blah');
			dataset.notes[id] = note;
			ReactDOM.render(
				React.createElement(App, {}, null),
				document.getElementById('app')
			);
	});
}
