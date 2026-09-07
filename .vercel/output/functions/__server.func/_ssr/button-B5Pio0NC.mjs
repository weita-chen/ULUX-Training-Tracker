import "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react, l as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-ink active:scale-[0.98]",
			secondary: "bg-surface text-ink border border-line hover:bg-mist/70",
			ghost: "bg-transparent text-ink hover:bg-mist/80",
			danger: "bg-danger text-paper hover:opacity-90",
			outline: "border border-ink/15 bg-transparent text-ink hover:bg-mist/60"
		},
		size: {
			sm: "h-9 rounded-md px-3 text-sm",
			md: "h-11 rounded-lg px-4 text-[15px]",
			lg: "h-14 rounded-xl px-5 text-base",
			icon: "size-11 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
