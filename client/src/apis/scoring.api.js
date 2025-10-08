import SERVER_API from "./server.api.js";

export const assignPointsByTeamCode = `${SERVER_API}/points/assign`;
export const assignPointsByQr = `${SERVER_API}/points/assign-by-qr`;
export const verifyQr = `${SERVER_API}/points/verify-qr`;
export const addPoints = `${SERVER_API}/admin/bulk-update-points`;