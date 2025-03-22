"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanetData, planets } from '../data/planets';
import { fetchNASAImages, fetchWikipediaInfo } from '../services/api';

type CelestialContextType = {
    celestialObjects: PlanetData[];
    selectedObject: PlanetData | null;
    loading: boolean;
    nasaImages: any[];
    wikipediaInfo: any;
    selectObject: (id: string) => void;
    isSelected: (id: string) => boolean;
};

const CelestialContext = createContext<CelestialContextType | undefined>(undefined);

export const CelestialProvider = ({ children }: { children: ReactNode }) => {
    const [celestialObjects] = useState<PlanetData[]>(planets);
    const [selectedObject, setSelectedObject] = useState<PlanetData | null>(null);
    const [loading, setLoading] = useState(false);
    const [nasaImages, setNasaImages] = useState<any[]>([]);
    const [wikipediaInfo, setWikipediaInfo] = useState<any>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchObjectData = async (object: PlanetData) => {
        if (!object) return;

        setLoading(true);

        try {
            const [imagesData, wikiData] = await Promise.all([
                fetchNASAImages(object.name),

                fetchWikipediaInfo(
                    object.id === 'sun' ? 'Sun (star)' : `${object.name} planet`
                )
            ]);

            setNasaImages(imagesData);
            setWikipediaInfo(wikiData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setNasaImages([]);
            setWikipediaInfo({
                title: object.name,
                extract: "Error loading information. Please try again.",
                url: `https://en.wikipedia.org/wiki/Special:Search?search=${object.name}`
            });
        } finally {
            setLoading(false);
        }
    };

    const selectObject = (id: string) => {
        const object = celestialObjects.find(obj => obj.id === id) || null;
        setSelectedObject(object);

        if (object) {
            fetchObjectData(object);
        }
    };

    const isSelected = (id: string) => {
        return selectedObject?.id === id;
    };

    useEffect(() => {
        if (isInitialLoad) {
            const sunObject = celestialObjects.find(obj => obj.id === 'sun') || null;
            setSelectedObject(sunObject);

            if (sunObject) {
                fetchObjectData(sunObject);
            }

            setIsInitialLoad(false);
        }
    }, [celestialObjects, isInitialLoad]);

    return (
        <CelestialContext.Provider
            value={{
                celestialObjects,
                selectedObject,
                loading,
                nasaImages,
                wikipediaInfo,
                selectObject,
                isSelected
            }}
        >
            {children}
        </CelestialContext.Provider>
    );
};

export const useCelestial = () => {
    const context = useContext(CelestialContext);
    if (context === undefined) {
        throw new Error('useCelestial must be used within a CelestialProvider');
    }
    return context;
}; 