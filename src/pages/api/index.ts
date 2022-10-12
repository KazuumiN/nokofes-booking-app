import checkUserType from "lib/api/checkUserType"
import { getToken } from "next-auth/jwt"

// @ts-ignore
const indexApi = async (req, res) => {
  // @ts-ignore
  const token = await getToken({ req })
  if (token) {
    // Signed in
    const user = await getId(token)
    res.status(200).json(user)
  } else {
    // Not Signed in
    res.status(401)
  }
}

const getId = (token: any) => {
  const { sub } = token;
  const userType = checkUserType(token)
  const numberId = '12345678' // TODO: get id from sub
  const longerId = 'abcdefgh12345678' // TODO: get longerId from sub
  const entranceReserved = true
  const shoppingReserved = false
  return {
    numberId,
    longerId,
    userType,
    entranceReserved,
    shoppingReserved,
  }
}

export default indexApi
