import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { deriveAuthPassword } from "@/lib/auth-password";
import { hashPin, isValidPin, verifyPin } from "@/lib/pin.server";
import type { Profile } from "@/lib/types";

type ProfileRow = {
  ulux_id: string;
  email: string;
  nickname: string;
};

function mapProfile(r: ProfileRow): Profile {
  return { uluxId: r.ulux_id, email: r.email, nickname: r.nickname };
}

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select ulux_id, email, nickname from profiles where user_id = ${context.userId} limit 1
    `;
    return rows[0] ? mapProfile(rows[0]) : null;
  });

export const checkUluxId = createServerFn({ method: "POST" })
  .validator((data: { uluxId: string }) => data)
  .handler(async ({ data }) => {
    const id = data.uluxId.trim();
    if (!id) return { available: false };
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from profiles where ulux_id = ${id}
    `;
    return { available: (rows[0]?.n ?? 0) === 0 };
  });

export const resolveLogin = createServerFn({ method: "POST" })
  .validator((data: { uluxId: string; pin: string }) => data)
  .handler(async ({ data }) => {
    const uluxId = data.uluxId.trim();
    const pin = data.pin.trim();
    if (!uluxId || !isValidPin(pin)) {
      return { ok: false as const, error: "帳號或 PIN 不正確" };
    }
    const sql = await getSql();
    const rows = await sql<{ email: string; pin_hash: string }>`
      select email, pin_hash from profiles where ulux_id = ${uluxId} limit 1
    `;
    const row = rows[0];
    if (!row || !verifyPin(pin, row.pin_hash)) {
      return { ok: false as const, error: "帳號或 PIN 不正確" };
    }
    return { ok: true as const, email: row.email };
  });

export const createProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { uluxId: string; pin: string; email: string; nickname: string }) =>
      data,
  )
  .handler(async ({ context, data }) => {
    const uluxId = data.uluxId.trim();
    const pin = data.pin.trim();
    const email = data.email.trim().toLowerCase();
    const nickname = data.nickname.trim();
    if (!uluxId || uluxId.length > 80) throw new Error("請輸入有效的 ID");
    if (!isValidPin(pin)) throw new Error("PIN 須為 4 位數字");
    if (!email || !email.includes("@")) throw new Error("請輸入有效的電子郵件");
    if (!nickname) throw new Error("請輸入暱稱");

    const sql = await getSql();
    const existing = await sql<{ n: number }>`
      select count(*)::int as n from profiles where user_id = ${context.userId}
    `;
    if ((existing[0]?.n ?? 0) > 0) {
      const rows = await sql<ProfileRow>`
        select ulux_id, email, nickname from profiles where user_id = ${context.userId} limit 1
      `;
      return mapProfile(rows[0]);
    }
    const taken = await sql<{ n: number }>`
      select count(*)::int as n from profiles where ulux_id = ${uluxId}
    `;
    if ((taken[0]?.n ?? 0) > 0) throw new Error("這個 ID 已被使用");
    const emailTaken = await sql<{ n: number }>`
      select count(*)::int as n from profiles where lower(email) = ${email} and user_id <> ${context.userId}
    `;
    if ((emailTaken[0]?.n ?? 0) > 0) throw new Error("這個電子郵件已被使用");

    await sql`
      insert into profiles (user_id, ulux_id, pin_hash, email, nickname)
      values (${context.userId}, ${uluxId}, ${hashPin(pin)}, ${email}, ${nickname})
    `;
    return { uluxId, email, nickname } satisfies Profile;
  });

export const updateNickname = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { nickname: string }) => data)
  .handler(async ({ context, data }) => {
    const nickname = data.nickname.trim();
    if (!nickname) throw new Error("請輸入暱稱");
    const sql = await getSql();
    await sql`
      update profiles set nickname = ${nickname}, updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const changePin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { currentPin: string; nextPin: string }) => data)
  .handler(async ({ context, data }) => {
    if (!isValidPin(data.currentPin) || !isValidPin(data.nextPin)) {
      throw new Error("PIN 須為 4 位數字");
    }
    const sql = await getSql();
    const rows = await sql<{ pin_hash: string; ulux_id: string }>`
      select pin_hash, ulux_id from profiles where user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("找不到帳號");
    if (!verifyPin(data.currentPin, row.pin_hash)) {
      throw new Error("目前 PIN 不正確");
    }
    await sql`
      update profiles set pin_hash = ${hashPin(data.nextPin)}, updated_at = now()
      where user_id = ${context.userId}
    `;
    await updateCredentialPassword(
      sql,
      context.userId,
      deriveAuthPassword(row.ulux_id, data.nextPin),
    );
    return { ok: true };
  });

export const recoverRevealId = createServerFn({ method: "POST" })
  .validator((data: { email: string; pin: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const pin = data.pin.trim();
    if (!email || !isValidPin(pin)) {
      return { ok: false as const, error: "資料不正確" };
    }
    const sql = await getSql();
    const rows = await sql<{ ulux_id: string; pin_hash: string }>`
      select ulux_id, pin_hash from profiles where lower(email) = ${email} limit 1
    `;
    const row = rows[0];
    if (!row || !verifyPin(pin, row.pin_hash)) {
      return { ok: false as const, error: "資料不正確" };
    }
    return { ok: true as const, uluxId: row.ulux_id };
  });

export const recoverResetPin = createServerFn({ method: "POST" })
  .validator((data: { email: string; uluxId: string; nextPin: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const uluxId = data.uluxId.trim();
    const nextPin = data.nextPin.trim();
    if (!email || !uluxId || !isValidPin(nextPin)) {
      return { ok: false as const, error: "資料不正確" };
    }
    const sql = await getSql();
    const rows = await sql<{ user_id: string }>`
      select user_id from profiles
      where lower(email) = ${email} and ulux_id = ${uluxId}
      limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false as const, error: "資料不正確" };
    await sql`
      update profiles set pin_hash = ${hashPin(nextPin)}, updated_at = now()
      where user_id = ${row.user_id}
    `;
    await updateCredentialPassword(
      sql,
      row.user_id,
      deriveAuthPassword(uluxId, nextPin),
    );
    return { ok: true as const, uluxId };
  });

async function updateCredentialPassword(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  password: string,
) {
  try {
    const { auth } = await import("@/lib/auth/server");
    const ctx = await auth.$context;
    const hashed = await ctx.password.hash(password);
    await sql.query(
      `update account set password = $1 where "userId" = $2 and "providerId" = 'credential'`,
      [hashed, userId],
    );
  } catch {
    /* OAuth-only accounts have no credential row */
  }
}
