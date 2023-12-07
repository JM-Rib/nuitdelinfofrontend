import './App.css';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import Accueil from "./pages/Accueil"
import CodeOkKo from "./interfaceModif/CodeOkKo"
// import { AuthProvider } from "./providers/AuthProvider";
import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  const[width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange(){
    setWidth(window.innerWidth);
  }
  
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return() => {
      window.removeEventListener('resize',handleWindowSizeChange);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
          <ScrollToTop />
          {/* <AuthProvider> */}
            <Routes>
                <Route path="/" element={<Accueil />}/>
                <Route path="/okko/" element={<CodeOkKo />}/>
  
                {/*si n'importe quoi dans l'url on redirige vers home */}
                <Route path="/*" element={<Accueil />}/>
            </Routes>
          {/* </AuthProvider> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
