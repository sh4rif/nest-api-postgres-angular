import { SetMetadata } from "@nestjs/common";

export const hasRoles = (...hasRoles: Array<string>) => SetMetadata('roles', hasRoles)