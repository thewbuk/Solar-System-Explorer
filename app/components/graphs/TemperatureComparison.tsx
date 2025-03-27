"use client"

import * as React from "react"
import { Bar, BarChart as RechartsBarChart, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface PlanetTemperature {
    name: string;
    min: number;
    max: number;
    avg: number;
    avgC: number;
    avgF: number;
    color: string;
}

const planetTemperatures: PlanetTemperature[] = [
    {
        name: "Mercury",
        min: -173,
        max: 427,
        avg: 167,
        avgC: 167,
        avgF: 332,
        color: "hsl(35, 91%, 64%)"
    },
    {
        name: "Venus",
        min: 462,
        max: 462,
        avg: 462,
        avgC: 462,
        avgF: 864,
        color: "hsl(40, 96%, 65%)"
    },
    {
        name: "Earth",
        min: -88,
        max: 58,
        avg: 15,
        avgC: 15,
        avgF: 59,
        color: "hsl(195, 83%, 47%)"
    },
    {
        name: "Mars",
        min: -143,
        max: 35,
        avg: -65,
        avgC: -65,
        avgF: -85,
        color: "hsl(6, 93%, 48%)"
    },
    {
        name: "Jupiter",
        min: -163,
        max: -163,
        avg: -110,
        avgC: -110,
        avgF: -166,
        color: "hsl(19, 95%, 62%)"
    },
    {
        name: "Saturn",
        min: -189,
        max: -189,
        avg: -140,
        avgC: -140,
        avgF: -220,
        color: "hsl(48, 95%, 64%)"
    },
    {
        name: "Uranus",
        min: -224,
        max: -224,
        avg: -195,
        avgC: -195,
        avgF: -319,
        color: "hsl(182, 95%, 40%)"
    },
    {
        name: "Neptune",
        min: -218,
        max: -218,
        avg: -200,
        avgC: -200,
        avgF: -328,
        color: "hsl(210, 85%, 45%)"
    }
];

type TempViewType = "min-max" | "comparison";
type TempUnit = "C" | "F";

const chartConfig = {
    temperature: {
        label: "Temperature",
    },
    min: {
        label: "Minimum (°C)",
        color: "hsl(var(--chart-1))",
    },
    max: {
        label: "Maximum (°C)",
        color: "hsl(var(--chart-4))",
    },
    avg: {
        label: "Average (°C)",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function TemperatureComparison() {
    const { selectedObject } = useCelestial();
    const [viewType, setViewType] = React.useState<TempViewType>("comparison");
    const [tempUnit, setTempUnit] = React.useState<TempUnit>("C");

    const getComparisonData = () => {
        const unitField = tempUnit === "C" ? "avgC" : "avgF";
        const unitSymbol = tempUnit === "C" ? "°C" : "°F";

        return planetTemperatures.map(planet => {
            return {
                ...planet,
                name: planet.name,
                value: planet[unitField],
                label: `${planet[unitField]}${unitSymbol}`,
                isSelected: selectedObject ? planet.name === selectedObject.name : false
            };
        });
    };

    const getRangeData = () => {
        const minField = tempUnit === "C" ? "min" : (temp: PlanetTemperature) => (temp.min * 9 / 5) + 32;
        const maxField = tempUnit === "C" ? "max" : (temp: PlanetTemperature) => (temp.max * 9 / 5) + 32;
        const unitSymbol = tempUnit === "C" ? "°C" : "°F";

        return planetTemperatures.map(planet => {
            const minTemp = typeof minField === "function" ? minField(planet) : planet[minField];
            const maxTemp = typeof maxField === "function" ? maxField(planet) : planet[maxField];

            return {
                name: planet.name,
                min: minTemp,
                max: maxTemp,
                minLabel: `${Math.round(minTemp)}${unitSymbol}`,
                maxLabel: `${Math.round(maxTemp)}${unitSymbol}`,
                color: planet.color,
                isSelected: selectedObject ? planet.name === selectedObject.name : false
            };
        });
    };

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                <div className="grid flex-1 gap-0 text-center sm:text-left">
                    <CardTitle className="text-sm sm:text-base">Planetary Temperatures</CardTitle>
                    <CardDescription className="text-xs">
                        Temperature comparison
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Select value={tempUnit} onValueChange={(value) => setTempUnit(value as TempUnit)}>
                        <SelectTrigger
                            className="w-[60px] h-7 rounded-lg text-xs"
                            aria-label="Select temperature unit"
                        >
                            <SelectValue placeholder="°C" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="C" className="rounded-lg">
                                °C
                            </SelectItem>
                            <SelectItem value="F" className="rounded-lg">
                                °F
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pt-2 px-2 overflow-hidden">
                <Tabs value={viewType} onValueChange={(v) => setViewType(v as TempViewType)}>
                    <TabsList className="grid w-full grid-cols-2 mb-2 h-7">
                        <TabsTrigger className="text-xs" value="comparison">Temperature Comparison</TabsTrigger>
                        <TabsTrigger className="text-xs" value="min-max">Temperature Ranges</TabsTrigger>
                    </TabsList>

                    <TabsContent value="comparison" className="pt-0">
                        <ChartContainer config={chartConfig} className="h-[220px] max-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                    data={getComparisonData()}
                                    layout="vertical"
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <XAxis type="number" domain={['dataMin - 20', 'dataMax + 20']} />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                        formatter={(value) => [`${value} °${tempUnit}`, "Temperature"]}
                                    />
                                    <ReferenceLine x={0} stroke="#888" />
                                    <Bar dataKey="value" name={`Temperature (°${tempUnit})`}>
                                        {getComparisonData().map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                fillOpacity={entry.isSelected ? 1 : 0.7}
                                                stroke={entry.isSelected ? "#fff" : undefined}
                                                strokeWidth={entry.isSelected ? 2 : 0}
                                            />
                                        ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="min-max" className="pt-0">
                        <ChartContainer config={chartConfig} className="h-[220px] max-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                    data={getRangeData()}
                                    layout="vertical"
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                        formatter={(value, name) => {
                                            return [`${value} °${tempUnit}`, name === "min" ? "Minimum" : "Maximum"];
                                        }}
                                    />
                                    <Bar dataKey="min" name={`Min (°${tempUnit})`} stackId="a" fill="hsl(var(--chart-1))">
                                        {getRangeData().map((entry, index) => (
                                            <Cell
                                                key={`min-${index}`}
                                                fill="hsl(210, 80%, 50%)"
                                                fillOpacity={entry.isSelected ? 1 : 0.7}
                                            />
                                        ))}
                                    </Bar>
                                    <Bar dataKey="max" name={`Max (°${tempUnit})`} stackId="a" fill="hsl(var(--chart-4))">
                                        {getRangeData().map((entry, index) => (
                                            <Cell
                                                key={`max-${index}`}
                                                fill="hsl(350, 80%, 50%)"
                                                fillOpacity={entry.isSelected ? 1 : 0.7}
                                            />
                                        ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
} 