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
	         .replace(/<li>\[\s\]/g, '<li class="check-box slick"><input onclick="return false" type="checkbox">')
	         .replace(/<li>\[x\]/g, '<li class="check-box slick"><input checked onclick="return false" type="checkbox">');
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
				e.stopPropagation();
				if (this.props.action) {
					this.props.action(e, this.props.name || this.props.icon);
				}
			},
			name: this.props.name
		}, this.props.icon);
	}
}

class NoteToolbar extends React.Component {

	componentDidMount() {
		let colorButton = document.querySelector('i[name="color"]');
		let jsContainer = document.createElement('div');
		colorButton.parentElement.appendChild(jsContainer);
		jsContainer.style.opacity = 0;
		let jsc = new jscolor(jsContainer);
		jsc.backgroundColor = 'transparent';
		jsc.width = 100;
		jsc.height = 100;
		jsc.shadow = false;
		jsc.borderWidth = 0;
		jsc.fromString(this.props.color);
		jsc.onFineChange = color => this.props.action({change: jsc.toHEXString()}, 'jscolor')
		colorButton.addEventListener('click', jsc.show);
	}

	render() {
		return React.createElement('div', { className: 'Toolbar', onClick: e => e.stopPropagation()},
			React.createElement(Button, { action: this.props.action, name: 'close', icon: 'close'}),
			React.createElement(Button, { action: this.props.action, name: 'color', icon: 'color_lens'})/*,
			React.createElement(Button, { icon: 'photo'}),
			React.createElement(Button, { icon: 'person_add'})
		*/);
	}
}

class Note extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			popout: false,
			title: this.props.title,
			body: this.props.body,
			color: this.props.color
		}
		this.onButtonAction.bind(this);
	}

	onButtonAction(event, name) {
//		console.log(`${name} fired `, event);

		switch(name) {
			case 'color':
				break;

			case 'jscolor':
				this.updateText('color', event.change);
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
		if (this.state.color != nextState.color) {
			return true;
		} else if (this.state.popout && nextState.popout) {
			return false;
		} else if (nextState.popout != this.state.popout) {
			return true;
		} else {
			return (JSON.stringify(nextProps) != JSON.stringify(this.props));
		}
	}

	updateText(state, text) {
		this.setState((prevState, props) => {
			dataset.UpdateNote(props.id, {[state]: text});
			return {[state]: text};
		});
	}

	render() {
		return React.createElement('div', {
			className: `note-container`,
		},
			React.createElement('div', {
				className: `Note ${this.state.popout? 'popout' : ''}`,
				onClick: _ => this.setState(this.open),
				style: this.props.style,
				style: {
					backgroundColor: this.props.color
				}
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
				this.state.popout? React.createElement(NoteToolbar, {
					popout: this.state.popout,
					color: this.state.color,
					action: (state, text) => this.onButtonAction(state, text, this)
				}) : null
			)
		);
	}
}
