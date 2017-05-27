import * as React from 'react';
import { TwitterPicker } from 'react-color';

import * as style from './Partials.scss';

declare var window;
declare var jscolor;

interface IconButtonProps {
	onClick?: (event: any, name: string) => void;
	name?: string;
	icon: string;
	id?: string
}

export class IconButton extends React.Component<IconButtonProps, {}> {

	private onClick(event: any): void {
		event.stopPropagation();
		if (this.props.onClick) {
			this.props.onClick(event, this.props.name || this.props.icon);
		}
	}

	render(): JSX.Element {
		return (
			<i id={this.props.id} onClick={this.onClick.bind(this)} className={`${style.iconButton} material-icons`} name={this.props.name}>
				{this.props.icon}
			</i>
		)
	}
}

interface ToolbarProps {
	onClick: (event: any, name: string) => void;
	color?: string;
}

interface ToolbarState {
	colorToggle: boolean;
}

/* TODO darken toolbar by getting hsl of color and changing lightness, remove filter
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
*/

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {

	constructor(props: ToolbarProps) {
		super(props);
		this.state = { colorToggle: false }
	}

	changeColor(color: any): void {
		this.props.onClick({change: color.hex}, 'jscolor');
		this.setState({colorToggle: !this.state.colorToggle});
	}

	toggleColor() {
		this.setState({colorToggle: !this.state.colorToggle});
	}

	render(): JSX.Element {
		return (
			<div className={style.toolbar} onClick={e => e.stopPropagation()}>
				<IconButton onClick={this.props.onClick} name='close' icon='close' />
				<IconButton id='color' onClick={this.toggleColor.bind(this)} name='color' icon='color_lens' />
				{this.state.colorToggle?
					<div className={style.colorPickerContainer}>
						<TwitterPicker onChange={this.changeColor.bind(this)} triangle='top-right' />
					</div>
				: null}
			</div>
		)
	}
}
