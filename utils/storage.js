import { EncryptedStorage } from '../utils/crypto'

const salt = process.env.NEXT_PUBLIC_SALT
export const encryptedStorage = new EncryptedStorage(salt);