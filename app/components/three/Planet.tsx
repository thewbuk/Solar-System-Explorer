"use client";

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { Mesh, DoubleSide, Group } from 'three';
import { PlanetData } from '@/app/data/planets';

interface PlanetProps {
    planet: PlanetData;
    isSelected: boolean;
    onClick: () => void;
}

export const Planet = ({ planet, isSelected, onClick }: PlanetProps) => {
    const groupRef = useRef<Group>(null);
    const meshRef = useRef<Mesh>(null);
    const ringRef = useRef<Mesh>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const initialRotation = useRef(Math.random() * Math.PI * 2);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * (0.1 / (planet.rotationPeriod / 24));
        }

        if (ringRef.current && planet.id === 'saturn') {
            ringRef.current.rotation.z += delta * 0.02;
        }

        if (groupRef.current && planet.id !== 'sun') {
            groupRef.current.rotation.y = initialRotation.current +
                (state.clock.elapsedTime * 0.005 / (planet.orbitalPeriod / 365));
        }
    });

    const texture = useTexture(planet.texture);
    const position = planet.model?.position || [0, 0, 0];

    const planetMesh = (
        <mesh
            ref={meshRef}
            name={planet.id}
            position={position}
            scale={planet.model?.scale || 1}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerEnter={() => setShowTooltip(true)}
            onPointerLeave={() => setShowTooltip(false)}
        >
            <sphereGeometry args={[1, planet.id === 'sun' ? 64 : 32, planet.id === 'sun' ? 64 : 32]} />
            <meshStandardMaterial
                color={planet.color}
                map={texture}
                emissive={planet.id === 'sun' ? planet.color : (isSelected || showTooltip ? planet.color : undefined)}
                emissiveIntensity={planet.id === 'sun' ? 0.5 : (isSelected ? 0.8 : showTooltip ? 0.3 : 0)}
                metalness={isSelected ? 0.5 : 0.2}
                roughness={isSelected ? 0.3 : 0.8}
            />
            {showTooltip && !isSelected && (
                <Html distanceFactor={15}>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                        {planet.name}
                    </div>
                </Html>
            )}
        </mesh>
    );

    if (planet.id === 'sun') return planetMesh;

    return (
        <group ref={groupRef} rotation={[0, initialRotation.current, 0]}>
            {planetMesh}
            {planet.id === 'saturn' && (
                <mesh
                    ref={ringRef}
                    position={position}
                    scale={planet.model?.scale || 1}
                    rotation={[Math.PI / 3, 0, 0]}
                >
                    <ringGeometry args={[1.2, 2, 64]} />
                    <meshStandardMaterial
                        color="#E4D7A8"
                        transparent
                        opacity={0.8}
                        side={DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
}; 