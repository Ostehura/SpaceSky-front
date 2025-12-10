import Link from "next/link";
import SmallBodyObject from "./SmallBodyObjectstype";
import Table from "react-bootstrap/Table";

function EventListLine(props: { event: SmallBodyObject }) {
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
        {"from: "}
        {event.begin_time.toLocaleString()}
        <br />
        {"till: "}
        {event.end_time.toLocaleString()}
      </td>
    </tr>
  );
}

function EventList(props: { array: SmallBodyObject[] }) {
  const array = props.array;
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {array.map((event, index) => (
          <EventListLine event={event} key={index} />
        ))}
      </tbody>
    </Table>
  );
}

export default EventList;
