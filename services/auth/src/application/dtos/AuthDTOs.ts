import { UserPublic } from '../../domain/entities/User';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserPublic;
}

export interface VerifyResponseDTO extends UserPublic {}
