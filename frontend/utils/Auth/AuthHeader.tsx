export const AuthHeader = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
