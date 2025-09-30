import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  deleteDoctor,
  updateDoctor, // ✅ fixed
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Patient routes
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Admin routes
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Doctors routes
router.get("/doctors", getAllDoctors);
router.delete("/doctors/:id", isAdminAuthenticated, deleteDoctor); // <-- delete route

//update routes
router.put("/doctors/:id", isAdminAuthenticated, updateDoctor);
export default router;

