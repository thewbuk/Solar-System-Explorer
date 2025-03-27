"use client";

import { useCelestial } from '@/app/store/celestial-store';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import Image from 'next/image';
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Skeleton } from "../../../components/ui/skeleton";

export const PlanetDetails = () => {
    const { selectedObject, loading, nasaImages, wikipediaInfo } = useCelestial();

    if (!selectedObject) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p>Select a celestial object to view details</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[500px]">
            <CardHeader className="relative">
                <CardTitle>{selectedObject.name}</CardTitle>
                {loading && (
                    <div className="absolute right-6 top-6">
                        <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="images">NASA Images</TabsTrigger>
                        <TabsTrigger value="wiki">Wikipedia</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="p-4">
                        <ScrollArea className="h-[350px] pr-4">
                            <div className="space-y-4">
                                <p>{selectedObject.description}</p>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Diameter</h4>
                                        <p>{selectedObject.diameter.toLocaleString()} km</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Distance from Sun</h4>
                                        <p>{selectedObject.distanceFromSun.toLocaleString()} million km</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Orbital Period</h4>
                                        <p>{selectedObject.orbitalPeriod.toLocaleString()} days</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Rotation Period</h4>
                                        <p>{selectedObject.rotationPeriod.toLocaleString()} hours</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Moons</h4>
                                        <p>{selectedObject.moons}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="images" className="p-4">
                        <ScrollArea className="h-[350px] pr-4">
                            {loading ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="space-y-2">
                                            <Skeleton className="relative aspect-video w-full h-[150px]" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : nasaImages.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {nasaImages.map((image, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="relative aspect-video rounded-md overflow-hidden">
                                                {image.url && (
                                                    <Image
                                                        src={image.url}
                                                        alt={image.title}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium">{image.title}</p>
                                            <p className="text-xs text-muted-foreground">{image.date}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No NASA images available for {selectedObject.name}</p>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="wiki" className="p-4">
                        <ScrollArea className="h-[350px] pr-4">
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-2/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ) : wikipediaInfo ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{wikipediaInfo.title}</h3>
                                    <p>{wikipediaInfo.extract}</p>
                                    <a
                                        href={wikipediaInfo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Read more on Wikipedia
                                    </a>
                                </div>
                            ) : (
                                <p>No Wikipedia information available for {selectedObject.name}</p>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}; 