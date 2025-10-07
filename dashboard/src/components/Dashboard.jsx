import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);

  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };

    const fetchDoctorCount = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctorCount(data.doctors.length);
      } catch (error) {
        setDoctorCount(0);
      }
    };

    fetchAppointments();
    fetchDoctorCount();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status } : appt
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      {/* Dashboard Banner */}
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello ,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Hello, <strong>Admin!</strong> Your dashboard gives you quick access to users, messages, and system updates.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments.length}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{doctorCount}</h3>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="banner">
        <h5>Appointments</h5>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
              <th>Send Message</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td>{appointment.appointment_date.substring(0, 16)}</td>
                  <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                  <td>{appointment.department}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                    >
                      <option value="Pending" className="value-pending">
                        Pending
                      </option>
                      <option value="Accepted" className="value-accepted">
                        Accepted
                      </option>
                      <option value="Rejected" className="value-rejected">
                        Rejected
                      </option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>

                  {/* Beautified Send Message */}
                  <td>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const text = e.target.elements.message.value.trim();
                        if (!text) return toast.error("Enter a message!");
                        try {
                          const { data } = await axios.post(
                            "http://localhost:4000/api/v1/message/admin/send",
                            { email: appointment.email, text },
                            { withCredentials: true }
                          );
                          toast.success(data.message);
                          e.target.reset();
                        } catch (error) {
                          toast.error(error.response?.data?.message || "Failed to send message");
                        }
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <input
                        type="text"
                        name="message"
                        placeholder="Type a message..."
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "12px",
                          border: "1px solid #ccc",
                          outline: "none",
                          fontSize: "0.9rem",
                        }}
                        required
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "6px 14px",
                          borderRadius: "12px",
                          border: "none",
                          backgroundColor: "#4caf50",
                          color: "#fff",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#45a049")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#4caf50")
                        }
                      >
                        Send
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No Appointments Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
