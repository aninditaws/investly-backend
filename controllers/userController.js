const supabase = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Mendapatkan semua pengguna
const getUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
  res.status(200).json(data);
};

// Menambah pengguna baru dengan username, email, dan password
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Hash password sebelum menyimpannya
  const hashedPassword = await bcrypt.hash(password, 10);

  // Menyimpan pengguna baru dengan username, email, dan hashed password
  const { data, error } = await supabase
    .from("users")
    .insert([{ name: username, email: email, password: hashedPassword }]);

  if (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ error: "Failed to add user" });
  }

  res.status(201).json(data); // Mengirimkan data pengguna yang baru ditambahkan
};

const loginUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Cek apakah pengguna ada di database dengan username atau email
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${email},name.eq.${name}`)
    .single();

  if (!user || error) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verifikasi password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Membuat token JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token: token, id: user.id, name: user.name });
};

const setRiskLevel = async (req, res) => {
  try {
    const { id, riskLevel } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ risk_level: riskLevel })
      .eq("id", id);

    if (error) {
      return res.status(401).json({ error: "Error updating risk level" });
    }

    console.log("Risk level updated successfully:", id, riskLevel);
    return res.status(200).json({ id: id, risk_level: riskLevel });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

// Mendapatkan pengguna berdasarkan userId
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user from the database by userId
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, risk_level") // Fetch required columns
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  setRiskLevel,
  getUserById, // Export the new function
};
