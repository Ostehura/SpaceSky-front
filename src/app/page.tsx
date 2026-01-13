"use client"
import styles from "./page.module.css";
import { SpaceMap } from "@/lib/map-componenets/SpaceMap";
import { useEffect, useState } from "react";
import { SatellitePanel } from "@/lib/map-componenets/SatellitePanel";
import { TimeControl } from "@/lib/map-componenets/TimeControl";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {
  
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

   useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:8000/api/satellites/");
      } catch (err) {
        console.error(err);
      }
    };

    // initial call
    fetchData();

    // every minute
    const interval = setInterval(fetchData, 60_000);

    return () => clearInterval(interval); 
  }, []);

useEffect(() => {
  setCurrentTime(new Date());
}, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950">
        <div className="relative w-full h-full">
        {/* 3D Space Map */}
        {currentTime && <SpaceMap 
          currentTime={currentTime} 
          selectedSatellite={selectedSatellite}
          onSelectSatellite={setSelectedSatellite}
        />}
        <Container fluid>
        {/* Satellite Panel */}
        <Row>
          <Col>
            {currentTime && <SatellitePanel 
              selectedSatellite={selectedSatellite}
              onSelectSatellite={setSelectedSatellite}
              currentTime={currentTime}
            />}
          </Col>
          <Col>
            {/* Time Control */}
            {currentTime && <TimeControl 
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />}
          </Col>
        </Row>
        </Container>
      </div>
     
    </div>
  );
}
