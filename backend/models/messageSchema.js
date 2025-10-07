import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    // 🔸 sender type: admin, user, or system
    senderType: {
      type: String,
      enum: ["admin", "user", "system"],
      default: "user",
    },

    // 🔹 Admin/System message field
    text: {
      type: String,
    },

    // 🔹 User message fields (optional)
    firstName: {
      type: String,
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
      maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },
    message: {
      type: String,
      minLength: [10, "Message Must Contain At Least 10 Characters!"],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
