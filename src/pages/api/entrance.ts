import checkUserType from "lib/api/checkUserType"
import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"

// @ts-ignore
const entranceApi = async (req, res) => {
  // @ts-ignore
  const token = await getToken({ req })
  if (token) {
    // Signed in
    const user = await getEntrance(token)
    res.status(200).json(user)
  } else {
    // Not Signed in
    res.status(401)
  }
}

const getEntrance = (token: any) => {
  const { sub } = token;
  const userType = checkUserType(token)
  if (userType === 'nokodaisei') {
    return {
      userType: userType,
      reserved: true,
      eleventh: 1,
      twelfth: 0,
      thirteenth: 2,
    }
  } else {
    return {
      userType: userType,
      reserved: true,
      eleventh: 1,
      twelfth: 1,
      thirteenth: 0,
      accompaniers: 2,
    }
  }
}

export default entranceApi
