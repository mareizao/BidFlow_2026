import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService } from '../../infrastructure/jwt/JwtService';
import { toPublicUser } from '../../domain/entities/User';
import { VerifyResponseDTO } from '../dtos/AuthDTOs';

export class VerifyTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<VerifyResponseDTO> {
    const payload = this.jwtService.verify(token);

    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return toPublicUser(user);
  }
}
