import * as React from 'react';
import * as Dataset from '../../dataset.js';
import * as style from './ContributeBar.scss';

interface Props {
	componentTypes: any;
}

interface State {
	hintText: string;
	open: boolean;
	renderList: any[];
}

export class ContributeBar extends React.Component<Props,State>  {
	constructor(props) {
		super(props);
		this.state = {
			renderList: this.getComponentTypes(),
			hintText: 'Contribute',
			open: false,
		}
	}

	getComponentTypes() {
		let keys = Object.keys(this.props.componentTypes);
		let i = 0;
		let list: any[] = [];
		for (; i<keys.length; i++) {
			list.push(
				React.createElement('div', { className: style.componentContainer},
					React.createElement('div', { className: style.componentTitle, title: keys[i]}, keys[i]),
					React.createElement(this.props.componentTypes[keys[i]])
			));
		}
		return list;
	}

	renderClosed(): JSX.Element {
		return (
				<div className={style.placeholderText}> {this.state.hintText} </div>
		)
	}

	renderOpen(): JSX.Element {
		return (
			<div className={style.wide}>
				<div>
					{ this.renderClosed() }
				</div>
				<div onClick={ e => { e.stopPropagation(); e.preventDefault(); } } className={`${style.typeFlow} ${style.wide}`}>
					{ this.state.renderList }
				</div>
			</div>
		)
	}

	render(): JSX.Element {
		return (
			<div className={`${style.container} ${this.state.open? style.open : ''}`} onClick={ () => this.setState({ open: !this.state.open})}>
			{ this.state.open? this.renderOpen() : this.renderClosed() }
			</div>
		);
	}
}
