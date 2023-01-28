const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

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

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
}) // Hash password before saving

const User = mongoose.model("User", userModel)

module.exports = User
