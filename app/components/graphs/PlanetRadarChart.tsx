"use client"

import * as React from "react"
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { useCelestial } from "@/app/store/celestial-store"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface NormalizedPlanetData {
    attribute: string;
    value: number;
    fullMark: number;
}

const chartConfig = {
    radar: {
        label: "Planetary Attributes",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function PlanetRadarChart() {
    const { selectedObject } = useCelestial();
    const [radarData, setRadarData] = React.useState<NormalizedPlanetData[]>([]);

    React.useEffect(() => {
        if (selectedObject) {
            // Normalize planet attributes on a scale of 0-100
            const normalizeAttribute = (value: number, max: number): number => {
                return Math.min(100, Math.round((value / max) * 100));
            };

            // Calculate normalized attributes
            const newRadarData: NormalizedPlanetData[] = [
                {
                    attribute: "Size",
                    value: normalizeAttribute(selectedObject.diameter, 150000), // Jupiter is ~143,000km
                    fullMark: 100
                },
                {
                    attribute: "Distance",
                    value: 100 - normalizeAttribute(selectedObject.distanceFromSun, 4500), // Neptune is ~4,500 million km
                    fullMark: 100
                },
                {
                    attribute: "Orbit Period",
                    value: 100 - normalizeAttribute(selectedObject.orbitalPeriod, 60000), // Neptune is ~60,000 days
                    fullMark: 100
                },
                {
                    attribute: "Rotation",
                    value: normalizeAttribute(24, Math.abs(selectedObject.rotationPeriod)), // Earth is 24 hours
                    fullMark: 100
                },
                {
                    attribute: "Moons",
                    value: normalizeAttribute(selectedObject.moons, 82), // Saturn has ~82 moons
                    fullMark: 100
                }
            ];

            setRadarData(newRadarData);
        }
    }, [selectedObject]);

    if (!selectedObject) {
        return (
            <Card className="h-full">
                <CardHeader className="py-2">
                    <CardTitle className="text-sm sm:text-base">Planet Profile</CardTitle>
                    <CardDescription className="text-xs">Select a planet to view its attribute profile</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[220px]">
                    <p className="text-muted-foreground text-xs">Select a celestial object to view its profile</p>
                </CardContent>
            </Card>
        );
    }

    if (radarData.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader className="py-2">
                    <CardTitle className="text-sm sm:text-base">Planet Profile: {selectedObject.name}</CardTitle>
                    <CardDescription className="text-xs">Loading attribute data...</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                    <div className="space-y-4 h-full flex items-center justify-center">
                        <Skeleton className="h-[180px] w-[180px] rounded-full mx-auto" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="py-2">
                <CardTitle className="text-sm sm:text-base">Planet Profile: {selectedObject.name}</CardTitle>
                <CardDescription className="text-xs">Normalized attribute comparison</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
                <ChartContainer config={chartConfig} className="h-[220px] max-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Radar
                                name={selectedObject.name}
                                dataKey="value"
                                stroke="hsl(var(--chart-3))"
                                fill="hsl(var(--chart-3))"
                                fillOpacity={0.5}
                            />
                        </RechartsRadarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
} 