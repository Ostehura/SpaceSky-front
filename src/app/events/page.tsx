"use client";

import { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import SmallBodyObject from "./SmallBodyObjectstype";
import EventList from "./eventList";
import api from "@/lib/api";

type position = {
  latitude: number;
  longitude: number;
  isValid: boolean;
};

export default function EventsPage() {
  const [beginTime, setBeginTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [location, setLocation] = useState<position>({
    latitude: 0,
    longitude: 0,
    isValid: false,
  });
  const [events, setEvents] = useState<SmallBodyObject[]>([]);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(location);
    if (!location.isValid) {
      setError("Location is needed for this action");
      setLoading(false);
      return;
    }
    const accessToken = localStorage.getItem("access");
    try {
      const res = await api.post(
        "http://localhost:8000/events/",
        {
          latitude: location.latitude,
          longitude: location.longitude,
          begin_time: beginTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEvents(res.data);
    } catch (err) {
      setError(
        JSON.stringify((err as AxiosError).response?.data) ||
          "Ooops! Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card
      className="p-4 shadow mt-5"
      style={{ maxWidth: "90%", margin: "auto" }}
    >
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>Begin time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={beginTime}
              onChange={(e) => setBeginTime(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !location.isValid}
            className="w-100"
          >
            {location.isValid
              ? loading
                ? "Finding events..."
                : "Find events"
              : "Your location is loading"}
          </Button>
        </Form>
      </Card.Body>
      <Card.Body>
        <EventList array={events} />
      </Card.Body>
    </Card>
  );
}
