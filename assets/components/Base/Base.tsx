import * as React from 'react';
import * as Dataset from '../../dataset';

interface Props {
  id?: number;
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
      this.setState(this.initialState());
    }
    return !this.props.id;
  }
  
  setSavableState(state: any): any {
    if (this.props.id) {
      Dataset.UpdateComponent(this.props.id, state);
    }
    return super.setState(state);
  }

  componentWillReceiveProps(nextProps: any) {
    super.setState(nextProps);
  }

}