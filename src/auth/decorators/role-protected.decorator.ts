import { SetMetadata } from '@nestjs/common';
import { VALID_ROLES } from 'src/auth/interfaces/valid-roles';

export const META_ROLES = 'role';

export const RoleProtected = (...args: VALID_ROLES[]) => {
    return SetMetadata(META_ROLES, args);
}
