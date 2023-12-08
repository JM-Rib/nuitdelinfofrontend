import React from 'react';
import Bouton from '../components/Bouton';
// import { useAuth } from '../providers/AuthProvider';
import ThreeDWorld from "../components/ThreeDWorld/ThreeDWorld";
import './Accueil.css';


function Accueil(props) {
  // const {logout, hasLoginData} = useAuth();

	return (
        <div className="acceuil" style={{ width: '100vw', height: '100vh' }}>

            <Bouton  nom="Historique git" type="lien" lien={"/okko/"}  />
            <ThreeDWorld style={{ width: '100%', height: '100%' }}></ThreeDWorld>
            <p>Bienvenue</p>
        </div>
    );
}

export default Accueil;
