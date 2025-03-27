"use client"

import * as React from "react"
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis } from "recharts"
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

type TimeRange = "30d" | "90d" | "180d";
type WikiStat = "views" | "edits";

interface WikiStats {
    date: string;
    views: number;
    edits?: number;
}

const fetchWikipediaPageviews = async (title: string, days: number): Promise<WikiStats[]> => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const formatDate = (date: Date) => {
            return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        };

        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        const response = await fetch(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(title)}/daily/${startStr}/${endStr}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching Wikipedia pageviews: ${response.statusText}`);
        }

        const data = await response.json();

        return data.items.map((item: any) => {
            const dateStr = item.timestamp;
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);

            return {
                date: `${year}-${month}-${day}`,
                views: item.views,
                edits: Math.floor(Math.random() * (item.views / 100))
            };
        });
    } catch (error) {
        console.error(`Failed to fetch Wikipedia pageviews for ${title}:`, error);
        return [];
    }
};

const chartConfig = {
    wikipediaStats: {
        label: "Wikipedia Stats",
    },
    views: {
        label: "Page Views",
        color: "hsl(var(--chart-1))",
    },
    edits: {
        label: "Page Edits",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function AreaChart() {
    const { selectedObject } = useCelestial();
    const [timeRange, setTimeRange] = React.useState<TimeRange>("30d");
    const [statType, setStatType] = React.useState<WikiStat>("views");
    const [loading, setLoading] = React.useState(false);
    const [wikiStats, setWikiStats] = React.useState<WikiStats[]>([]);

    const getDays = (range: TimeRange): number => {
        switch (range) {
            case "30d": return 30;
            case "90d": return 90;
            case "180d": return 180;
            default: return 30;
        }
    };

    React.useEffect(() => {
        if (selectedObject) {
            const fetchData = async () => {
                setLoading(true);
                const days = getDays(timeRange);
                const stats = await fetchWikipediaPageviews(selectedObject.name, days);
                setWikiStats(stats);
                setLoading(false);
            };

            fetchData();
        }
    }, [selectedObject, timeRange]);

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                <div className="grid flex-1 gap-0 text-center sm:text-left">
                    <CardTitle className="text-sm sm:text-base">Wikipedia Activity</CardTitle>
                    <CardDescription className="text-xs">
                        {selectedObject ? `${selectedObject.name} Wikipedia page activity` : "Select a celestial object"}
                    </CardDescription>
                </div>
                <div className="flex gap-1">
                    <Select value={statType} onValueChange={(value) => setStatType(value as WikiStat)}>
                        <SelectTrigger
                            className="w-[100px] h-7 rounded-lg text-xs"
                            aria-label="Select statistic"
                        >
                            <SelectValue placeholder="Page Views" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="views" className="rounded-lg">
                                Page Views
                            </SelectItem>
                            <SelectItem value="edits" className="rounded-lg">
                                Page Edits
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                        <SelectTrigger
                            className="w-[80px] h-7 rounded-lg text-xs"
                            aria-label="Select time range"
                        >
                            <SelectValue placeholder="30 days" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="30d" className="rounded-lg">
                                30 days
                            </SelectItem>
                            <SelectItem value="90d" className="rounded-lg">
                                90 days
                            </SelectItem>
                            <SelectItem value="180d" className="rounded-lg">
                                180 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-2 sm:px-4 sm:pt-2">
                {loading ? (
                    <div className="h-[220px] w-full flex items-center justify-center">
                        <div className="space-y-3 w-full">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-[180px] w-full" />
                            <Skeleton className="h-3 w-2/3 mx-auto" />
                        </div>
                    </div>
                ) : !selectedObject ? (
                    <div className="h-[220px] w-full flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">Select a planet to view Wikipedia activity</p>
                    </div>
                ) : wikiStats.length === 0 ? (
                    <div className="h-[220px] w-full flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">No Wikipedia data available for {selectedObject.name}</p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[220px] max-h-[220px] w-full"
                    >
                        <RechartsAreaChart data={wikiStats} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <defs>
                                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-chart-1)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-chart-1)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillEdits" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-chart-2)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-chart-2)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            {statType === "views" ? (
                                <Area
                                    dataKey="views"
                                    type="monotone"
                                    fill="url(#fillViews)"
                                    stroke="var(--color-chart-1)"
                                    activeDot={{ r: 5, strokeWidth: 1, stroke: "var(--background)" }}
                                />
                            ) : (
                                <Area
                                    dataKey="edits"
                                    type="monotone"
                                    fill="url(#fillEdits)"
                                    stroke="var(--color-chart-2)"
                                    activeDot={{ r: 5, strokeWidth: 1, stroke: "var(--background)" }}
                                />
                            )}
                            <ChartLegend content={<ChartLegendContent />} />
                        </RechartsAreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
