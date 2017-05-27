import * as React from 'react';
import * as marked from 'marked';
import * as style from './markdown.scss';

declare var window;
window.marked = marked;

interface Props {
	edit: boolean;
	text: string;
	placeHolder: string;
	onChange?: (event: any) => void;
	className: string;
}

interface State {
	text: string;
	renderedText: string;
}

export class Markdown extends React.Component<Props, State> {

	static getDefaultProps = {
		edit: false,
		onChange: (e) => { console.log(e);}
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			text: this.props.text,
			renderedText: this.formatText(this.props.text)
		}
	}

	private formatText(text: any): string {
		if (text) {
	    var a = marked.parse(text, {break: true});
	    a = a.replace(/<a/g, '<a target="_blank"')
	         .replace(/<li>\[\s\]/g, `<li class="${style.checkBox} ${style.slick}"><input onclick="return false" type="checkbox">`)
	         .replace(/<li>\[x\]/g, `<li class="${style.checkBox} ${style.slick}"><input checked onclick="return false" type="checkbox">`)
					 .replace(/<li>\[o\]/g, `<li class="${style.checkBox} ${style.slick}"><input checked onclick="return false" type="checkbox">`)
					 .replace(/<li><p>\[\s\]/g, `<li class="${style.checkBox} ${style.slick}"><p><input onclick="return false" type="checkbox">`)
					 .replace(/<li><p>\[o\]/g, `<li class="${style.checkBox} ${style.slick}"><p><input checked onclick="return false" type="checkbox">`)
	         .replace(/<li><p>\[x\]/g, `<li class="${style.checkBox} ${style.slick}"><p><input checked onclick="return false" type="checkbox">`);
	    return a;
		} else  {
			return text;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.edit) {
			this.setState({text: nextProps.text, renderedText: this.formatText(nextProps.text)});
		}
	}

	onChange(event: any): void {
		let output = event.target.innerText;
		this.setState({text: output, renderedText: this.formatText(output)});
		if (this.props.onChange) {
			this.props.onChange(output);
		}
	}

	onClick(event: any): void {
		event.stopPropagation();
	}

	renderEditable() {
		return React.createElement('div', {
			className: `${this.props.className} ${style.input}`,
			contentEditable: true,
			['data-placeholder']: this.props.placeHolder,
			onClick: this.onClick.bind(this),
			onInput: this.onChange.bind(this)
		}, this.props.text);
	}

	renderView() {
		return React.createElement('div', {
			className: `${this.props.className} ${style.view}`,
			dangerouslySetInnerHTML: {
				__html: this.state.renderedText
			}
		})
	}

	render() {
		return this.props.edit? this.renderEditable() : this.renderView();
	}
}
