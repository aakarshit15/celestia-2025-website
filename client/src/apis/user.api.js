import SERVER_API, { DEV_TUNNEL_API } from "./server.api.js";

export const adminLogin = `${SERVER_API}/admin/login`;
export const subtractPoints = `${SERVER_API}/admin/subtract-points`;
export const changePoints = `${SERVER_API}/admin/change-points`;
export const teamRegister = `${DEV_TUNNEL_API}/participants/register`;
export const participantLogin = `${SERVER_API}/participants/login`;
