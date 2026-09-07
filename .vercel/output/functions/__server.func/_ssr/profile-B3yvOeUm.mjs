import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-B3yvOeUm.js
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6641c1735f814518ed5ef6d0b74ce51becfe0097aeab478bdf0b893bdf2c56f6"));
var checkUluxId = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("44b8b425d76951c1c24ed70e963c859130420d97e43139581b24e5baa08db6b4"));
var resolveLogin = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ab45df7b2e5f061a449545655613125441f3e5a692e45072423fd05542461fe8"));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2cead88808f551b6861faf8e4caeccdddb2085136e298624922bc27171332b57"));
var updateNickname = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4041e66b47c1eaa5d26bc462c6505844adc3dfab1f3f994e672c82916fa4f277"));
var changePin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("a2c672fba354b1ea1d2c09ea854608baf46afd88b99f37abe89deadf197f2280"));
var recoverRevealId = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("153ecc8e9554311059af5e07c10effb0611341badf24d1d7ca6d63c88d659d25"));
var recoverResetPin = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9868c829dd91b0723c6083668a807c7738523407c7864b272cf9a1a61a3d5b4b"));
//#endregion
export { recoverResetPin as a, updateNickname as c, getProfile as i, checkUluxId as n, recoverRevealId as o, createProfile as r, resolveLogin as s, changePin as t };
