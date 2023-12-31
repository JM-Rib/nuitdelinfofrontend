// ThreeDWorld.js
import React, {useEffect, useRef, useState} from 'react';
import {Environment, OrbitControls, PerspectiveCamera, Sphere, useTexture} from '@react-three/drei';
import {Canvas, useThree} from 'react-three-fiber';


import cityData from '../../resources/citydata.json';


import KeyPoint from "./KeyPoint/KeyPoint";
import InfoPanel from "./InfoPanel/InfoPanel";
import {useControls} from "leva";


const EarthModel = ({ onClick, onShowInfoPanel }) => {
    const groupRef = useRef();
    const earthRef = useRef();
    const { gl } = useThree()
    const texture = useTexture('/img/earth_map3.jpg');
    const displacementMap = useTexture('/img/bump_map2.jpg');
    const specularMap = useTexture('/img/earth_spec.jpg');
    const { camera } = useThree();
    const [startZoomAnimation, setStartZoomAnimation] = useState([0,0,0]);



    useEffect(() => {
        texture.anisotropy = gl.capabilities.getMaxAnisotropy()
    }, [texture, gl])

    const handleZoomAnimation = (x,y,z) => {
        setStartZoomAnimation(true);
        console.log("camera postion : ", camera.position);
        console.log("coordonnées : ", x,y,z);


    };


    return (
        <group ref={groupRef} onClick={onClick}>
            <Sphere args={[1, 1024, 1024]} ref={earthRef} castShadow={true} receiveShadow={true} >
                <meshStandardMaterial
                    map={texture}
                    displacementMap={displacementMap}
                    displacementScale={0.02}
                />
                {cityData.map(city => <KeyPoint key={city.city} latitude={city.lat} longitude={city.lon} city={city.city} onShowInfoPanel={onShowInfoPanel} startZoomAnimation={(x, y, z) => handleZoomAnimation(x, y, z)} />)}
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
            <Canvas shadows camera={{ position: [0, 0, 1.75] }}>
                <PerspectiveCamera position={[0, 0, 1]} />
                <Environment files="/img/venice_sunset_1k.hdr" />
                <directionalLight
                    intensity={2}
                    position={[4, 0, 2]}
                    castShadow={true}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-2}
                    shadow-camera-right={2}
                    shadow-camera-top={-2}
                    shadow-camera-bottom={2}
                    shadow-camera-near={0.1}
                    shadow-camera-far={7}
                />
                <directionalLight
                    intensity={2}
                    position={[3, 0, 3]}
                    castShadow={true}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-2}
                    shadow-camera-right={2}
                    shadow-camera-top={-2}
                    shadow-camera-bottom={2}
                    shadow-camera-near={0.1}
                    shadow-camera-far={7}
                />
                <EarthModel onShowInfoPanel={(city) => handleShowInfoPanel(city)} />
                <OrbitControls />
            </Canvas>
            {showInfoPanel && <InfoPanel city={cityStats} />}
        </div>

    );
};

export default ThreeDWorld;
