import React from 'react';
import { GlobalProvider } from './context/GlobalContext';
import Header from './components/Header';
import AudioVideoContainer from './components/AudioVideoContainer';
function App() {

  return (
    <GlobalProvider>
      <Header />
      <AudioVideoContainer />
    </GlobalProvider>
  );
}

export default App;
