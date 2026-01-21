// Satellite data structure
export interface Satellite {
  id: string;
  name: string;
  type: string;
  launchDate: string;
  orbitPeriod: number; // in minutes
  orbitInclination: number; // in degrees
  altitude: number; // in km
}

// Mock satellite database
export const SATELLITES: Satellite[] = [
  {
    id: 'iss',
    name: 'ISS (International Space Station)',
    type: 'Space Station',
    launchDate: 'November 20, 1998',
    orbitPeriod: 93,
    orbitInclination: 51.6,
    altitude: 408
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    type: 'Space Telescope',
    launchDate: 'April 24, 1990',
    orbitPeriod: 95,
    orbitInclination: 28.5,
    altitude: 540
  },
  {
    id: 'starlink-1',
    name: 'Starlink-1020',
    type: 'Communications',
    launchDate: 'May 24, 2019',
    orbitPeriod: 95,
    orbitInclination: 53.0,
    altitude: 550
  },
  {
    id: 'starlink-2',
    name: 'Starlink-2145',
    type: 'Communications',
    launchDate: 'January 6, 2020',
    orbitPeriod: 95,
    orbitInclination: 53.0,
    altitude: 550
  },
  {
    id: 'gps-1',
    name: 'GPS IIIA-3',
    type: 'Navigation',
    launchDate: 'June 30, 2020',
    orbitPeriod: 718,
    orbitInclination: 55.0,
    altitude: 20200
  },
  {
    id: 'gps-2',
    name: 'GPS IIIA-4',
    type: 'Navigation',
    launchDate: 'November 5, 2020',
    orbitPeriod: 718,
    orbitInclination: 55.0,
    altitude: 20200
  },
  {
    id: 'noaa-20',
    name: 'NOAA-20',
    type: 'Weather',
    launchDate: 'November 18, 2017',
    orbitPeriod: 101,
    orbitInclination: 98.7,
    altitude: 824
  },
  {
    id: 'sentinel-6',
    name: 'Sentinel-6 Michael Freilich',
    type: 'Earth Observation',
    launchDate: 'November 21, 2020',
    orbitPeriod: 112,
    orbitInclination: 66.0,
    altitude: 1336
  },
  {
    id: 'landsat-9',
    name: 'Landsat 9',
    type: 'Earth Observation',
    launchDate: 'September 27, 2021',
    orbitPeriod: 99,
    orbitInclination: 98.2,
    altitude: 705
  },
  {
    id: 'tiangong',
    name: 'Tiangong Space Station',
    type: 'Space Station',
    launchDate: 'April 29, 2021',
    orbitPeriod: 90,
    orbitInclination: 41.5,
    altitude: 390
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    type: 'Space Telescope',
    launchDate: 'December 25, 2021',
    orbitPeriod: 8760, // L2 orbit (yearly)
    orbitInclination: 0,
    altitude: 1500000 // L2 point
  },
  {
    id: 'goes-18',
    name: 'GOES-18',
    type: 'Weather',
    launchDate: 'March 1, 2022',
    orbitPeriod: 1436,
    orbitInclination: 0.1,
    altitude: 35786
  }
];

export interface SatellitePosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

// Calculate satellite position based on time
export function getSatellitePosition(satellite: Satellite, date: Date): SatellitePosition {
  const epochTime = new Date('2024-01-01T00:00:00Z').getTime();
  const currentTime = date.getTime();
  const elapsedMinutes = (currentTime - epochTime) / 60000;
  
  // Calculate position based on orbit period
  const orbitProgress = (elapsedMinutes / satellite.orbitPeriod) % 1;
  const angle = orbitProgress * 2 * Math.PI;
  
  // Calculate longitude (simplified)
  const longitude = ((angle * 180 / Math.PI) + (satellite.id.charCodeAt(0) * 10)) % 360 - 180;
  
  // Calculate latitude based on inclination (simplified sine wave)
  const latitude = Math.sin(angle) * satellite.orbitInclination;
  
  // Altitude varies slightly (simplified)
  const altitude = satellite.altitude + Math.sin(angle * 3) * (satellite.altitude * 0.02);
  
  // Calculate orbital velocity (simplified)
  const earthRadius = 6371; // km
  const orbitRadius = earthRadius + altitude;
  const orbitCircumference = 2 * Math.PI * orbitRadius;
  const velocity = orbitCircumference / (satellite.orbitPeriod * 60); // km/s
  
  return {
    latitude,
    longitude,
    altitude,
    velocity
  };
}
