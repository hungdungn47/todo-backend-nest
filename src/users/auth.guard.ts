import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "./jwtServices/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = this.jwtService.verifyToken(token)
      request['user'] = {
        email: payload.email,
        _id: payload._id
      }
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = (request.headers as Headers & { authorization: string }).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}