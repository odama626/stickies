class NoteBar extends Note {
	constructor(props) {
		super(props);
	}

	open(prevState, props) {
		if (prevState.popout) {
			console.log((this.state.body || this.state.title));
			if (this.state.body || this.state.title) {
				let note = {
					type: 'note',
					title: this.state.title || '',
					body: this.state.body || '',
					color: this.state.color
				}
				dataset.AddNote(note);
				ReactDOM.render(
					React.createElement(App, {}, null),
					document.getElementById('app')
				);
				this.setState(this.clearText);
			}
		}
		return { popout: !prevState.popout };
	}

	updateText(state, text) {
		this.setState((prevState, props) => {
			return {[state]: text};
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	renderEntry() {
		return React.createElement('div', {
				className: 'CreateNoteBar entry',
				onClick: _ => this.setState(this.open)
			},
			React.createElement(NoteBody, { edit: true, className: 'title', listener: text => this.updateText('title', text), placeholder: 'Title'}),
			React.createElement(NoteBody, { edit: true, className: 'body', listener: text => this.updateText('body', text), placeholder: 'Take a note...'}),
			this.state.popout? React.createElement(NoteToolbar, { popout: this.state.popout, action: (state, text) => this.onButtonAction(state, text, this)}) : null
		);
	}

	renderDefault() {
		return React.createElement('div', { className: 'CreateNoteBar'},
			React.createElement('div', {
				className: 'textEntry',
				onClick: _ => this.setState(this.open)
			}, 'Take a note...')/*,
			React.createElement(Button, { icon: 'attachment'})*/
		);
	}

	render() {
		if (this.state.popout) {
			return this.renderEntry();
		} else {
			return this.renderDefault();
		}
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

class App extends React.Component {
	render() {
		return React.createElement('div', {className: 'App'},
			React.createElement(NoteBar, {}),
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
