"use client";
import { useState, FormEvent } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password_confirmation, setConfirmation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/register/", {
        email,
        username,
        password,
        password2: password_confirmation,
      });
      if (200 <= res.status && res.status <= 299) {
        router.push("/");
      } else {
        setError(res.data);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const data = axiosErr.response?.data;

      if (data) {
        setError(JSON.stringify(data));
      } else {
        setError("Ooops! Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow mt-5" style={{ maxWidth: 400, margin: "auto" }}>
      <Card.Body>
        <h3 className="text-center mb-3">Sign Up</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Select your username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPasswordConfirmation">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={password_confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </Card.Body>
      <Card.Body>
        Already have an account? <Link href="/auth/login">Log in here</Link>
      </Card.Body>
    </Card>
  );
}
