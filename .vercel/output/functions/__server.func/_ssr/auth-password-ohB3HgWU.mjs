//#region node_modules/.nitro/vite/services/ssr/assets/auth-password-ohB3HgWU.js
/** Derive the Better Auth password from ULUX ID + PIN (min length ≫ 8). */
function deriveAuthPassword(uluxId, pin) {
	return `ULUX.v1/${uluxId}/${pin}`;
}
//#endregion
export { deriveAuthPassword as t };
