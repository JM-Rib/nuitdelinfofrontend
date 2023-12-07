import React from 'react';
import Bouton from '../components/Bouton';
// import { useAuth } from '../providers/AuthProvider';

function Accueil(props) {
  // const {logout, hasLoginData} = useAuth();

	return (
    <div className="acceuil">
      <Bouton nom="OkKo" type="lien" lien={"/okko/"}  /> 
      <p>Bienvenue</p>      
    </div>
    );
}

export default Accueil;