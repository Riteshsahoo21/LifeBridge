import express from "express";
import {
  sendMessage,
  sendAdminMessage,
  getUserMessages,
  getAllMessages,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// User routes
router.post("/send", sendMessage);                  // User sends a message
router.get("/messages", getUserMessages);           // User fetches their messages (email as query param)

// Admin routes
router.post("/admin/send", isAdminAuthenticated, sendAdminMessage); // Admin sends message to user
router.get("/getall", isAdminAuthenticated, getAllMessages);        // Admin fetches all messages

export default router;

