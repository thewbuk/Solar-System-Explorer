"use client";

import { useCelestial } from '@/app/store/celestial-store';
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";

export const PlanetList = () => {
    const { celestialObjects, selectObject, isSelected } = useCelestial();

    return (
        <Card className="h-[300px] overflow-y-auto">
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Solar System Objects</h3>
                <Separator className="mb-4" />
                <div className="space-y-2">
                    {celestialObjects.map((object) => (
                        <div
                            key={object.id}
                            className={`p-2 rounded-md cursor-pointer flex items-center justify-between transition-colors 
                                ${isSelected(object.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary'}`}
                            onClick={() => selectObject(object.id)}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: object.color }}
                                />
                                <span>{object.name}</span>
                            </div>
                            {isSelected(object.id) && (
                                <Badge variant="outline" className="bg-primary text-primary-foreground">
                                    Selected
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 