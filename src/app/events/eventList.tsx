import SmallBodyObject from "./SmallBodyObjectstype";
import Table from "react-bootstrap/Table";

function EventListLine(props: { event: SmallBodyObject }) {
  const event = props.event;
  return (
    <tr>
      <td>
        {event.latitude}
        <br />
        {event.longitude}
      </td>
      <td>{event.data_czas.toLocaleDateString()}</td>
      <td>{event.jasnosc_max}</td>
    </tr>
  );
}

function EventList(props: { array: SmallBodyObject[] }) {
  const array = props.array;
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Location</th>
          <th>Time</th>
          <th>Brightness</th>
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
