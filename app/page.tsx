"use client";

import { PlanetDataChart } from "./components/graphs/PlanetDataChart";
import { AreaChart } from "./components/graphs/AreaChart";
import { SolarSystem } from "./components/three/SolarSystem";
import { PlanetDetails } from "./components/ui/PlanetDetails";
import { PlanetList } from "./components/ui/PlanetList";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Solar System Explorer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SolarSystem />
        </div>

        <div className="space-y-6">
          <PlanetList />
          <PlanetDetails />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <PlanetDataChart />
        <AreaChart />
      </div>
    </div>
  );
}; 