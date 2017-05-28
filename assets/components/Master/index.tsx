import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Dataset from '../../dataset';
import { ContributeBar } from '../ContributeBar/ContributeBar';
import * as ComponentTypes from './ComponentRegistry';

//import '../scss/global.scss';
import * as style from './App.scss';

declare var window;
window.dataset = Dataset;

class MasterContainer extends React.Component<{ componentTypes: any}, {}> {
	constructor(props) {
		super(props);
	}
	
	createComponent(data: any): any {
		data.type = data.type[0].toUpperCase() + data.type.slice(1);
		return React.createElement(this.props.componentTypes[data.type], data);
	}

	render() {
		let containers: any = [];
		if (Dataset.items) {
			
			let data = Object.keys(Dataset.items);
			let i = 0;
			for (; i < data.length; i++) {
				containers.push(this.createComponent(Dataset.items[data[i]]));
			}
		}
		return React.createElement('div', { className: style.content},
			containers
		)
	}
}
// <CreateNote />
class App extends React.Component<{},{}> {
	private componentTypes: any;

	constructor(props) {
		super(props);
		this.componentTypes = ComponentTypes.getComponentTypes();
	}

	render(): JSX.Element {
		return (
			<div className={style.container}>
				<ContributeBar componentTypes={this.componentTypes} />
				<MasterContainer componentTypes={this.componentTypes} />
			</div>
		);
	}
}

function render() {
	ReactDOM.render(<App />, document.getElementById('app'));
}


window.onload = _ => {
	render();
	Dataset.registerCallbackFunction(render);
}
