import Link from "next/link";
import SmallBodyObject from "./SmallBodyObjectstype";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";
import api from "@/lib/api";

function EventListLine(props: { event: SmallBodyObject, sendRequest: Function }) {
  const event = props.event;
  return (
    <tr>
      <td>
        <Link
          href={`https://www.openstreetmap.org/#map=6/${event.longitude}/${event.latitude}`}
        >
          {event.name}
        </Link>
      </td>
      <td>
        {event.latitude}
        <br />
        {event.longitude}
      </td>
      <td>
        {event.azimuth}
        <br />
        {event.altitude}
      </td>
      <td>
        {"from: "}
        {event.begin_time.toLocaleString()}
        <br />
        {"till: "}
        {event.end_time.toLocaleString()}
      </td>
      <td>
        <Button
          variant="primary"
          onClick={() =>
            props.sendRequest(event.name, event.begin_time.toLocaleString())
          }
        >
          Click me
        </Button>
      </td>
    </tr>
  );
}

function EventList(props: { array: SmallBodyObject[], sendRequest: Function }) {
  const array = props.array;
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Azimuth & Altitude</th>
          <th>Time</th>
          <th>subscribe</th>
        </tr>
      </thead>
      <tbody>
        {array.map((event, index) => (
          <EventListLine event={event} key={index} sendRequest={props.sendRequest} />
        ))}
      </tbody>
    </Table>
  );
}

export default EventList;
