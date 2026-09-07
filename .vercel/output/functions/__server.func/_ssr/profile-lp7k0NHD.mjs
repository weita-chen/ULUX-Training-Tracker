import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { r as getSql } from "./db-DFFg8ioj.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as deriveAuthPassword } from "./auth-password-ohB3HgWU.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-lp7k0NHD.js
function hashPin(pin) {
	const salt = randomBytes(16).toString("hex");
	return `${salt}:${scryptSync(pin, salt, 32).toString("hex")}`;
}
function verifyPin(pin, stored) {
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;
	const next = scryptSync(pin, salt, 32);
	const prev = Buffer.from(hash, "hex");
	if (prev.length !== next.length) return false;
	return timingSafeEqual(prev, next);
}
function isValidPin(pin) {
	return /^\d{4}$/.test(pin);
}
function mapProfile(r) {
	return {
		uluxId: r.ulux_id,
		email: r.email,
		nickname: r.nickname
	};
}
var getProfile_createServerFn_handler = createServerRpc({
	id: "6641c1735f814518ed5ef6d0b74ce51becfe0097aeab478bdf0b893bdf2c56f6",
	name: "getProfile",
	filename: "src/lib/api/profile.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getProfile_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql())`
      select ulux_id, email, nickname from profiles where user_id = ${context.userId} limit 1
    `;
	return rows[0] ? mapProfile(rows[0]) : null;
});
var checkUluxId_createServerFn_handler = createServerRpc({
	id: "44b8b425d76951c1c24ed70e963c859130420d97e43139581b24e5baa08db6b4",
	name: "checkUluxId",
	filename: "src/lib/api/profile.ts"
}, (opts) => checkUluxId.__executeServer(opts));
var checkUluxId = createServerFn({ method: "POST" }).validator((data) => data).handler(checkUluxId_createServerFn_handler, async ({ data }) => {
	const id = data.uluxId.trim();
	if (!id) return { available: false };
	return { available: ((await (await getSql())`
      select count(*)::int as n from profiles where ulux_id = ${id}
    `)[0]?.n ?? 0) === 0 };
});
var resolveLogin_createServerFn_handler = createServerRpc({
	id: "ab45df7b2e5f061a449545655613125441f3e5a692e45072423fd05542461fe8",
	name: "resolveLogin",
	filename: "src/lib/api/profile.ts"
}, (opts) => resolveLogin.__executeServer(opts));
var resolveLogin = createServerFn({ method: "POST" }).validator((data) => data).handler(resolveLogin_createServerFn_handler, async ({ data }) => {
	const uluxId = data.uluxId.trim();
	const pin = data.pin.trim();
	if (!uluxId || !isValidPin(pin)) return {
		ok: false,
		error: "帳號或 PIN 不正確"
	};
	const row = (await (await getSql())`
      select email, pin_hash from profiles where ulux_id = ${uluxId} limit 1
    `)[0];
	if (!row || !verifyPin(pin, row.pin_hash)) return {
		ok: false,
		error: "帳號或 PIN 不正確"
	};
	return {
		ok: true,
		email: row.email
	};
});
var createProfile_createServerFn_handler = createServerRpc({
	id: "2cead88808f551b6861faf8e4caeccdddb2085136e298624922bc27171332b57",
	name: "createProfile",
	filename: "src/lib/api/profile.ts"
}, (opts) => createProfile.__executeServer(opts));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createProfile_createServerFn_handler, async ({ context, data }) => {
	const uluxId = data.uluxId.trim();
	const pin = data.pin.trim();
	const email = data.email.trim().toLowerCase();
	const nickname = data.nickname.trim();
	if (!uluxId || uluxId.length > 80) throw new Error("請輸入有效的 ID");
	if (!isValidPin(pin)) throw new Error("PIN 須為 4 位數字");
	if (!email || !email.includes("@")) throw new Error("請輸入有效的電子郵件");
	if (!nickname) throw new Error("請輸入暱稱");
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n from profiles where user_id = ${context.userId}
    `)[0]?.n ?? 0) > 0) return mapProfile((await sql`
        select ulux_id, email, nickname from profiles where user_id = ${context.userId} limit 1
      `)[0]);
	if (((await sql`
      select count(*)::int as n from profiles where ulux_id = ${uluxId}
    `)[0]?.n ?? 0) > 0) throw new Error("這個 ID 已被使用");
	if (((await sql`
      select count(*)::int as n from profiles where lower(email) = ${email} and user_id <> ${context.userId}
    `)[0]?.n ?? 0) > 0) throw new Error("這個電子郵件已被使用");
	await sql`
      insert into profiles (user_id, ulux_id, pin_hash, email, nickname)
      values (${context.userId}, ${uluxId}, ${hashPin(pin)}, ${email}, ${nickname})
    `;
	return {
		uluxId,
		email,
		nickname
	};
});
var updateNickname_createServerFn_handler = createServerRpc({
	id: "4041e66b47c1eaa5d26bc462c6505844adc3dfab1f3f994e672c82916fa4f277",
	name: "updateNickname",
	filename: "src/lib/api/profile.ts"
}, (opts) => updateNickname.__executeServer(opts));
var updateNickname = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateNickname_createServerFn_handler, async ({ context, data }) => {
	const nickname = data.nickname.trim();
	if (!nickname) throw new Error("請輸入暱稱");
	await (await getSql())`
      update profiles set nickname = ${nickname}, updated_at = now()
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var changePin_createServerFn_handler = createServerRpc({
	id: "a2c672fba354b1ea1d2c09ea854608baf46afd88b99f37abe89deadf197f2280",
	name: "changePin",
	filename: "src/lib/api/profile.ts"
}, (opts) => changePin.__executeServer(opts));
var changePin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(changePin_createServerFn_handler, async ({ context, data }) => {
	if (!isValidPin(data.currentPin) || !isValidPin(data.nextPin)) throw new Error("PIN 須為 4 位數字");
	const sql = await getSql();
	const row = (await sql`
      select pin_hash, ulux_id from profiles where user_id = ${context.userId} limit 1
    `)[0];
	if (!row) throw new Error("找不到帳號");
	if (!verifyPin(data.currentPin, row.pin_hash)) throw new Error("目前 PIN 不正確");
	await sql`
      update profiles set pin_hash = ${hashPin(data.nextPin)}, updated_at = now()
      where user_id = ${context.userId}
    `;
	await updateCredentialPassword(sql, context.userId, deriveAuthPassword(row.ulux_id, data.nextPin));
	return { ok: true };
});
var recoverRevealId_createServerFn_handler = createServerRpc({
	id: "153ecc8e9554311059af5e07c10effb0611341badf24d1d7ca6d63c88d659d25",
	name: "recoverRevealId",
	filename: "src/lib/api/profile.ts"
}, (opts) => recoverRevealId.__executeServer(opts));
var recoverRevealId = createServerFn({ method: "POST" }).validator((data) => data).handler(recoverRevealId_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const pin = data.pin.trim();
	if (!email || !isValidPin(pin)) return {
		ok: false,
		error: "資料不正確"
	};
	const row = (await (await getSql())`
      select ulux_id, pin_hash from profiles where lower(email) = ${email} limit 1
    `)[0];
	if (!row || !verifyPin(pin, row.pin_hash)) return {
		ok: false,
		error: "資料不正確"
	};
	return {
		ok: true,
		uluxId: row.ulux_id
	};
});
var recoverResetPin_createServerFn_handler = createServerRpc({
	id: "9868c829dd91b0723c6083668a807c7738523407c7864b272cf9a1a61a3d5b4b",
	name: "recoverResetPin",
	filename: "src/lib/api/profile.ts"
}, (opts) => recoverResetPin.__executeServer(opts));
var recoverResetPin = createServerFn({ method: "POST" }).validator((data) => data).handler(recoverResetPin_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const uluxId = data.uluxId.trim();
	const nextPin = data.nextPin.trim();
	if (!email || !uluxId || !isValidPin(nextPin)) return {
		ok: false,
		error: "資料不正確"
	};
	const sql = await getSql();
	const row = (await sql`
      select user_id from profiles
      where lower(email) = ${email} and ulux_id = ${uluxId}
      limit 1
    `)[0];
	if (!row) return {
		ok: false,
		error: "資料不正確"
	};
	await sql`
      update profiles set pin_hash = ${hashPin(nextPin)}, updated_at = now()
      where user_id = ${row.user_id}
    `;
	await updateCredentialPassword(sql, row.user_id, deriveAuthPassword(uluxId, nextPin));
	return {
		ok: true,
		uluxId
	};
});
async function updateCredentialPassword(sql, userId, password) {
	try {
		const { auth } = await import("./server-BFt31BGu.mjs").then((n) => n.r);
		const hashed = await (await auth.$context).password.hash(password);
		await sql.query(`update account set password = $1 where "userId" = $2 and "providerId" = 'credential'`, [hashed, userId]);
	} catch {}
}
//#endregion
export { changePin_createServerFn_handler, checkUluxId_createServerFn_handler, createProfile_createServerFn_handler, getProfile_createServerFn_handler, recoverResetPin_createServerFn_handler, recoverRevealId_createServerFn_handler, resolveLogin_createServerFn_handler, updateNickname_createServerFn_handler };
