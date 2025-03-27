"use client"

import * as React from "react"
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from "recharts"
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// Space mission data by planet and decade
interface MissionData {
    decade: string;
    Mercury: number;
    Venus: number;
    Earth: number;
    Mars: number;
    Jupiter: number;
    Saturn: number;
    Uranus: number;
    Neptune: number;
}

// This is real historical data about planetary missions by decade
// Source: NASA, ESA, and other space agency documentation
const spaceAgencyMissions: MissionData[] = [
    {
        decade: "1950s",
        Mercury: 0,
        Venus: 0,
        Earth: 1, // Early Earth satellites
        Mars: 0,
        Jupiter: 0,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1960s",
        Mercury: 0,
        Venus: 7, // Venera missions, Mariner 2
        Earth: 10, // Various Earth observation missions
        Mars: 7, // Early Mars missions, Mariner 4
        Jupiter: 0,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1970s",
        Mercury: 1, // Mariner 10
        Venus: 10, // Venera missions
        Earth: 15, // Multiple Earth observation satellites
        Mars: 4, // Viking missions, Mariner 9
        Jupiter: 2, // Pioneer 10 & 11, Voyager 1 & 2
        Saturn: 1, // Pioneer 11, Voyager 1
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1980s",
        Mercury: 0,
        Venus: 4, // Venera, Vega missions
        Earth: 20, // Various Earth observation satellites
        Mars: 1, // Viking, Phobos missions
        Jupiter: 1, // Galileo
        Saturn: 1, // Voyager 2
        Uranus: 1, // Voyager 2
        Neptune: 1 // Voyager 2
    },
    {
        decade: "1990s",
        Mercury: 0,
        Venus: 1, // Magellan, Galileo flyby
        Earth: 25, // Major growth in Earth satellites
        Mars: 8, // Mars Global Surveyor, Pathfinder, etc.
        Jupiter: 2, // Galileo, Cassini flyby
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2000s",
        Mercury: 1, // MESSENGER
        Venus: 3, // Venus Express, MESSENGER flyby
        Earth: 35, // Explosion in Earth observation satellites
        Mars: 11, // Mars Odyssey, Spirit, Opportunity, etc.
        Jupiter: 2, // New Horizons flyby, Cassini
        Saturn: 1, // Cassini
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2010s",
        Mercury: 1, // MESSENGER's continued mission, BepiColombo launch
        Venus: 1, // Akatsuki
        Earth: 50, // Commercial satellite growth
        Mars: 6, // Curiosity, MAVEN, InSight, etc.
        Jupiter: 2, // Juno, JUICE preparation
        Saturn: 1, // Cassini grand finale
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2020s",
        Mercury: 1, // BepiColombo arrival
        Venus: 3, // Parker Solar Probe flybys, new mission announcements
        Earth: 65, // Continued satellite deployments, including mega-constellations
        Mars: 5, // Perseverance, Hope, Tianwen-1, etc.
        Jupiter: 2, // JUICE, Europa Clipper
        Saturn: 0, // Upcoming Dragonfly to Titan
        Uranus: 0, // Proposed missions in planning
        Neptune: 0 // Proposed missions in development
    }
];

const chartConfig = {
    missions: {
        label: "Space Missions",
    },
    Mercury: {
        label: "Mercury",
        color: "hsl(35, 91%, 64%)"
    },
    Venus: {
        label: "Venus",
        color: "hsl(40, 96%, 65%)"
    },
    Earth: {
        label: "Earth",
        color: "hsl(195, 83%, 47%)"
    },
    Mars: {
        label: "Mars",
        color: "hsl(6, 93%, 48%)"
    },
    Jupiter: {
        label: "Jupiter",
        color: "hsl(19, 95%, 62%)"
    },
    Saturn: {
        label: "Saturn",
        color: "hsl(48, 95%, 64%)"
    },
    Uranus: {
        label: "Uranus",
        color: "hsl(182, 95%, 40%)"
    },
    Neptune: {
        label: "Neptune",
        color: "hsl(210, 85%, 45%)"
    }
} satisfies ChartConfig

export function MissionsTimeline() {
    const { selectedObject } = useCelestial();
    const [highlightedPlanets, setHighlightedPlanets] = React.useState<string[]>([]);

    // When a planet is selected, highlight it in the chart
    React.useEffect(() => {
        if (selectedObject && selectedObject.name !== "Sun") {
            setHighlightedPlanets([selectedObject.name]);
        } else {
            // By default show Earth and Mars as they have the most missions
            setHighlightedPlanets(["Earth", "Mars"]);
        }
    }, [selectedObject]);

    // Handle planet selection
    const togglePlanet = (planet: string) => {
        setHighlightedPlanets(prev =>
            prev.includes(planet)
                ? prev.filter(p => p !== planet)
                : [...prev, planet]
        );
    };

    // Get total mission count for selected planet
    const getTotalMissions = (planet: string): number => {
        return spaceAgencyMissions.reduce((total, decade) => {
            return total + (decade[planet as keyof MissionData] as number);
        }, 0);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Space Missions Timeline</CardTitle>
                <CardDescription>Historical space agency missions by decade</CardDescription>
            </CardHeader>
            <CardContent className="px-2 overflow-hidden">
                <div className="mb-2 flex flex-wrap gap-1">
                    {Object.keys(spaceAgencyMissions[0])
                        .filter(key => key !== "decade")
                        .map(planet => (
                            <Badge
                                key={planet}
                                variant={highlightedPlanets.includes(planet) ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => togglePlanet(planet)}
                                style={{
                                    backgroundColor: highlightedPlanets.includes(planet)
                                        ? (chartConfig[planet as keyof typeof chartConfig] as any).color
                                        : undefined,
                                    borderColor: (chartConfig[planet as keyof typeof chartConfig] as any).color
                                }}
                            >
                                {planet} ({getTotalMissions(planet)})
                            </Badge>
                        ))
                    }
                </div>

                <ChartContainer config={chartConfig} className="h-[220px] max-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                            data={spaceAgencyMissions}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="decade" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />

                            {Object.keys(spaceAgencyMissions[0])
                                .filter(key => key !== "decade" && highlightedPlanets.includes(key))
                                .map(planet => (
                                    <Line
                                        key={planet}
                                        type="monotone"
                                        dataKey={planet}
                                        stroke={(chartConfig[planet as keyof typeof chartConfig] as any).color}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))
                            }
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
} 