"use client";

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Planet } from './Planet';
import { useCelestial } from '@/app/store/celestial-store';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const CameraController = () => {
    const { camera } = useThree();
    const { selectedObject } = useCelestial();
    const targetRef = useRef(new THREE.Vector3());
    const [transitionActive, setTransitionActive] = useState(false);

    useEffect(() => {
        if (selectedObject && selectedObject.model) {
            // Set target position for smooth camera movement
            targetRef.current.set(
                selectedObject.model.position[0],
                selectedObject.model.position[1],
                selectedObject.model.position[2]
            );
            setTransitionActive(true);
        }
    }, [selectedObject]);

    useFrame(() => {
        if (transitionActive && selectedObject?.model) {
            // Calculate appropriate camera distance based on object scale
            const distance = selectedObject.model.scale * 10;

            // Move camera position with smooth interpolation
            const cameraTarget = new THREE.Vector3(
                targetRef.current.x,
                targetRef.current.y + 2,
                targetRef.current.z + distance
            );

            // Use slower lerp for smoother transitions
            camera.position.lerp(cameraTarget, 0.01);

            // Look at the selected object
            camera.lookAt(targetRef.current);

            // Stop transition when close enough
            if (camera.position.distanceTo(cameraTarget) < 0.5) {
                setTransitionActive(false);
            }
        }
    });

    return null;
};

// Sun light effect with dynamic flares
const SunLight = () => {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
            // Subtle light intensity oscillation for sun
            const time = clock.getElapsedTime();
            lightRef.current.intensity = 1.8 + Math.sin(time * 0.5) * 0.2;
        }
    });

    return (
        <>
            <pointLight
                ref={lightRef}
                position={[0, 0, 0]}
                intensity={2}
                color="#FDB813"
                distance={100}
                decay={1.5}
            />
            <ambientLight intensity={0.2} />
        </>
    );
};

// Orbital paths with NO animated markers
const OrbitalPath = ({ position, radius }: { position: [number, number, number], radius: number }) => {
    const ringRef = useRef<THREE.Mesh>(null);

    return (
        <group position={position}>
            {/* Orbit ring */}
            <mesh
                ref={ringRef}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[radius - 0.025, radius + 0.025, 128]} />
                <meshBasicMaterial color="#666666" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export const SolarSystem = () => {
    const { celestialObjects, selectObject, isSelected } = useCelestial();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    return (
        <div className="h-[600px] w-full relative bg-black rounded-lg overflow-hidden">
            {/* Controls for camera position */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => {
                        if (cameraRef.current) {
                            cameraRef.current.position.set(0, 100, 0);
                            cameraRef.current.lookAt(0, 0, 0);
                        }
                    }}
                    className="bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-colors"
                >
                    Top View
                </button>
                <button
                    onClick={() => {
                        if (cameraRef.current) {
                            cameraRef.current.position.set(0, 30, 80);
                            cameraRef.current.lookAt(0, 0, 0);
                        }
                    }}
                    className="bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-colors"
                >
                    Side View
                </button>
            </div>

            <Canvas ref={canvasRef} dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    position={[0, 30, 80]}
                    fov={60}
                    near={0.1}
                    far={1000}
                />
                <SunLight />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />
                <CameraController />
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    minDistance={5}
                    maxDistance={200}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.5}
                    dampingFactor={0.2}
                    enableDamping
                />

                {/* Planets */}
                {celestialObjects.map((planet) => (
                    <Planet
                        key={planet.id}
                        planet={planet}
                        isSelected={isSelected(planet.id)}
                        onClick={() => selectObject(planet.id)}
                    />
                ))}

                {/* Orbital paths - without markers */}
                {celestialObjects
                    .filter(obj => obj.id !== 'sun' && obj.model?.position)
                    .map((planet) => (
                        <OrbitalPath
                            key={`path-${planet.id}`}
                            position={[0, 0, 0]}
                            radius={planet.model?.position[0] || 0}
                        />
                    ))}
            </Canvas>
        </div>
    );
}; 