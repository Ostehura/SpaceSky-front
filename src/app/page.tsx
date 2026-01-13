"use client"
import { SpaceMap } from "@/lib/map-componenets/SpaceMap";
import { useEffect, useState } from "react";
import { SatellitePanel } from "@/lib/map-componenets/SatellitePanel";
import { TimeControl } from "@/lib/map-componenets/TimeControl";
import { Col, Container, Row } from "react-bootstrap";
import { position } from "@/lib/position";
import api from "@/lib/api";
import SmallBodyObject from "./events/SmallBodyObjectstype";
import { lagrangeInterpolation } from "@/lib/Interpolation";
import { json } from "stream/consumers";
const minute:number = 60_000;
export default function Home() {
  
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [location, setLocation] = useState<position>({
      latitude: 0,
      longitude: 0,
      isValid: false,
    });
  const [SBOs, setSBOs] = useState<SmallBodyObject[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            isValid: true,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocation((l) => ({ ...l, isValid: false }));
        }
      );
    }
  }, []);
   useEffect(() => {
    const fetchData = async () => {
      try {
        const beginTime = new Date();
        const endTime = new Date();
        console.log(beginTime);
        endTime.setHours(beginTime.getHours() + 6) ;
        beginTime.setHours(beginTime.getHours() - 6);
        console.log(beginTime, endTime)
        const accessToken = localStorage.getItem("access");
        const res : SmallBodyObject[] = await api.post(
        "http://localhost:8000/events/",
        {
          latitude: location.latitude,
          longitude: location.longitude,
          begin_time: beginTime.toISOString(),
          end_time: endTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSBOs(res.data);
      } catch (err) {
        console.error(err);
      } 
    };

    // initial call
    fetchData();

    // every minute
    const interval = setInterval(fetchData, minute*10);

    return () => clearInterval(interval); 
  }, []);
  useEffect(() => {
   
    
    const recaluclateLocation = async ()=>{
      const curTime = new Date();
       console.log(curTime,"CT", currentTime)
       if(!curTime){
      console.log("NULL")
      return;}
     
       SBOs.forEach((sbo:SmallBodyObject)=>{
        const obj = lagrangeInterpolation(sbo.points12, curTime);
        sbo.latitude=obj.ra;
        sbo.latitude=obj.dec;
       })
    };
    
    const interval = setInterval(recaluclateLocation, minute/2);

    return () => clearInterval(interval); },[])

// useEffect(() => {
//   const setTime=()=>{
//   setCurrentTime(new Date());
//   };
  
//   const interval = setInterval(setTime,minute/60);
//    return () => clearInterval(interval);
// }, []);
useEffect(() => {setCurrentTime(new Date());},[]);
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950">
        <div className="relative w-full h-full">
        {/* 3D Space Map */}
        {currentTime && <SpaceMap 
        SBOs={SBOs}
          isPaused={isPaused}
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
