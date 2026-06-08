import { scrypt, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Hashes a plaintext password using PBKDF2/scrypt.
 * Returns salt and hash separated by a colon (salt:hash).
 * @param {string} password Plaintext password
 * @returns {Promise<string>} Promesa que resuelve al hash con formato salt:hash
 */
export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex')
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

/**
 * Verifies a password against a stored hash value.
 * Supports a fallback comparison for plaintext passwords (those that don't contain a colon ':').
 * @param {string} password Plaintext password
 * @param {string} storedValue Hash or plaintext stored in database
 * @returns {Promise<boolean>} Promesa que resuelve a verdadero si coincide
 */
export function verifyPassword(password, storedValue) {
  return new Promise((resolve, reject) => {
    if (!storedValue) return resolve(false)

    // Migración progresiva: si no contiene ':', es texto plano antiguo
    if (!storedValue.includes(':')) {
      return resolve(password === storedValue)
    }

    const [salt, hash] = storedValue.split(':')
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      const keyBuffer = Buffer.from(hash, 'hex')
      resolve(timingSafeEqual(derivedKey, keyBuffer))
    })
  })
}
