// ThreeDWorld.js
import React, {useEffect, useRef} from 'react';
import {Html, PerspectiveCamera, Sphere, useTexture} from '@react-three/drei';
import {Canvas, useFrame, useThree} from 'react-three-fiber';
import * as THREE from 'three';
import cityData from '../../resources/citydata.json';
import { gsap } from 'gsap';

const EarthModel = ({ onClick }) => {
    const groupRef = useRef();
    const earthRef = useRef();
    const cloudRef = useRef();
    const texture = useTexture('/img/earth_map2.jpg');
    const bumpMap = useTexture('/img/bump_map.jpg');
    const specularMap = useTexture('/img/earth_spec.jpg');
    const cloudTexture = useTexture('/img/earth_cloud.jpg'); // Charger la texture des nuages
    const { camera } = useThree();

    let isDragging = false;
    let previousMousePosition = new THREE.Vector2();

    function placeButtonAtLatLng(latitude, longitude) {
        // Inverser la longitude
        longitude = longitude * -1;

        // Convertir la latitude et la longitude en radians
        const latRad = (latitude * Math.PI) / 180;
        const lonRad = (longitude * Math.PI) / 180;

        // Convertir les coordonnées sphériques en coordonnées cartésiennes
        const x = Math.cos(lonRad) * Math.cos(latRad);
        const y = Math.sin(latRad);
        const z = Math.sin(lonRad) * Math.cos(latRad);

        return (
            <mesh position={[x, y, z]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshPhongMaterial color={0x00ff00} />
            </mesh>
        );
    };

    useEffect(() => {
        const handleMouseDown = () => {
            isDragging = true;
            document.body.style.cursor = "grab";
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
                {cityData.map(city => placeButtonAtLatLng(city.lat, city.lon))}
            </Sphere>
            <Sphere args={[1.01, 32, 32]} ref={cloudRef}> {/* Ajouter une deuxième sphère pour les nuages */}
                <meshPhongMaterial map={cloudTexture} side={'double'} opacity={0.4} transparent={true} depthWrite={false} />
            </Sphere>
        </group>
    );
};

const ThreeDWorld = () => {
    return (
        <Canvas>
            <PerspectiveCamera position={[0, 0, 1]} />
            <ambientLight intensity={3.0} /> {/* Augmentation de l'intensité de la lumière ambiante */}
            <pointLight position={[10, 10, 10]} />
            <EarthModel />
        </Canvas>
    );
};

export default ThreeDWorld;
