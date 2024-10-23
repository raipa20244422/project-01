import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  organizationId: number
}

export function getOrganizationIdFromJWT(): number | null {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return null
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as JWTPayload

    return decodedToken.organizationId || null
  } catch (error) {
    return null
  }
}
