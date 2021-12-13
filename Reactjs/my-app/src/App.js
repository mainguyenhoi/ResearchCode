import logo from './logo.svg';
import './App.css';
import React from 'react'

class App extends React.Component {
  componentDidMount() {
    console.log('this is componentDidmount');
  }
  render(){
    console.log('Render lifecycle')
    return(
      <h1>day la render</h1>
    );
    
  }
}

export default App;
