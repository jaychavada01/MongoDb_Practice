const User = require("../models/user");
const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password });

    const token = await generateToken(newUser._id);
    newUser.token = token;
    await newUser.save();

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user._id);
    user.token = token;
    await user.save();

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    const user = await User.findOne({ token });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    user.token = null;
    await user.save();
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Filter with Pagination
exports.getAllUser = async (req, res) => {
  try {
    let { search, sortBy, page, limit } = req.query;
    let query = { isDeleted: false };

    // search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // sorting
    const sortOpts = {};
    if (sortBy) {
      sortOpts[sortBy] = 1; // asc
    }

    // pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * pageSize;

    const users = await User.find(query, { isDeleted: false })
      .sort(sortOpts)
      .skip(skip)
      .limit(pageSize)
      .select("-password"); // filter without password field

    const totalUsers = await User.countDocuments(query);
    res.status(200).json({ totalUsers, page: pageNumber, pageSize, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Get User by Id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ _id: id, isDeleted: false }).select(
      "-password"
    );
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or has been deleted" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Update user
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;

    // Find the user and check if it's not deleted
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or has been deleted" });

    // Update the user
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Soft delete user
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Group Users by Email Domain - Excluding Soft Deleted
exports.groupUsersByDomain = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { $substr: ["$email", { $indexOfBytes: ["$email", "@"] }, -1] },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
