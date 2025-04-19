// Routes for authentication (e.g., /register, /login).
import express from "express";
import { LoginUserDto, RegisterUserDto } from "../../dtos/auth.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post("/register", validateDto(RegisterUserDto), (req, res) => {
	// Handle registration logic here
	res.status(201).json({ message: "Registration successful." });
});

router.post("/login", validateDto(LoginUserDto), (req, res) => {
	// Handle login logic here
	res.status(200).json({ token: "JWT_TOKEN" });
});

export default router;
