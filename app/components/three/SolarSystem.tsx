"use client";

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Planet } from './Planet';
import { useCelestial } from '@/app/store/celestial-store';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const CameraController = () => {
    const { camera } = useThree();
    const { selectedObject } = useCelestial();
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const isTransitioning = useRef(false);

    useEffect(() => {
        if (selectedObject?.model) {
            isTransitioning.current = true;
        }
    }, [selectedObject]);

    useFrame(({ scene }) => {
        if (selectedObject?.model && controlsRef.current) {
            // Find the actual planet mesh in the scene
            const planetMesh = scene.getObjectByName(selectedObject.id);
            if (!planetMesh) return;

            // Get world position of the planet
            const worldPos = new THREE.Vector3();
            planetMesh.getWorldPosition(worldPos);

            const distance = selectedObject.model.scale * 15;

            if (isTransitioning.current) {
                // Smoothly move camera and update controls
                camera.position.lerp(
                    new THREE.Vector3(
                        worldPos.x,
                        worldPos.y + 2,
                        worldPos.z + distance
                    ),
                    0.05
                );
                controlsRef.current.target.lerp(worldPos, 0.05);

                // Check if we're close enough to end transition
                if (camera.position.distanceTo(new THREE.Vector3(
                    worldPos.x,
                    worldPos.y + 2,
                    worldPos.z + distance
                )) < 0.1) {
                    isTransitioning.current = false;
                }
            } else {
                // Keep the controls target updated with planet position
                controlsRef.current.target.copy(worldPos);
            }

            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={200}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.5}
            dampingFactor={0.2}
            enableDamping
        />
    );
};

const SunLight = () => {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
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

const OrbitalPath = ({ position, radius }: { position: [number, number, number], radius: number }) => {
    const ringRef = useRef<THREE.Mesh>(null);

    return (
        <group position={position}>
            { }
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

                {celestialObjects.map((planet) => (
                    <Planet
                        key={planet.id}
                        planet={planet}
                        isSelected={isSelected(planet.id)}
                        onClick={() => selectObject(planet.id)}
                    />
                ))}
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