"use client";
import { useState } from "react";
import { SATELLITES, getSatellitePosition } from "../satelliteData";
import { Search, Satellite, X, Radio, Globe, Zap } from "lucide-react";
// import { Input } from '../ui/input';
// import { ScrollArea } from '../ui/scroll-area';
// import { Badge } from '../ui/badge';
import { Card } from "react-bootstrap";
import SmallBodyObject from "@/app/events/SmallBodyObjectstype";

interface SatellitePanelProps {
  SBOs: SmallBodyObject[];

  currentTime: Date;
}

export function SatellitePanel({
  SBOs,

  currentTime,
}: SatellitePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredSatellites = SATELLITES.filter(
    (sat) =>
      sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sat.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Satellite List Panel */}
      <div
        className={`absolute left-0 top-20 bottom-0 w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 transition-transform duration-300 z-10 ${!isExpanded ? "-translate-x-full" : ""}`}
      >
        <div className="flex flex-col h-full">
          {/* Search */}
          <div className="p-4 border-b border-slate-800">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search satellites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div> */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <Card>
                <Card.Header>{SBOs.length} Satellites</Card.Header>
                <Card.Body>
                  {SBOs.map((sbo) => {
                    return (
                      <>
                        {sbo.name}
                        <br />
                      </>
                    );
                  })}
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Satellite List */}
          {/* <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredSatellites.map((satellite) => {
                const position = getSatellitePosition(satellite, currentTime);
                const isSelected = satellite.id === selectedSatellite;

                return (
                  <button
                    key={satellite.id}
                    onClick={() => onSelectSatellite(satellite.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Satellite className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{satellite.name}</span>
                        </div>
                        <div className="mt-1 text-xs opacity-70">
                          {satellite.type}
                        </div>
                        <div className="mt-1 text-xs opacity-70">
                          Alt: {position.altitude.toFixed(0)} km
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                        isSelected ? 'bg-white' : 'bg-green-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea> */}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-4 top-24 z-20 bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg border border-slate-700 transition-colors"
      >
        {isExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <Satellite className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
