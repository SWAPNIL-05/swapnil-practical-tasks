import React from 'react';
import { useSelector } from 'react-redux';
import Auth from './components/Auth';
import Board from './components/Board';

function App() {
  const token = useSelector((state) => state.auth.token);
  return (
    <div className="App">
      {!token ? <Auth /> : <Board />}
    </div>
  );
}

export default App;
