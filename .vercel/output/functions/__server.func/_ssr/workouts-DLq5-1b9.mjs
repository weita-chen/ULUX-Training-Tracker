import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workouts-DLq5-1b9.js
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("eaa1473219507ae27eb825e06e26d95a3e9955a21fc1400f548029f1d4d94b67"));
var calendarMonth = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("6df3220477de98d95c21e5f9a4039fb56c68572011616677d468fe899f17e0d4"));
var getSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("fee2070a6197e5d785793e574a561b95d0382bff30cd93fa9dd91d316626d484"));
var createSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("cc609bca1b547045e9fdb8b7f76b9dbc8aa76cee372b7c30d8290fa3949bfa9f"));
var updateSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("812e9a34fd2b43eaf4d330dcd578563d234fc9a27dbc00907d1ef934aabd2a3e"));
var deleteSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ca816d230be3129b444eee1ae50b3312650c02fa2eaeb88300e151ca0c6e18ad"));
var addEntry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("95b18662077e9689aab50c090aa4a8a629edcb33e4696a1afda9a41430243090"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("0b2dbeec2d555dd33aa953c996f0d1c5992f1eb201dfedaf062b4eae062479a0"));
var deleteEntry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("659d1c3ac5c23e725a85ad151bf8b2faf9d2966cc9d5850e554bc4f859fc25a3"));
var addSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("d88697721d31af0739c1391599153c39246a1fbae419f4d1d52bd7927b8a81f5"));
var updateSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("da717ec953db526ce8ae1a7bee9b11e0203f041f4a62475bce9f68496da3e700"));
var deleteSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("17156c50053c05e1e7806f073246db1a395d6eac56922a2f8aa64e83b2e974d8"));
var recentExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("a336ac7e077e98c313622a6a5553ca31e5c72345f65f3cbf12148e39e1ef9037"));
var lastSetsForExercise = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("d4b9d313f1b9ca6650a534d33e6610d4ced24d716c2dab052dafae063c81db08"));
var lastCompletedSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1b00275aed7d69a52bb322450d73e02fbc0a2150d081dcf10fa464964c2dadc2"));
var openSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("544776ab30dc6636205c7cf60289ca73ecb1448c83a94cd567590d1d8b64c6c1"));
var repeatLastSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("f7cf3355f39e1a8b13522ae080119a1084a95432882c273410603f8edc7c435d"));
var listSessionsByDate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("83fb02dc732218f157bb7aa2d373c6694797ed7411efb07118aaa3bc83515868"));
//#endregion
export { deleteEntry as a, getSession as c, listSessionsByDate as d, openSession as f, updateSet as g, updateSession as h, createSession as i, lastCompletedSession as l, repeatLastSession as m, addSet as n, deleteSession as o, recentExercises as p, calendarMonth as r, deleteSet as s, addEntry as t, lastSetsForExercise as u };
