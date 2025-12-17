import { authenticateUser } from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { user, token } = await authenticateUser(email, password);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
