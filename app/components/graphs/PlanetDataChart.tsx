"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const basePlanetaryData = [
    { name: "Mercury", diameter: 4879, distanceFromSun: 57.9, orbitalPeriod: 88, moons: 0 },
    { name: "Venus", diameter: 12104, distanceFromSun: 108.2, orbitalPeriod: 224.7, moons: 0 },
    { name: "Earth", diameter: 12756, distanceFromSun: 149.6, orbitalPeriod: 365.2, moons: 1 },
    { name: "Mars", diameter: 6792, distanceFromSun: 227.9, orbitalPeriod: 687, moons: 2 },
    { name: "Jupiter", diameter: 142984, distanceFromSun: 778.6, orbitalPeriod: 4331, moons: 79 },
    { name: "Saturn", diameter: 120536, distanceFromSun: 1433.5, orbitalPeriod: 10747, moons: 82 },
    { name: "Uranus", diameter: 51118, distanceFromSun: 2872.5, orbitalPeriod: 30589, moons: 27 },
    { name: "Neptune", diameter: 49528, distanceFromSun: 4495.1, orbitalPeriod: 59800, moons: 14 },
]

type DataType = "diameter" | "distanceFromSun" | "orbitalPeriod" | "moons";

const fetchWikipediaData = async (planetName: string) => {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${planetName}`
        )

        if (!response.ok) {
            throw new Error(`Error fetching Wikipedia data: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error(`Failed to fetch Wikipedia data for ${planetName}:`, error)
        return null
    }
}

const chartConfig = {
    planets: {
        label: "Planets",
    },
    diameter: {
        label: "Diameter (km)",
        color: "hsl(var(--chart-1))",
    },
    distanceFromSun: {
        label: "Distance (million km)",
        color: "hsl(var(--chart-2))",
    },
    orbitalPeriod: {
        label: "Orbital Period (days)",
        color: "hsl(var(--chart-3))",
    },
    moons: {
        label: "Number of Moons",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

interface NormalizedData {
    name: string;
    value: number;
    normalized: number;
}

interface HighlightedData extends NormalizedData {
    highlighted?: number;
}

export function PlanetDataChart() {
    const { selectedObject } = useCelestial()
    const [dataType, setDataType] = React.useState<DataType>("diameter")
    const [planetaryData, setPlanetaryData] = React.useState(basePlanetaryData)
    const [loading, setLoading] = React.useState(false)
    const [wikiData, setWikiData] = React.useState<Record<string, any>>({})

    React.useEffect(() => {
        if (selectedObject && selectedObject.name) {
            const fetchData = async () => {
                setLoading(true)

                if (!wikiData[selectedObject.name]) {
                    const data = await fetchWikipediaData(selectedObject.name)
                    if (data) {
                        setWikiData(prev => ({
                            ...prev,
                            [selectedObject.name]: data
                        }))
                    }
                }

                setLoading(false)
            }

            fetchData()
        }
    }, [selectedObject, wikiData])

    const normalizedData = React.useMemo<NormalizedData[]>(() => {
        if (dataType === "diameter") {
            const maxDiameter = Math.max(...planetaryData.map(p => p.diameter))
            return planetaryData.map(p => ({
                name: p.name,
                value: p.diameter,
                normalized: (p.diameter / maxDiameter) * 500
            }))
        } else if (dataType === "distanceFromSun") {
            const maxDistance = Math.max(...planetaryData.map(p => p.distanceFromSun))
            return planetaryData.map(p => ({
                name: p.name,
                value: p.distanceFromSun,
                normalized: (p.distanceFromSun / maxDistance) * 500
            }))
        } else if (dataType === "orbitalPeriod") {
            const maxPeriod = Math.max(...planetaryData.map(p => p.orbitalPeriod))
            return planetaryData.map(p => ({
                name: p.name,
                value: p.orbitalPeriod,
                normalized: (p.orbitalPeriod / maxPeriod) * 500
            }))
        } else {
            return planetaryData.map(p => ({
                name: p.name,
                value: p.moons,
                normalized: p.moons * 10
            }))
        }
    }, [planetaryData, dataType])

    const highlightedData = React.useMemo<HighlightedData[]>(() => {
        if (!selectedObject) return normalizedData

        return normalizedData.map(item => ({
            ...item,
            highlighted: item.name.toLowerCase() === selectedObject.name.toLowerCase() ? item.normalized : 0
        }))
    }, [normalizedData, selectedObject])

    const selectedWikiExtract = React.useMemo(() => {
        if (!selectedObject || !wikiData[selectedObject.name]) return null
        return wikiData[selectedObject.name].extract
    }, [selectedObject, wikiData])

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Solar System - Planetary Data</CardTitle>
                    <CardDescription>
                        Comparing key attributes of planets in our solar system
                    </CardDescription>
                </div>
                <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
                    <SelectTrigger
                        className="w-[180px] rounded-lg sm:ml-auto"
                        aria-label="Select data type"
                    >
                        <SelectValue placeholder="Diameter" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="diameter" className="rounded-lg">
                            Diameter (km)
                        </SelectItem>
                        <SelectItem value="distanceFromSun" className="rounded-lg">
                            Distance from Sun
                        </SelectItem>
                        <SelectItem value="orbitalPeriod" className="rounded-lg">
                            Orbital Period
                        </SelectItem>
                        <SelectItem value="moons" className="rounded-lg">
                            Number of Moons
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[350px] w-full"
                >
                    <AreaChart data={highlightedData}>
                        <defs>
                            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={`var(--color-${dataType})`}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={`var(--color-${dataType})`}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillHighlighted" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="hsl(var(--primary))"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(var(--primary))"
                                    stopOpacity={0.3}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    formatter={(value, name) => {
                                        if (name === "normalized") return [highlightedData.find(d => d.normalized === value)?.value, chartConfig[dataType as keyof typeof chartConfig].label]
                                        if (name === "highlighted") return [highlightedData.find(d => d.highlighted === value)?.value, chartConfig[dataType as keyof typeof chartConfig].label]
                                        return [value, name]
                                    }}
                                />
                            }
                        />
                        <Area
                            dataKey="normalized"
                            type="monotone"
                            fill="url(#fillValue)"
                            stroke={`var(--color-${dataType})`}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }}
                        />
                        {selectedObject && (
                            <Area
                                dataKey="highlighted"
                                type="monotone"
                                fill="url(#fillHighlighted)"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 8, strokeWidth: 2, stroke: "var(--background)" }}
                            />
                        )}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>

                {selectedObject && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">{selectedObject.name} - Wikipedia Info</h3>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : selectedWikiExtract ? (
                            <p className="text-sm text-muted-foreground">{selectedWikiExtract}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">No Wikipedia information available.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 