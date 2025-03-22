# Solar System Explorer

An interactive web application that allows users to explore the solar system in 3D and access information about celestial objects.

## Features

- Interactive 3D Solar System visualization using Three.js
- Detailed information about planets and the Sun
- Integration with NASA Image API and Wikipedia API
- Responsive design for various screen sizes
- Bidirectional synchronization between 3D view and UI

## Technologies Used

- Next.js
- React
- Three.js with React Three Fiber
- shadcn/ui components
- TypeScript
- Tailwind CSS
- Axios for API requests

## How to Run

1. Clone the repository:

   ```
   git clone <repository-url>
   cd Solar-System-Explorer
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Run the development server:

   ```
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js application
  - `/components` - React components
    - `/three` - Three.js related components
    - `/ui` - UI components
  - `/data` - Static data and types
  - `/services` - API services
  - `/store` - State management

## Implementation Details

The application features bidirectional synchronization between the 3D view and the React UI:

- When a user selects a celestial object within the 3D view, the React UI updates to reflect this selection
- When a user selects a celestial object from the list in the React UI, the 3D view visually indicates this selection

The application fetches additional information about celestial objects from:

- NASA Image and Video Library API
- Wikipedia API

## Future Improvements

- Add animations for planet orbits
- Implement more detailed planet models with rings and moons
- Add search functionality
- Include more detailed astronomical data
- Optimize 3D performance for mobile devices
