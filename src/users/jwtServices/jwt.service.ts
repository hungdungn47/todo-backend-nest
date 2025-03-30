import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify } from "jsonwebtoken";

@Injectable()
export class JwtService {
  private secretKey;
  constructor(private configService: ConfigService) {
    this.secretKey = configService.get<string>("JWT_SECRET")
  }
  generateAccessToken(payload: any): string {
    const token = sign(payload, this.secretKey as string, {
      expiresIn: '5m'
    })
    return token;
  }

  generateRefreshToken(payload: any): string {
    const token = sign(payload, this.secretKey as string, {
      expiresIn: '3d'
    })
    return token;
  }

  refreshToken(token: string): string {
    try {
      const decoded = verify(token, this.secretKey) as { email: string, userId: string }
      const newAccessToken = this.generateAccessToken({ email: decoded.email, userId: decoded.userId })
      return newAccessToken
    } catch (error: any) {
      throw new UnauthorizedException("Your token is invalid!")
    }
  }

  verifyToken(token: string): any {
    try {
      const decoded = verify(token, this.secretKey)
      return decoded
    } catch (error: any) {
      throw new UnauthorizedException("Your token is invalid!")
    }
  }
}