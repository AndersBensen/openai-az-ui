import { EncryptedStorage } from '../utils/crypto'

const sec = process.env.NEXT_PUBLIC_SEC
export const encryptedStorage = new EncryptedStorage(sec);