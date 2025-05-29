import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { UserRole, Permission } from '@everapharm/database'

// Current User Decorator
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)

// Roles Decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles)

// Permissions Decorator
export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions)

// Public Route Decorator (bypasses auth)
export const Public = () => SetMetadata('isPublic', true)