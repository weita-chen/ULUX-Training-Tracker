import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DyweS9Cg.js
var listCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a585208ea112f484b0549701aef67b535d7880cd990f0bf51831cc0b3e17d1ed"));
var listCustomExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("10ec95520ac0d10c2a0cbd57a88d734c1b0fbc4d3503bb8dd93d97ea4b5ad4e3"));
var createCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("7f5e7a9f82b2145d49a2b6a90be0bf80a3482ce821ca37a5ea040f8fb3ece7a7"));
var updateCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("8bfc7fa6c2c0b8e7956e1f02fe89faf8349d7285c1f376cb4e5ff0029932c155"));
var archiveCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ed2446d0fe7d40bdecffb81b816758991069626980b46f756c25eb4182b91255"));
//#endregion
export { updateCustomExercise as a, listCustomExercises as i, createCustomExercise as n, listCatalog as r, archiveCustomExercise as t };
