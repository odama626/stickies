import * as React from 'react';
import * as Dataset from '../../dataset';
import { Markdown } from '../Markdown/Markdown';
import { Toolbar } from '../Partials/Partials';

import * as style from './Note.scss';

declare var window;

window.Types = {};


interface Props {
	id?: number;
	title?: string;
	body?: string;
	color?: string;
}

interface State {
	popout: boolean;
	title: string;
	body: string;
	color: string;
}



export class Note extends React.Component<Props, State> {

	static getDefaultProps = {
		color: '#fff'
	}

	static getClassName(): string { return 'Note';}

	constructor(props: Props) {
		super(props);
		this.state = {
			popout: false,
			title: this.props.title || '',
			body: this.props.body || '',
			color: this.props.color
		}
	}

	onButtonAction(event: any, name: string): void {
		switch(name) {
			case 'color':
				break;
			case 'jscolor':
				this.updateText('color', event.change);
				break;
			default:
				this.toggle();
				this.setState({ popout: !this.state.popout});
				break;
		};
	}

	toggle(): void {
		if (this.state.popout && ( this.state.title || this.state.body) && !this.props.id) {
			let data = {
				title: this.state.title,
				body: this.state.body,
				color: this.state.color
			}
			Dataset.CreateComponent('Note', data);
			this.setState({ title: '', body: '', color: '#FFF'});
		}
		this.setState({ popout: !this.state.popout});
	}

	updateText(state: any, text: string): void {
		if (this.props.id) {
			Dataset.UpdateComponent(this.props.id, {[state]: text});
		}
		this.setState({[state]: text});
	}

	componentWillReceiveProps(nextProps: Props): void {
		if (!this.state.popout && this.props.id) {
			this.setState({ title: nextProps.title, body: nextProps.body, color: nextProps.color });
		}
	}

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		let shouldUpdate: boolean;
		if (this.state.color != nextState.color) {
			shouldUpdate = true;
		} else if (this.state.popout && nextState.popout) {
			shouldUpdate = false;
		} else if (nextState.popout != this.state.popout) {
			shouldUpdate = true;
		} else {
			shouldUpdate = (JSON.stringify(nextProps) != JSON.stringify(this.props));
		}
		return shouldUpdate;
	}

	render() {
		return React.createElement('div', { className: style.container},
			React.createElement('div', {
				className: `${style.content} ${this.state.popout? style.open : ''}`,
				onClick: this.onButtonAction.bind(this),
				style: {
					backgroundColor: this.state.color
				}
			},
				React.createElement('div', {className: style.contentContainer},
					React.createElement(Markdown, {
						edit: this.state.popout,
						className: style.title,
						text: this.state.title,
						onChange: text => this.updateText('title', text),
						placeHolder: 'Title'
					}),
					React.createElement(Markdown, {
						edit: this.state.popout,
						className: style.body,
						text: this.state.body,
						onChange: text => this.updateText('body', text),
						placeHolder: 'Take a note...',
					})
				),
				this.state.popout?
					React.createElement(Toolbar, {
						color: this.state.color,
						onClick: (state, text) => this.onButtonAction(state, text)
					})
				: null
		)
		)
	}
}