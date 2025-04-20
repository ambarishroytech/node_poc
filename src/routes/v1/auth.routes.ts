import express from "express";
import { AuthController } from "../../controllers/auth.controller";
import { LoginUserDto, RegisterUserDto } from "../../dtos/auth.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();
const authController = new AuthController();

router.post("/register", validateDto(RegisterUserDto), authController.register);
router.post("/login", validateDto(LoginUserDto), authController.login);

export default router;
