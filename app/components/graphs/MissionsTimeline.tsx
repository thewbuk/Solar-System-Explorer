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

const spaceAgencyMissions: MissionData[] = [
    {
        decade: "1950s",
        Mercury: 0,
        Venus: 0,
        Earth: 1,
        Mars: 0,
        Jupiter: 0,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1960s",
        Mercury: 0,
        Venus: 7,
        Earth: 10,
        Mars: 7,
        Jupiter: 0,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1970s",
        Mercury: 1,
        Venus: 10,
        Earth: 15,
        Mars: 4,
        Jupiter: 2,
        Saturn: 1,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "1980s",
        Mercury: 0,
        Venus: 4,
        Earth: 20,
        Mars: 1,
        Jupiter: 1,
        Saturn: 1,
        Uranus: 1,
        Neptune: 1
    },
    {
        decade: "1990s",
        Mercury: 0,
        Venus: 1,
        Earth: 25,
        Mars: 8,
        Jupiter: 2,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2000s",
        Mercury: 1,
        Venus: 3,
        Earth: 35,
        Mars: 11,
        Jupiter: 2,
        Saturn: 1,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2010s",
        Mercury: 1,
        Venus: 1,
        Earth: 50,
        Mars: 6,
        Jupiter: 2,
        Saturn: 1,
        Uranus: 0,
        Neptune: 0
    },
    {
        decade: "2020s",
        Mercury: 1,
        Venus: 3,
        Earth: 65,
        Mars: 5,
        Jupiter: 2,
        Saturn: 0,
        Uranus: 0,
        Neptune: 0
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

    React.useEffect(() => {
        if (selectedObject && selectedObject.name !== "Sun") {
            setHighlightedPlanets([selectedObject.name]);
        } else {
            setHighlightedPlanets(["Earth", "Mars"]);
        }
    }, [selectedObject]);

    const togglePlanet = (planet: string) => {
        setHighlightedPlanets(prev =>
            prev.includes(planet)
                ? prev.filter(p => p !== planet)
                : [...prev, planet]
        );
    };

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