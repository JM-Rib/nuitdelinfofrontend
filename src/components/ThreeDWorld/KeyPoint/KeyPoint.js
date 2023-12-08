// KeyPoint.js
import React, {useEffect, useState} from 'react';
import {Html, Sphere} from '@react-three/drei';
import axios from "axios";

import {useThree} from "react-three-fiber";

const KeyPoint = ({ latitude, longitude, city, onShowInfoPanel, startZoomAnimation }) => {
    const { camera } = useThree();
    const [stats, setStats] = useState(null);
    // Inverser la longitude
    longitude = longitude * -1;

    // Convertir la latitude et la longitude en radians
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;

    // Convertir les coordonnées sphériques en coordonnées cartésiennes
    const x = Math.cos(lonRad) * Math.cos(latRad);
    const y = Math.sin(latRad);
    const z = Math.sin(lonRad) * Math.cos(latRad);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=b15da9103f34c639c13c8dc552c87c934c8bfc24`);
                console.log(city)
                console.log(response.data.data);
                setStats(response.data.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'API WAQI :", error);
            }
        };

        fetchData();
    }, [city]);

    const calculateSphereSize = (aqi) => {
        // Définir la plage de l'AQI (par exemple, de 50 à 431)
        const aqiMin = 50;
        const aqiMax = 431;

        // Définir la plage de tailles de sphère correspondante (par exemple, de 0.01 à 0.5)
        const sizeMin = 0.01;
        const sizeMax = 0.1;

        // Calculer la taille de la sphère en utilisant une interpolation linéaire
        const size = sizeMin + ((sizeMax - sizeMin) / (aqiMax - aqiMin)) * (aqi - aqiMin);

        // Retourner la taille calculée
        return size;
    };

    // Ajouter une vérification pour s'assurer que stats n'est pas null avant d'accéder à ses propriétés
    if (!stats) {
        return null; // ou afficher un composant de chargement, un message d'erreur, etc.
    }

    const triggerAnimation = () => {
        // Utilisez GSAP pour animer la position Z de la caméra

        // Afficher le panneau d'information
        onShowInfoPanel(stats);
        startZoomAnimation(x,y,z);
    };


    return (
        <>
            <mesh position={[x, y, z]}>
                <Sphere onClick={triggerAnimation} args={[calculateSphereSize(stats.aqi), 32, 32]}>
                    <meshPhongMaterial color={0x00ff00} />
                </Sphere>
            </mesh>
        </>
    );
};

export default KeyPoint;
