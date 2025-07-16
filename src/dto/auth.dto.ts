import { IsRequiredEmail, IsRequiredString } from "./decorators";

/**
 * @openapi
 * components:
 *   schema:
 *     RegisterUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */
export class RegisterUserDto {
    @IsRequiredString() name: string;
    @IsRequiredEmail() email: string;
    @IsRequiredString() password: string;
}
/**
 * @openapi
 * components:
 *   schema:
 *     LoginUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 */
export class LoginUserDto {
    @IsRequiredString() email: string;
    @IsRequiredString() password: string;
}
/**
 * @openapi
 * components:
 *   schema:
 *     UpdateProfileDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */
export class UpdateProfileDto {
    @IsRequiredString() name: string;
}
