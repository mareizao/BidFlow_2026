import bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService } from '../../infrastructure/jwt/JwtService';
import { toPublicUser } from '../../domain/entities/User';
import { LoginRequestDTO, LoginResponseDTO } from '../dtos/AuthDTOs';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = dto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const publicUser = toPublicUser(user);
    const token = this.jwtService.sign(publicUser);

    return { token, user: publicUser };
  }
}
