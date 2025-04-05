import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify } from "jsonwebtoken";

@Injectable()
export class JwtService {
  private secretKey: string;
  private accessTokenLifetime: string;
  private refreshTokenLifetime: string;
  constructor(private configService: ConfigService) {
    this.secretKey = configService.get<string>("JWT_SECRET") as string
    this.accessTokenLifetime = configService.get<string>("ACCESS_TOKEN_LIFETIME") as string
    this.refreshTokenLifetime = configService.get<string>("REFRESH_TOKEN_LIFETIME") as string
  }
  generateAccessToken(payload: any): string {
    const token = sign(payload, this.secretKey as string, {
      expiresIn: parseInt(this.accessTokenLifetime)
    })
    return token;
  }

  generateRefreshToken(payload: any): string {
    const token = sign(payload, this.secretKey as string, {
      expiresIn: parseInt(this.refreshTokenLifetime)
    })
    return token;
  }

  refreshToken(token: string): string {
    try {
      const decoded = verify(token, this.secretKey) as { email: string, _id: string }
      const newAccessToken = this.generateAccessToken({ email: decoded.email, _id: decoded._id })
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