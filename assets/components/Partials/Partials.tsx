import * as React from 'react';
import * as moment from 'moment';
import { TwitterPicker } from 'react-color';

import * as style from './Partials.scss';

interface IconButtonProps {
	onClick?: (event: any, name: string) => void;
	name?: string;
	icon: string;
	id?: string
	alert?: boolean;
}

export class IconButton extends React.Component<IconButtonProps, {}> {
	static getDefaultProps = { alert: false }

	private onClick(event: any): void {
		event.stopPropagation();
		if (this.props.onClick) {
			this.props.onClick(event, this.props.name || this.props.icon);
		}
	}

	render(): JSX.Element {
		let classModifier = this.props.alert? style.alert : '';
		return (
			<i id={this.props.id} onClick={this.onClick.bind(this)} className={`${style.iconButton} ${classModifier} material-icons`} name={this.props.name}>
				{this.props.icon}
			</i>
		)
	}
}

interface ToolbarProps {
	onClick: (event: any, name: string) => void;
	modified?: string;
	open: boolean;
	tags?: string;
}

interface ToolbarState {
	colorToggle: boolean;
	tags: string[];
}

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
	public state: ToolbarState;
	constructor(props: ToolbarProps) {
		super(props);
		this.state = { 
			colorToggle: false,
			tags: []
		}
		let tags = {};
		try {
			tags = JSON.parse(props.tags);
		} catch( e) {}
		this.state.tags = this.sortTags(tags);
	}

	componentWillReceiveProps(nextProps) {
		let tags = {};
		try {
			tags = JSON.parse(nextProps.tags);
		} catch( e) {}
		this.setState({tags: this.sortTags(tags)});
	}

	sortTags(tags: {[key: string]: number}): string[] {
		if (typeof tags !== 'undefined') {
			let tagsStr = Object.keys(tags);
			return tagsStr.sort((a, b) => tags[b] - tags[a]);
		}
		return [];
	}

	changeColor(color: any): void {
		this.props.onClick({change: color.hex}, 'jscolor');
		this.setState({colorToggle: !this.state.colorToggle});
	}

	toggleColor() {
		this.setState({colorToggle: !this.state.colorToggle});
	}

	renderOpen(): JSX.Element {
		return (
			<div className={style.toolbar} onClick={e => e.stopPropagation()}>
				<div className={style.right}>
					{this.state.colorToggle?
						<div className={style.colorPickerContainer}>
							<TwitterPicker onChange={this.changeColor.bind(this)} triangle='top-right' />
						</div>
					: null}
					<IconButton id='color' onClick={this.toggleColor.bind(this)} name='color' icon='color_lens' />
					<IconButton onClick={this.props.onClick} name='close' icon='close' />
				</div>
				<div className={style.left}>
					<IconButton id='delete' alert={true} onClick={this.props.onClick} name='delete' icon='delete' />
					<div className={style.timestamp}>{moment(this.props.modified).fromNow()}</div>
				</div>
			</div>
		)
	}

	renderClosed(): JSX.Element {

		let tags: any[] = [];
		for (let i=0; i< this.state.tags.length; i++) {
			if (this.state.tags[i] !== '#') {
				tags.push(React.createElement('span', { key: i, className: style.tag }, `#${this.state.tags[i]}`));
			}
		}

		return (
			<div className={style.tagContainer} >
				{ tags }
			</div>
		)
	}

	render(): JSX.Element {
		return (
			<div>
			{ this.props.open? this.renderOpen() : this.renderClosed()}
			</div>
		)
	}
}
