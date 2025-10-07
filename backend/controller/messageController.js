import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

// User sends a message
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const newMessage = await Message.create({
    firstName,
    lastName,
    email,
    phone,
    message,
    senderType: "user",
  });

  res.status(201).json({
    success: true,
    message: "Message sent!",
    data: newMessage,
  });
});

// Admin sends a message to a user
export const sendAdminMessage = catchAsyncErrors(async (req, res, next) => {
  const { text, email } = req.body; // admin can target a specific user by email

  if (!text || !email) {
    return next(new ErrorHandler("Text and target user email are required!", 400));
  }

  const newMessage = await Message.create({
    text,
    email,
    senderType: "admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin message sent!",
    data: newMessage,
  });
});

// User fetches their messages (including admin replies)
export const getUserMessages = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return next(new ErrorHandler("User email is required!", 400));
  }

  const messages = await Message.find({ email }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Admin fetches all messages
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

