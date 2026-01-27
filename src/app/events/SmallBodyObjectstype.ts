import { InterpolationPoint } from "./InterpolationPoint";

type SmallBodyObject = {
  latitude: number;
  longitude: number;
  begin_time: Date;
  end_time: Date;
  altitude: number | null;
  azimuth: number | null;
  name: string;
  points12: InterpolationPoint[];
  distance: number;
};

export default SmallBodyObject;
