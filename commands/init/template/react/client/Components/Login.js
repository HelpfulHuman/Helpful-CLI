import React from 'react';

class Login extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin () {
    if (this.props.onLogin) {
      this.props.onLogin(
        this.email.value,
        this.password.value
      );
    }
  }

  render () {
    return (
      <div className='Login'>
        { this.props.isLoading ? 'Logging in...' : null }
        <input type='email' ref={c => this.email = c} placeholder='E-Mail Address' />
        <input type='password' ref={c => this.password = c} placeholder='Password' />
        <button
          onClick={this.handleLogin}
          disabled={this.props.isLoading}>
            Login
        </button>
      </div>
    );
  }

}

Login.propTypes = {
  onLogin: React.PropTypes.func
};

export default Login;