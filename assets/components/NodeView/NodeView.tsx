import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Dataset from '../../dataset';

import { TextInput } from '../Input/TextInput';

import * as style from './NodeView.scss';

var nodes: any = {};


class NodeView extends React.Component<{nodes: any}, {}> {
  private currentRoute: string;
  constructor(props) {
    super(props);
    this.currentRoute = this.getCurrentRoute()
  }

  getCurrentRoute(): string {
    let path = window.location.pathname;
    return path;
  }

  capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  createComponent(node: string) {
    return React.createElement('a', {key: node, href:`${this.currentRoute}/${node}`, className: style.spaceLink},
      React.createElement('div', {  }, this.capitalize(node))
    );
  }

  render(): JSX.Element {
    let containers: any = [];
    let data = Object.keys(this.props.nodes);
    let i = 0;
    for (; i < data.length; i++) {
      containers.push(this.createComponent(data[i]));
    }

    return (
      
      <div className={style.container} style={{display: 'inline-block'}}>
        <div className={style.borderBar}>
          <span className={style.spaceLinkTitle}>Create a Space:</span>
          <TextInput onSubmit={createSpace} placeholder='blargh' pattern='[a-zA-Z0-9\-\.\_\~\!\$\&\(\)\*\+\,\;\=\@\%]+' />
        </div>
        <div className={style.spaceLinkTitle +' '+ style.border}>Or checkout an existing one</div>
        <div className={style.spaceLinkContainer}>
          {containers}
        </div>
      </div>
    )
  }
}

function createSpace(space: string): void {
  console.log(space);
  console.log(`${window.location.pathname}/${space}`)
  location.href = `${window.location.pathname}/${space}`
}

function render(val, id) {
  nodes[id] = id;
  //console.log(nodes);
  ReactDOM.render( (
    < NodeView nodes={nodes} />
  ), document.getElementById('NodeView'));
}


window.onload = _ => {
  ReactDOM.render( (
    <NodeView nodes={{}}/>
  ), document.getElementById('NodeView'));
  Dataset.gun.map().on(render);
}