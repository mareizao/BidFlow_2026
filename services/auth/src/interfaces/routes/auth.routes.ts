import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { JwtService } from '../../infrastructure/jwt/JwtService';
import { LoginUseCase } from '../../application/useCases/LoginUseCase';
import { VerifyTokenUseCase } from '../../application/useCases/VerifyTokenUseCase';

// Composition root — dependency injection
const userRepository = new PrismaUserRepository();
const jwtService = new JwtService();
const loginUseCase = new LoginUseCase(userRepository, jwtService);
const verifyTokenUseCase = new VerifyTokenUseCase(userRepository, jwtService);
const authController = new AuthController(loginUseCase, verifyTokenUseCase);

const router = Router();

router.post('/login', authController.login);
router.get('/verify', authMiddleware, authController.verify);
router.get('/health', authController.health);

export default router;
