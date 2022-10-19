const checkUserType = (token: any) => {
  return token.email?.endsWith('@st.go.tuat.ac.jp') ? 'nokodaisei' : 'general';
}

export default checkUserType