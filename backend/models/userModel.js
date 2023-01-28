const mongoose = require("mongoose")

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://img.icons8.com/external-avatar-andi-nur-abdillah/64/null/external-avatar-avatarar-bussiness-avatar-andi-nur-abdillah-32.png",
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model("User", userModel)

module.exports = User
