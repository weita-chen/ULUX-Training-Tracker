/** Derive the Better Auth password from ULUX ID + PIN (min length ≫ 8). */
export function deriveAuthPassword(uluxId: string, pin: string): string {
  return `ULUX.v1/${uluxId}/${pin}`;
}
