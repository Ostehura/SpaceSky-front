"use client";
import { useState, FormEvent } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      if (res.data.access && res.data.refresh) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
      }
      router.push("/");
    } catch (err) {
      setError(
        JSON.stringify((err as AxiosError).response?.data) ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow mt-5" style={{ maxWidth: 400, margin: "auto" }}>
      <Card.Body>
        <h3 className="text-center mb-3">Sign In</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
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
        Don&apos;t have an account? Create one{" "}
        <Link href="/auth/signup">here</Link>
      </Card.Body>
    </Card>
  );
}
