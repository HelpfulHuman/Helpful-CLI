import React from 'react';

class App extends React.Component {

  render () {
    return (
      <div className='App'>
        <h1 className='App-Greeting'>
          Example Application
        </h1>
        { this.props.children }
      </div>
    );
  }

}

export default App;