import { InterpolationPoint } from "@/app/events/InterpolationPoint";

export function lagrangeInterpolation(points: InterpolationPoint[], x: Date): InterpolationPoint {
  const result = {ra:0, dec: 0, time: x};

  for (let i = 0; i < points.length; i++) {
    let termDec = points[i].dec;
    let termRa = points[i].ra;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        const coef =  (x.getTime() - points[j].time.getTime()) / (points[i].time.getTime()- points[j].time.getTime());
        termDec *= coef;
        termRa *= coef;
      }
    }

    result.ra += termRa;
    result.dec += termDec;
  }

  return result;
}