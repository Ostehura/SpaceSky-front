import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Calendar, Clock } from 'lucide-react';
import { Button } from 'react-bootstrap';


interface TimeControlProps {
  currentTime: Date;
  setCurrentTime: (date: Date) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export function TimeControl({ currentTime, setCurrentTime, isPaused, setIsPaused }: TimeControlProps) {
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time progression
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentTime(new Date(currentTime.getTime() + 50 * timeSpeed));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPaused, currentTime, timeSpeed, setCurrentTime]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleSkipBack = () => {
    setCurrentTime(new Date(currentTime.getTime() - 3600000)); // -1 hour
  };

  const handleSkipForward = () => {
    setCurrentTime(new Date(currentTime.getTime() + 3600000)); // +1 hour
  };

  const handleResetToNow = () => {
    setCurrentTime(new Date());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());
      newDate.setSeconds(currentTime.getSeconds());
      setCurrentTime(newDate);
      setShowDatePicker(false);
    }
  };

  const speedOptions = [
    { value: 1, label: '1x' },
    { value: 10, label: '10x' },
    { value: 60, label: '1m' },
    { value: 300, label: '5m' },
    { value: 3600, label: '1h' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 mb-16 z-10">
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
        <div className="p-4 space-y-4">
          {/* Date and Time Display */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 " />
              <div className=" min-w-[220px]">
                {formatDateTime(currentTime)}
              </div>
            </div>

            {/* <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Select Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="center">
                <CalendarComponent
                  mode="single"
                  selected={currentTime}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="bg-slate-800"
                />
              </PopoverContent>
            </Popover> */}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipBack}
              className="bg-slate-800 border-slate-700  hover:bg-slate-700"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="bg-blue-600 hover:bg-blue-700  px-6"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipForward}
              className="bg-slate-800 border-slate-700  hover:bg-slate-700"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToNow}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              Now
            </Button>
          </div>

          {/* Time Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Time Speed</span>
              <span className="text-sm text-white">
                {speedOptions.find(s => s.value === timeSpeed)?.label || `${timeSpeed}x`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeSpeed(option.value)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    timeSpeed === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  style={{backgroundColor:  timeSpeed === option.value?"black":"white" }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}