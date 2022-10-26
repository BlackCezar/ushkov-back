import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import {AuthGuard} from '@nestjs/passport'

export class AtGard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass()
    ])

    return isPublic ? true : super.canActivate(context)
  }
}