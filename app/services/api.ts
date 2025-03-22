import axios from "axios";

export const fetchNASAImages = async (query: string, count: number = 5) => {
  try {
    // Encode the query properly for URL
    const encodedQuery = encodeURIComponent(query);

    const response = await axios.get(
      `https://images-api.nasa.gov/search?q=${encodedQuery}&media_type=image`,
      { timeout: 10000 } // Add timeout to prevent hanging requests
    );

    if (
      response.data &&
      response.data.collection &&
      response.data.collection.items &&
      response.data.collection.items.length > 0
    ) {
      const items = response.data.collection.items.slice(0, count);
      return items.map((item: any) => ({
        title: item.data[0].title || "NASA Image",
        description: item.data[0].description || "",
        date: item.data[0].date_created || "",
        url: item.links && item.links[0] ? item.links[0].href : null,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching NASA images:", error);
    return [];
  }
};

export const fetchWikipediaInfo = async (query: string) => {
  try {
    // Encode the query properly for URL
    const encodedQuery = encodeURIComponent(query);

    const searchResponse = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`,
      { timeout: 8000 } // Add timeout to prevent hanging requests
    );

    if (
      searchResponse.data &&
      searchResponse.data.query &&
      searchResponse.data.query.search &&
      searchResponse.data.query.search.length > 0
    ) {
      const pageId = searchResponse.data.query.search[0].pageid;

      const extractResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`,
        { timeout: 8000 }
      );

      if (
        extractResponse.data &&
        extractResponse.data.query &&
        extractResponse.data.query.pages &&
        extractResponse.data.query.pages[pageId]
      ) {
        const page = extractResponse.data.query.pages[pageId];
        return {
          title: page.title || query,
          extract: page.extract || "No information available.",
          url: `https://en.wikipedia.org/?curid=${pageId}`,
        };
      }
    }

    // Return fallback information if nothing found
    return {
      title: query,
      extract: "No Wikipedia information available for this celestial object.",
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`,
    };
  } catch (error) {
    console.error("Error fetching Wikipedia info:", error);
    // Return fallback information on error
    return {
      title: query,
      extract: "Could not retrieve Wikipedia information at this time.",
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
        query
      )}`,
    };
  }
};
