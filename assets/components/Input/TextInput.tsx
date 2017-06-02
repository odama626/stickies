import * as React from 'react';
import * as style from './TextInput.scss';

interface Props {
  pattern?: string;
  placeholder?: string;
  onChange?: (input: string) => void;
  onSubmit?: (input: string) => void;
}

interface State {
  errMsg?: string;
}

export class TextInput extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      errMsg: ''
    }
  }

  validate(value: string): boolean {
    let reg = new RegExp(this.props.pattern, 'g');
    let err = value.replace(reg, '')[0];
    if (typeof err !== 'undefined') {
      this.setState({ errMsg: `${err} not allowed`});
    }
    return typeof err === 'undefined';
  }

  onChange(event: any): void {
    let valid = this.validate(event.target.value);
    if (event.charCode == 13) {
      if (valid) {
        if (typeof this.props.onSubmit !== 'undefined')
          this.props.onSubmit(event.target.value);
      } else {
        console.log('invalid');
        // TODO show error message here
      }
    } else {
      if (this.props.onChange)
        this.props.onChange(event.target.value);
    }
  }

  render(): JSX.Element {
    return (
      <input type='text'
        onKeyPress={this.onChange.bind(this)}
        pattern={this.props.pattern}
        className={ style.entry}
        placeholder={this.props.placeholder}
        data-message={this.state.errMsg}
      />
    )
  }
}