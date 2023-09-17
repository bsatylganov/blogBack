import { body } from "express-validator";

export const loginValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 5}),
]

export const registerValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 5}),
    body('fullName').isLength({ min: 3}),
    body('avatarUrl').optional().isURL(),
]

export const postCreateValidator = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', "Введите текст статьи").isLength({ min: 4}).isString(),
    body('tags', "Неверный формат тэгов (укажите массив)").optional().isString(),
    body('iamgeUrl', "Неверная ссылка на изображение").optional().isString(),
]
 