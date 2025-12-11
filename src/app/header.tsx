"use client";
import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";

function Header() {
  const [accessTokenExpirationTime, setAccessTokenExpirationTime] = useState<
    string | null
  >(null);
  const [refreshTokenExpirationTime, setRefreshTokenExpirationTime] = useState<
    string | null
  >(null);

  // 1️⃣ Load localStorage values on mount
  useEffect(() => {
    const accessExpiresAt = localStorage.getItem("accessExpiresAt");
    const refreshExpiresAt = localStorage.getItem("refreshExpiresAt");
    setAccessTokenExpirationTime(accessExpiresAt);
    setRefreshTokenExpirationTime(refreshExpiresAt);
  }, []);

  const isLoggedIn =
    (!!accessTokenExpirationTime &&
      new Date(accessTokenExpirationTime) > new Date()) ||
    (!!refreshTokenExpirationTime &&
      new Date(refreshTokenExpirationTime) > new Date());

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#">SpaceSky</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} href="/">
                Map
              </Nav.Link>
              <Nav.Link as={Link} href="/events">
                Events
              </Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Nav.Link as={Link} href="/user">
                  User
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} href="/auth/login">
                  Log in
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
