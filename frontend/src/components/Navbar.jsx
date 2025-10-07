import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hasRead, setHasRead] = useState(false); // track if modal opened

  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();

  // Fetch messages for logged-in user
  const fetchMessages = async () => {
    if (!isAuthenticated || !user?.email) return;
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/message/messages?email=${user.email}`,
        { withCredentials: true }
      );
      setMessages(data.messages.reverse());
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // Auto-fetch messages every 15 sec
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user/patient/logout",
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const goToLogin = () => navigate("/login");

  // Open modal and mark messages as read
  const openModal = () => {
    fetchMessages();
    setShowModal(true);
    setHasRead(true);
  };

  return (
    <>
      <nav className="container">
        {/* Logo */}
        <div className="logo">
          <img
            src="/logo.png"
            alt="logo"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "20px",
            }}
          />
        </div>

        {/* Links */}
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>Home</Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>Appointment</Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>About Us</Link>
          </div>

          {/* User Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Messages Icon */}
            {isAuthenticated && (
              <div style={{ position: "relative" }}>
                <AiOutlineMessage
                  size={28}
                  style={{ cursor: "pointer" }}
                  onClick={openModal}
                />
                {/* Unread badge */}
                {messages.length > 0 && !hasRead && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {messages.length}
                  </span>
                )}
              </div>
            )}

            {/* Login / Logout */}
            {isAuthenticated ? (
              <button className="logoutBtn btn" onClick={handleLogout}>
                LOGOUT
              </button>
            ) : (
              <button className="loginBtn btn" onClick={goToLogin}>
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      {/* Message Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "10px",
              width: "350px",
              maxHeight: "400px",
              overflowY: "auto",
              padding: "20px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Messages</h3>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    padding: "10px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    background: "#f1f1f1",
                  }}
                >
                  <strong>Admin:</strong> {msg.text}
                  <div style={{ fontSize: "0.7rem", color: "#555" }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p>No messages</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
