"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Button, Alert } from "react-bootstrap";
import api from "@/lib/api";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) router.push("/auth/login");
  }, [router]);

  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!oldPassword.trim()) {
        setError("Old password is required to confirm changes.");
        return;
      }

      if (email.trim() && !isValidEmail(email.trim())) {
        setError("Invalid email format.");
        return;
      }

      if (newPassword.trim() || newPasswordConfirm.trim()) {
        if (newPassword.trim() !== newPasswordConfirm.trim()) {
          setError("New password and confirmation do not match.");
          return;
        }
      }

      const payload: Record<string, string> = {
        old_password: oldPassword.trim(),
      };

      if (email.trim()) payload.email = email.trim();
      if (login.trim()) payload.username = login.trim();
      if (newPassword.trim()) payload.new_password = newPassword.trim();

      if (Object.keys(payload).length === 1) {
        setError("Fill at least one field to update (email, login or password).");
        return;
      }

      await api.patch("/api/user/", payload);

      setSuccess("Updated successfully.");
      setEmail("");
      setLogin("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setOldPassword("");
    } catch (err: any) {
      const data = err?.response?.data;
      setError(data ? JSON.stringify(data) : "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow mt-5" style={{ maxWidth: 520, margin: "auto" }}>
      <Card.Body>
        <h3 className="text-center mb-3">User settings</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="New email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="login">
            <Form.Label>Login</Form.Label>
            <Form.Control
              type="text"
              placeholder="New login (optional)"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New password (optional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPasswordConfirm">
            <Form.Label>New password confirmation</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password (optional)"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="oldPassword">
            <Form.Label>Old password (required)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password to confirm changes"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
