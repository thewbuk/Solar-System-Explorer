"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html, useCursor } from '@react-three/drei';
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
    const [hovered, setHovered] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    // Store initial rotation to prevent random jumping
    const initialRotation = useRef(Math.random() * Math.PI * 2);

    // Set cursor based on hover state
    useCursor(hovered);

    // Auto-rotation with different speeds for each planet
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Different rotation speed based on real rotation periods
            const rotationSpeed = 0.1 / (planet.rotationPeriod / 24);
            meshRef.current.rotation.y += delta * rotationSpeed;
        }

        if (ringRef.current && planet.id === 'saturn') {
            // Rotate rings at a slightly different speed
            ringRef.current.rotation.z += delta * 0.02;
        }

        // Group rotation for orbit simulation - fixed speed
        if (groupRef.current && planet.id !== 'sun') {
            // Orbital speed inversely proportional to orbital period, but don't change position on hover
            const orbitalSpeed = 0.005 / (planet.orbitalPeriod / 365);
            groupRef.current.rotation.y = initialRotation.current + (state.clock.elapsedTime * orbitalSpeed);
        }
    });

    // Show tooltip after short delay when hovering
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (hovered) {
            timeout = setTimeout(() => setTooltipVisible(true), 300);
        } else {
            setTooltipVisible(false);
        }
        return () => clearTimeout(timeout);
    }, [hovered]);

    // Use texture when available (fallback to color)
    let texture;
    try {
        texture = useTexture(planet.texture);
    } catch (error) {
        texture = null;
    }

    // Calculate position from model data
    const position = planet.model?.position || [0, 0, 0];

    // For sun, render directly without orbit group
    if (planet.id === 'sun') {
        return (
            <mesh
                ref={meshRef}
                position={position}
                scale={planet.model?.scale || 1}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color={planet.color}
                    map={texture}
                    emissive={planet.color}
                    emissiveIntensity={0.5}
                />
                {tooltipVisible && !isSelected && (
                    <Html distanceFactor={15}>
                        <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                            {planet.name}
                        </div>
                    </Html>
                )}
            </mesh>
        );
    }

    return (
        <group ref={groupRef} rotation={[0, initialRotation.current, 0]}>
            <mesh
                ref={meshRef}
                position={position}
                scale={planet.model?.scale || 1}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={planet.color}
                    map={texture}
                    emissive={isSelected || hovered ? "#ffffff" : undefined}
                    emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
                />

                {tooltipVisible && !isSelected && (
                    <Html distanceFactor={15}>
                        <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                            {planet.name}
                        </div>
                    </Html>
                )}
            </mesh>

            {/* Saturn's rings */}
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