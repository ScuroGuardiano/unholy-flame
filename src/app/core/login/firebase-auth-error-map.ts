const firebaseAuthErrorMap: { [key: string]: string } = {
  'auth/invalid-email': "Invalid email or password",
  'auth/user-disabled': "User is like you - disabled",
  'auth/user-not-found': "Invalid email or password",
  'auth/wrong-password': "Invalid email or password"
}

export default firebaseAuthErrorMap;
