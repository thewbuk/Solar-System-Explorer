"use client";

import { PlanetDataChart } from "./components/graphs/PlanetDataChart";
import { AreaChart } from "./components/graphs/AreaChart";
import { PlanetRadarChart } from "./components/graphs/PlanetRadarChart";
import { MissionsTimeline } from "./components/graphs/MissionsTimeline";
import { TemperatureComparison } from "./components/graphs/TemperatureComparison";
import { SolarSystem } from "./components/three/SolarSystem";
import { PlanetDetails } from "./components/ui/PlanetDetails";
import { PlanetList } from "./components/ui/PlanetList";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-3xl">Solar System Explorer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SolarSystem />
        </div>

        <div className="space-y-5">
          <PlanetList />
          <PlanetDetails />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Solar System Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div>
          <PlanetDataChart />
        </div>
        <div>
          <AreaChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <PlanetRadarChart />
        </div>
        <div>
          <MissionsTimeline />
        </div>
        <div>
          <TemperatureComparison />
        </div>
      </div>
    </div>
  );
}; 