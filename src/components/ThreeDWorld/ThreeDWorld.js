// ThreeDWorld.js
import React, {useEffect, useRef, useState} from 'react';
import {Html, PerspectiveCamera, Sphere, useTexture} from '@react-three/drei';
import {Canvas, useFrame, useThree} from 'react-three-fiber';
import * as THREE from 'three';
import cityData from '../../resources/citydata.json';
import { gsap } from 'gsap';

import KeyPoint from "./KeyPoint/KeyPoint";
import InfoPanel from "./InfoPanel/InfoPanel";
import {Vector3} from "three";

const EarthModel = ({ onClick, onShowInfoPanel }) => {
    const groupRef = useRef();
    const earthRef = useRef();
    const cloudRef = useRef();
    const texture = useTexture('/img/earth_map2.jpg');
    const bumpMap = useTexture('/img/bump_map.jpg');
    const specularMap = useTexture('/img/earth_spec.jpg');
    const cloudTexture = useTexture('/img/earth_cloud.jpg'); // Charger la texture des nuages
    const { camera } = useThree();
    const [startZoomAnimation, setStartZoomAnimation] = useState([0,0,0]);



    let isDragging = false;
    let previousMousePosition = new THREE.Vector2();


    useEffect(() => {
        const handleMouseDown = () => {
            isDragging = true;
            document.body.style.cursor = "grab";
            const buttons = document.getElementsByClassName("EspaceBouton");
            for(const button of Array.from(buttons)){
                if(button instanceof HTMLButtonElement){
                    button.style.pointerEvents = "none";
                }

            }
        };

        const handleMouseUp = () => {
            isDragging = false;
            document.body.style.cursor = "default";

            const currentRotation = groupRef.current.rotation;

           /* const timeline = gsap.timeline();
            timeline.to(currentRotation, {
                duration: 3,
                x: 0,
                y: 0,
                z: 0,
                ease: "elastic.out(1,0.5)",
                onUpdate: () => {
                    if (isDragging) {
                        timeline.pause();
                    }
                }
            });*/
        };


        const handleMouseMove = (event) => {
            if (isDragging) {
                let deltaMove = new THREE.Vector2(
                    event.offsetX - previousMousePosition.x,
                    event.offsetY - previousMousePosition.y
                );

                let deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        0,
                        (deltaMove.x / 8 * 1) * (Math.PI / 180),
                        -(deltaMove.y / 8 * 1) * (Math.PI / 180),
                        'XYZ'
                    ));

                groupRef.current.quaternion.multiplyQuaternions(deltaRotationQuaternion, groupRef.current.quaternion);
            }

            previousMousePosition.set(event.offsetX, event.offsetY);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleZoomAnimation = (x,y,z) => {
        setStartZoomAnimation(true);

    };

    useFrame(() => {
        camera.position.z = 2;
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001; // Appliquer une rotation à la sphère de la terre
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.0015; // Appliquer une rotation à la sphère des nuages
        }
    });

    return (
        <group ref={groupRef} onClick={onClick}>
            <Sphere args={[1, 32, 32]} ref={earthRef} >
                <meshPhongMaterial map={texture} bumpMap={bumpMap} bumpScale={1.5} specularMap={specularMap} />
                {cityData.map(city => <KeyPoint key={city.city} latitude={city.lat} longitude={city.lon} city={city.city} onShowInfoPanel={onShowInfoPanel} startZoomAnimation={(x, y, z) => handleZoomAnimation(x, y, z)} />)}
            </Sphere>
            <Sphere args={[1.01, 32, 32]} ref={cloudRef}> {/* Ajouter une deuxième sphère pour les nuages */}
                <meshPhongMaterial map={cloudTexture} side={'double'} opacity={0.4} transparent={true} depthWrite={false} />
            </Sphere>
        </group>
    );
};

const ThreeDWorld = () => {
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [cityStats, setCityStats] = useState(null);
    const handleShowInfoPanel = (city) => {
        setShowInfoPanel(false);
        setShowInfoPanel(true);
        setCityStats(city);
        console.log(city);
    };

    return (
        <div style={{height: "100%"}}>
            <Canvas>
                <PerspectiveCamera position={[0, 0, 1]} />
                <ambientLight intensity={3.0} /> {/* Augmentation de l'intensité de la lumière ambiante */}
                <pointLight position={[10, 10, 10]} />
                <EarthModel onShowInfoPanel={(city) => handleShowInfoPanel(city)} />
            </Canvas>
            {showInfoPanel && <InfoPanel city={cityStats} />}
        </div>

    );
};

export default ThreeDWorld;
