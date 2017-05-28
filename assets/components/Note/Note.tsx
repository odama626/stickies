import * as React from 'react';
import { Markdown } from '../Markdown/Markdown';
import { Toolbar } from '../Partials/Partials';
import { Base } from '../Base/Base';

import * as style from './Note.scss';

interface Props {
	//id?: number;
	title?: string;
	body?: string;
	color?: string;
}

interface State {
	open: boolean;
	title: string;
	body: string;
	color: string;
}

export class Note extends Base<Props, State> {

	static getDefaultProps = {
		color: '#fff'
	}

	static getClassName(): string { return 'Note';}

	initialState(): any {
		let state = super.initialState();
		state.open = false;
		state.title = this.props.title || '';
		state.body = this.props.body || '';
		state.color =this.props.color || '#fff';
		return state;
	}

	constructor(props: Props) {
		super(props);
		this.state = this.initialState();
	}

	onButtonAction(event: any, name: string): void {
		switch(name) {
			case 'color':
				break;
			case 'jscolor':
				this.updateText('color', event.change);
				break;
			case 'close':
				this.toggle();
				this.setState({ open: !this.state.open});
				break;
		};
		if (!this.state.open) {
			this.setState({ open: !this.state.open});
		}
	}

	toggle(): void {
		if (this.state.open && ( this.state.title || this.state.body)) {
			let data = {
				title: this.state.title,
				body: this.state.body,
				color: this.state.color
			}
			this.createSelf('Note', data);
		}
		this.setState({ open: !this.state.open});
	}

	updateText(state: any, text: string): void {
		this.setSavableState({[state]: text});
	}

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		let shouldUpdate: boolean;
		if (this.state.color != nextState.color) {
			shouldUpdate = true;
		} else if (this.state.open && nextState.open) {
			shouldUpdate = false;
		} else if (nextState.open != this.state.open) {
			shouldUpdate = true;
		} else {
			shouldUpdate = (JSON.stringify(nextProps) != JSON.stringify(this.props));
		}
		return shouldUpdate;
	}

	render() {
		return React.createElement('div', { className: style.container},
			React.createElement('div', {
				className: `${style.content} ${this.state.open? style.open : ''}`,
				onClick: this.onButtonAction.bind(this),
				style: {
					backgroundColor: this.state.color
				}
			},
				React.createElement('div', { className: style.contentContainer },
					React.createElement(Markdown, {
						edit: this.state.open,
						className: style.title,
						text: this.state.title,
						onChange: text => this.updateText('title', text),
						placeHolder: 'Title'
					}),
					React.createElement(Markdown, {
						edit: this.state.open,
						className: style.body,
						text: this.state.body,
						onChange: text => this.updateText('body', text),
						placeHolder: 'Take a note...',
					})
				),
				this.state.open?
					React.createElement(Toolbar, {
						color: this.state.color,
						onClick: (state, text) => this.onButtonAction(state, text)
					})
				: null
		)
		)
	}
}