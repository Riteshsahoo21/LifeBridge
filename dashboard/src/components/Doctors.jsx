import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const [editingDoctor, setEditingDoctor] = useState(null); // doctor being edited
  const [formData, setFormData] = useState({});
  const [editingDoctorPreview, setEditingDoctorPreview] = useState(null); // local preview for avatar

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/v1/user/doctors/${id}`, {
        withCredentials: true,
      });
      toast.success("Doctor removed successfully");
      setDoctors(doctors.filter((doc) => doc._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting doctor");
    }
  };

  // Open edit modal
  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      nic: doctor.nic,
      dob: doctor.dob.substring(0, 10),
      gender: doctor.gender,
      doctorDepartment: doctor.doctorDepartment,
      docAvatar: null, // will hold new file if changed
    });
    setEditingDoctorPreview(null);
  };

  // Update form inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update doctor
  const handleUpdateDoctor = async () => {
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) dataToSend.append(key, formData[key]);
      });

      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/doctors/${editingDoctor._id}`,
        dataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Doctor updated successfully");

      // Update local state with new doctor data
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === editingDoctor._id
            ? { ...doc, ...data.doctor } // use backend returned data (includes Cloudinary URL)
            : doc
        )
      );

      setEditingDoctor(null);
      setEditingDoctorPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating doctor");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <h3>Total Doctors: {doctors.length}</h3>
      <div className="banner">
        {doctors.length > 0 ? (
          doctors.map((element) => (
            <div className="card" key={element._id}>
              <img
                src={element.docAvatar?.url}
                alt="doctor avatar"
                style={{ objectFit: "cover",      // prevents distortion
                            borderRadius: "50%",     // makes it circular
                            border: "2px solid #4CAF50", // subtle border
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // soft shadow
                           marginBottom: "12px"  }}   // spacing below the image}}
              />
              <h4>{`${element.firstName} ${element.lastName}`}</h4>
              <div className="details">
                <p>Email: <span>{element.email}</span></p>
                <p>Phone: <span>{element.phone}</span></p>
                <p>DOB: <span>{element.dob.substring(0, 10)}</span></p>
                <p>Department: <span>{element.doctorDepartment}</span></p>
                <p>NIC: <span>{element.nic}</span></p>
                <p>Gender: <span>{element.gender}</span></p>
              </div>

              {/* Buttons */}
              <button
                onClick={() => handleEditClick(element)}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  marginTop: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                Edit Doctor Details
              </button>

              <button
                onClick={() => handleDeleteDoctor(element._id)}
                style={{
                  backgroundColor: "violet",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  marginTop: "10px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  width: "100%",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "darkviolet")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "violet")
                }
              >
                Remove Doctor
              </button>
            </div>
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>

      {/* Edit Modal */}
      {editingDoctor && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              maxHeight: "90%",
              overflowY: "auto",
            }}
          >
            <h2>Edit Doctor Details</h2>

            {Object.keys(formData).map((key) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label
                  style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
                >
                  {key}
                </label>

                {key === "docAvatar" ? (
                  <>
                    <input
                      type="file"
                      name="docAvatar"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFormData({ ...formData, docAvatar: file });
                        setEditingDoctorPreview(URL.createObjectURL(file));
                      }}
                    />
                    <img
                      src={editingDoctorPreview || editingDoctor.docAvatar?.url}
                      alt="avatar preview"
                      style={{ width: "80px", marginTop: "10px", borderRadius: "50%" }}
                    />
                  </>
                ) : key === "doctorDepartment" ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select Department</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="ENT">ENT</option>
                  </select>
                ) : key === "gender" ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : key === "dob" ? (
                  <input
                    type="date"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleUpdateDoctor}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                marginTop: "10px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingDoctor(null)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                marginTop: "10px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;
