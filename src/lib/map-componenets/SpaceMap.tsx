"use client";
import { useEffect, useRef, useState } from "react";
import { getSatellitePosition, SATELLITES } from "../satelliteData";
import SmallBodyObject from "@/app/events/SmallBodyObjectstype";
import { lagrangeInterpolation } from "../Interpolation";
const minute: number = 60_000;
interface SpaceMapProps {
  currentTime: Date;
  selectedSatellite: string | null;
  onSelectSatellite: (id: string | null) => void;
  isPaused: boolean;
  SBOs: SmallBodyObject[];
}
interface position {
  x: number;
  y: number;
  size: number;
}
export function SpaceMap({
  currentTime,
  selectedSatellite,
  onSelectSatellite,
  isPaused,
  SBOs,
}: SpaceMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const [zoom, setZoom] = useState(1.5);
  const [starPosition, setStars] = useState<position[]>([]);
  useEffect(() => {
    const recaluclateLocation = async () => {
      if (!currentTime) {
        return;
      }

      SBOs.forEach((sbo: SmallBodyObject) => {
        const obj = lagrangeInterpolation(sbo.points12, currentTime);
        sbo.longitude = obj.ra;
        sbo.latitude = obj.dec;
      });
    };

    const interval = setInterval(recaluclateLocation, 250);

    return () => clearInterval(interval);
  }, [currentTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.height = window.innerHeight * 0.8;

      canvas.width = window.innerWidth * 0.9;

      // ✅ reset + scale ONCE
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const starposition: position[] = [];
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const earthRadius = Math.min(rect.width, rect.height) * 0.25 * zoom; //10000
    const PixelsPerAstromicalUnit = rect.width / 4;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw space background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw stars
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 200; i++) {
      if (starPosition.length < 200) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const size = Math.random() * 2;
        starPosition.push({ x, y, size });
      }
      const size = Math.max(
        starPosition[i].size * (Math.random() * 0.2 + 1),
        0,
      );
      // const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(starPosition[i].x, starPosition[i].y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Save context for Earth rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    // ctx.rotate(rotation);

    // Draw Earth
    const earthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, earthRadius);
    earthGradient.addColorStop(0, "#3b82f6");
    earthGradient.addColorStop(0.5, "#1e40af");
    earthGradient.addColorStop(1, "#1e3a8a");

    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw continents (simplified landmasses)
    ctx.fillStyle = "#22c55e";
    ctx.globalAlpha = 0.4;

    // Helper function to draw a continent shape
    const drawContinent = (points: { x: number; y: number }[]) => {
      if (points.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Helper to convert lat/lon to x/y on the 2D projection (orthographic)
    const latLonToXY = (lat: number, lon: number) => {
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180;
      // Orthographic projection
      const x = earthRadius * 0.9 * Math.cos(latRad) * Math.sin(lonRad);
      const y = -earthRadius * 0.9 * Math.sin(latRad);
      return { x, y };
    };

    // Africa
    drawContinent([
      latLonToXY(35, 10),
      latLonToXY(30, 30),
      latLonToXY(15, 45),
      latLonToXY(0, 40),
      latLonToXY(-15, 45),
      latLonToXY(-30, 35),
      latLonToXY(-35, 20),
      latLonToXY(-20, 15),
      latLonToXY(-10, 10),
      latLonToXY(0, 5),
      latLonToXY(10, 0),
      latLonToXY(25, 0),
    ]);

    // Europe
    drawContinent([
      latLonToXY(70, 20),
      latLonToXY(65, 30),
      latLonToXY(55, 35),
      latLonToXY(45, 40),
      latLonToXY(40, 35),
      latLonToXY(38, 10),
      latLonToXY(55, 5),
      latLonToXY(65, 10),
    ]);

    // Asia
    drawContinent([
      latLonToXY(70, 60),
      latLonToXY(70, 100),
      latLonToXY(65, 120),
      latLonToXY(50, 140),
      latLonToXY(40, 135),
      latLonToXY(25, 120),
      latLonToXY(10, 110),
      latLonToXY(5, 100),
      latLonToXY(20, 90),
      latLonToXY(30, 80),
      latLonToXY(40, 70),
      latLonToXY(50, 60),
    ]);

    // North America
    drawContinent([
      latLonToXY(70, -100),
      latLonToXY(65, -80),
      latLonToXY(50, -70),
      latLonToXY(45, -75),
      latLonToXY(35, -80),
      latLonToXY(25, -90),
      latLonToXY(20, -100),
      latLonToXY(15, -110),
      latLonToXY(30, -115),
      latLonToXY(50, -120),
      latLonToXY(60, -110),
    ]);

    // South America
    drawContinent([
      latLonToXY(10, -80),
      latLonToXY(5, -75),
      latLonToXY(-5, -70),
      latLonToXY(-15, -70),
      latLonToXY(-25, -65),
      latLonToXY(-35, -70),
      latLonToXY(-50, -75),
      latLonToXY(-55, -70),
      latLonToXY(-45, -65),
      latLonToXY(-30, -55),
      latLonToXY(-20, -50),
      latLonToXY(-10, -55),
      latLonToXY(0, -60),
    ]);

    // Australia
    drawContinent([
      latLonToXY(-10, 130),
      latLonToXY(-15, 140),
      latLonToXY(-25, 150),
      latLonToXY(-35, 145),
      latLonToXY(-40, 135),
      latLonToXY(-35, 120),
      latLonToXY(-25, 115),
      latLonToXY(-15, 120),
    ]);

    ctx.globalAlpha = 1;

    // Draw latitude/longitude lines
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;

    // Latitude lines (horizontal)
    for (let lat = -75; lat <= 75; lat += 15) {
      ctx.beginPath();
      const latRad = (lat * Math.PI) / 180;
      const y = -earthRadius * Math.sin(latRad);
      const radius = earthRadius * Math.cos(latRad);

      // Draw visible arc
      if (radius > 0) {
        ctx.ellipse(0, y, radius, radius * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Longitude lines (vertical)
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      const lonRad = (lon * Math.PI) / 180;

      // Draw a curve from north to south pole
      for (let lat = -90; lat <= 90; lat += 5) {
        const latRad = (lat * Math.PI) / 180;
        const x = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
        const y = -earthRadius * Math.sin(latRad);

        if (lat === -90) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
    // ctx.strokeStyle = "f59e0b"
    // ctx.arc(5,5,1,0,Math.PI*2);
    // ctx.stroke();

    SBOs.forEach((sbo: SmallBodyObject) => {
      if (90 <= sbo.longitude && sbo.longitude <= 270) return;
      ctx.beginPath();
      ctx.fillStyle = "#f59e0b";
      const deltaX =
        Math.sin(sbo.longitude) * sbo.distance * zoom * PixelsPerAstromicalUnit;
      const deltaY =
        Math.sin(sbo.latitude) * sbo.distance * zoom * PixelsPerAstromicalUnit;
      ctx.arc(deltaX + centerX, deltaY + centerY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    // Draw orbital paths and satellites
    SATELLITES.forEach((satellite) => {
      const pos = getSatellitePosition(satellite, currentTime);

      // Draw orbit
      // ctx.strokeStyle = satellite.id === selectedSatellite ? '#f59e0b' : '#6366f1';
      // ctx.lineWidth = 1;
      // ctx.globalAlpha = 0.3;
      // ctx.beginPath();
      const orbitRadius = earthRadius + pos.altitude / 10;
      // ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.globalAlpha = 1;

      // Calculate satellite position on screen
      const angle = rotation + (pos.longitude * Math.PI) / 180;
      const satX = centerX + Math.cos(angle) * orbitRadius;
      const satY = centerY + Math.sin(angle) * orbitRadius;

      // Draw satellite
      const isSelected = satellite.id === selectedSatellite;
      // ctx.fillStyle = isSelected ? '#f59e0b' : '#60a5fa';
      // ctx.beginPath();
      // ctx.arc(satX, satY, isSelected ? 6 : 4, 0, Math.PI * 2);
      // ctx.fill();

      // // Draw satellite glow
      // ctx.strokeStyle = isSelected ? '#f59e0b' : '#60a5fa';
      // ctx.lineWidth = 2;
      // ctx.globalAlpha = 0.3;
      // ctx.beginPath();
      // ctx.arc(satX, satY, isSelected ? 12 : 8, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.globalAlpha = 1;

      // Draw satellite label
      if (isSelected) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px system-ui";
        ctx.fillText(satellite.name, satX + 10, satY - 10);
      }
    });
  }, [currentTime, rotation, selectedSatellite, zoom]);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging.current) {
        setRotation((prev) => (prev + 0.003) % (Math.PI * 2));
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastMouseX.current;
      setRotation((prev) => prev + deltaX * 0.01);
      lastMouseX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    setZoom((prev) =>
      Math.max(0.5, Math.min(3, prev + (e.deltaY > 0 ? -0.1 : 0.1))),
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const earthRadius = 80 * zoom;

    // Check if any satellite was clicked
    let clickedSatellite: string | null = null;

    SATELLITES.forEach((satellite) => {
      const pos = getSatellitePosition(satellite, currentTime);
      const orbitRadius = earthRadius + pos.altitude / 10;
      const angle = rotation + (pos.longitude * Math.PI) / 180;
      const satX = centerX + Math.cos(angle) * orbitRadius;
      const satY = centerY + Math.sin(angle) * orbitRadius;

      const distance = Math.sqrt(Math.pow(x - satX, 2) + Math.pow(y - satY, 2));
      if (distance < 15) {
        clickedSatellite = satellite.id;
      }
    });

    onSelectSatellite(clickedSatellite);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden "
      style={{ paddingLeft: 50, paddingTop: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Controls hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
        <p className="text-slate-300 text-sm">
          Drag to rotate • Scroll to zoom • Click satellites to select
        </p>
      </div>
    </div>
  );
}
