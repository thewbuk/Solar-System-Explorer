"use client";

import { create } from 'zustand';
import { PlanetData, planets } from '../data/planets';
import { fetchNASAImages, fetchWikipediaInfo } from '../services/api';

interface CelestialStore {
    celestialObjects: PlanetData[];
    selectedObject: PlanetData | null;
    loading: boolean;
    nasaImages: any[];
    wikipediaInfo: any;
    selectObject: (id: string) => Promise<void>;
    isSelected: (id: string) => boolean;
}

export const useCelestial = create<CelestialStore>((set, get) => ({
    celestialObjects: planets,
    selectedObject: planets.find(p => p.id === 'sun') || null,
    loading: false,
    nasaImages: [],
    wikipediaInfo: null,

    selectObject: async (id: string) => {
        const object = get().celestialObjects.find(obj => obj.id === id);
        if (!object) return;

        set({ selectedObject: object, loading: true });

        try {
            const [imagesData, wikiData] = await Promise.all([
                fetchNASAImages(object.name),
                fetchWikipediaInfo(object.id === 'sun' ? 'Sun (star)' : `${object.name} planet`)
            ]);

            set({
                nasaImages: imagesData,
                wikipediaInfo: wikiData,
                loading: false
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            set({
                nasaImages: [],
                wikipediaInfo: {
                    title: object.name,
                    extract: "Error loading information. Please try again.",
                    url: `https://en.wikipedia.org/wiki/Special:Search?search=${object.name}`
                },
                loading: false
            });
        }
    },

    isSelected: (id: string) => get().selectedObject?.id === id
}));
