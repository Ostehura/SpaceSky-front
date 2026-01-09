type SmallBodyObject = {
  latitude: number;
  longitude: number;
  begin_time: Date;
  end_time: Date;
  altitude: number | null;
  azimuth: number | null;
  name: string;
};

export default SmallBodyObject;
