"use client";

import { SolarSystem } from './three/SolarSystem';
import { PlanetList } from './ui/PlanetList';
import { PlanetDetails } from './ui/PlanetDetails';

export const AppLayout = () => {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Solar System Explorer</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SolarSystem />
                </div>

                <div className="space-y-6">
                    <PlanetList />
                    <PlanetDetails />
                </div>
            </div>
        </div>
    );
}; 