import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [audioBlob, setAudioBlob] = useState(null);

  return (
    <GlobalContext.Provider value={{ audioBlob, setAudioBlob }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
