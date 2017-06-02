import * as React from 'react';
import * as Dataset from '../../dataset';

interface Props {
  id?: number;
  timestamp?: string;
}

interface State {
}

export class Base<P extends Props, S extends State> extends React.Component<P, S> {

  constructor(props: P) {
    super(props);
  }

  initialState(): any {
    return {};
  }

  createSelf(type: string, state: any): boolean {
    if (typeof this.props.id === 'undefined') {
      Dataset.CreateComponent(type, state);
      this.setState(this.initialState(), () => this.forceUpdate());
    }
    return !this.props.id;
  }

  parseTags(content: string): {[key: string]: number } {
    let match = /\#[\w\-]+/g;
    let out: {[key: string]: number} = {};
    let matches = content.match(match);
    if (matches !== null) {
      matches.map((val: string) => {
        val = val.slice(1);
        out[val] = out[val]+1 || 1;
      });
    }
    return out;
  }

  onToolbarAction(event: any, name: string) {
    switch(name) {
      case 'delete':
        Dataset.UpdateComponent(this.props.id, null);
        this.forceUpdate();
    }
  }

  setUnattendedState(state: any): any {
    Dataset.UpdateComponentMeta(this.props.id, state);
    return super.setState(state);
  }
  
  setSavableState(state: any): any {
    Dataset.UpdateComponent(this.props.id, state);
    return super.setState(state);
  }
/*
  componentWillReceiveProps(nextProps: any) {
    super.setState(nextProps);
  }
*/
}