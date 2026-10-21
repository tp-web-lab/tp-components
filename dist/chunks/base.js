import { dedent as e } from "../utilities/code.js";
import { ensureCodeBlockCopyButtons as t } from "../utilities/code-block-copy.js";
import { createHelpButtonTable as n } from "../utilities/help-buttons.js";
import { formatHelpKeyboard as r } from "../utilities/help-keyboard.js";
//#region src/components/base/base.css?inline
var i = ":root,.tp-light,.tp-dark{--tp-color-success:var(--tp-success-fill-mid);--tp-color-danger:var(--tp-danger-fill-mid);--tp-color-warning:var(--tp-warning-fill-mid);--tp-color-info:var(--tp-info-fill-mid,var(--tp-brand-fill-mid));--tp-color-neutral:var(--tp-neutral-fill-mid);--tp-color-brand:var(--tp-brand-fill-mid);--tp-radius-s:var(--tp-border-radius-lg,.5rem);--tp-radius-pill:var(--tp-border-radius-pill,999px);--tp-focus-ring-inner:var(--tp-background-color,Canvas)}:where([data-tp-base-host]){box-sizing:border-box;min-inline-size:0}:where([data-tp-base-host]),:where([data-tp-base-host]) *,:where([data-tp-base-host]) :before,:where([data-tp-base-host]) :after{box-sizing:inherit}:where([data-tp-base-host] [hidden]){display:none!important}:where([data-tp-base-host] dl),:where([data-tp-base-host] dt),:where([data-tp-base-host] dd){margin:0;padding:0}:where([data-tp-base-host] button),:where([data-tp-base-host] input),:where([data-tp-base-host] select),:where([data-tp-base-host] textarea){font:inherit}:where([data-tp-base-host] textarea){box-sizing:border-box;field-sizing:content;inline-size:100%;max-inline-size:100%;margin-inline:0;display:block}:where([data-tp-base-host] img),:where([data-tp-base-host] svg),:where([data-tp-base-host] canvas),:where([data-tp-base-host] video){max-inline-size:100%;display:block}:where([data-tp-base-host] mjx-container>svg),:where([data-tp-base-host] .MathJax_SVG>svg){max-width:none;max-inline-size:none;display:inline-block}:where([data-tp-base-host] .tp-visually-hidden){clip-path:inset(50%);white-space:nowrap;border:0;block-size:1px;inline-size:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}body{margin-block:0;margin-inline:.5rem}p{margin:0 0 .5rem}dt{font-weight:600}dd{margin:0 0 .5rem 1rem}:is(tp-radio-list,tp-checkbox-list)>:is(ul,ol)>li:has(>label>:is(input[data-tp-radio-list-input],input[data-tp-checkbox-list-input]):enabled):is(:hover,:has(>label>input:focus-visible)){background-color:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft)}.tp-component-help{gap:var(--tp-content-spacing);padding:calc(var(--tp-content-spacing) / 2);min-inline-size:0;display:grid}.tp-component-help-preview{contain:layout paint;padding:calc(var(--tp-content-spacing) / 2);max-block-size:55vh;min-inline-size:0;display:flow-root;overflow:auto}.tp-component-help-preview>:is([fullscreen],[full-window]){block-size:24rem;inline-size:100%;position:relative}details{border:1px solid var(--tp-brand-fill-soft);border-radius:.5em;padding-block-end:0;padding-inline:.75em;display:flow-root}details[open]{padding-block-end:.75em;padding-inline:0}details[open]>:not(summary){padding-inline:.75em}details:not([open]){padding-inline:0}details:not([open])>summary,details[open]>summary{cursor:pointer;background-color:var(--tp-brand-fill-softer);margin-bottom:0;padding-block:.5em;font-weight:600}details>summary{padding-inline:.75em 2em}details>summary>*{vertical-align:middle;margin-inline:.35em}details.tp-game-rules>:is(summary,p){padding-inline-start:.75rem}", a = "@layer tp-reset{html{box-sizing:border-box}*,:before,:after{box-sizing:inherit}html,body{background-color:var(--tp-background-color);color:var(--tp-text-body);font-weight:var(--tp-font-weight-normal);font-size:var(--tp-font-size);line-height:var(--tp-line-height);font-family:var(--tp-font-family);text-rendering:optimizelegibility;scrollbar-color:var(--tp-neutral-fill-mid) transparent;tab-size:4;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;margin:0;padding:0}:where(.tp-light,.tp-dark){background-color:var(--tp-background-color);color:var(--tp-text-body)}:where(.tp-light,.tp-dark) :where(p,span,strong,em,small,li,dt,dd,ol,ul,dl,section,article,aside,main,header,footer,nav):not(.tp-light):not(.tp-dark){color:inherit}::selection{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);text-shadow:none!important}address,audio,blockquote,dd,details,dl,fieldset,figure,iframe,ol,pre,table,ul,video{margin:0}:is(address,audio,blockquote,dd,details,dl,fieldset,figure,iframe,ol,pre,table,ul,video):not(:last-child){margin-block-end:var(--tp-content-spacing)}:is(address,audio,blockquote,dd,details,dl,fieldset,figure,iframe,ol,pre,table,ul,video)>:last-child{margin-block-end:0}h1,h2,h3,h4,h5,h6,.tp-h1,.tp-h2,.tp-h3,.tp-h4,.tp-h5,.tp-h6{font-weight:var(--tp-font-weight-bold);line-height:1.3;font-family:var(--tp-font-family-heading);text-wrap:balance;overflow-wrap:break-word;margin:0;display:flow-root}:is(h1,h2,h3,h4,h5,h6,.tp-h1,.tp-h2,.tp-h3,.tp-h4,.tp-h5,.tp-h6):not(:first-child){margin-block-start:var(--tp-content-spacing)}:is(h1,h2,h3,h4,h5,h6,.tp-h1,.tp-h2,.tp-h3,.tp-h4,.tp-h5,.tp-h6):not(:last-child){margin-block-end:calc(var(--tp-content-spacing) / 4)}h1,h2{color:var(--tp-brand-text-colorful);border-bottom:1px solid var(--tp-brand-text-colorful)}h1,.tp-h1{font-size:2.488rem}h2,.tp-h2{font-size:2.074rem}h3,.tp-h3{font-size:1.728rem}h4,.tp-h4{font-size:1.44rem}h5,.tp-h5{font-size:1.2rem}h6,.tp-h6{font-size:1.125rem}p{text-wrap:pretty;overflow-wrap:break-word;margin-block:0}p:not(:last-child){margin-block:0 var(--tp-content-spacing)}blockquote{padding:calc(var(--tp-content-spacing) / 1.5) var(--tp-content-spacing);border-left:var(--tp-border-style) calc(var(--tp-border-width) * 4) var(--tp-neutral-stroke-softer);color:var(--tp-text-muted);font-size:1.125em;position:relative}q,cite{font-style:normal}q{quotes:\"“\" \"”\" \"‘\" \"’\"}cite{font-style:italic}hr{margin:calc(var(--tp-content-spacing) * 2) 0;border:none;border-top:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer)}img,iframe,picture,video,canvas{border-radius:var(--tp-border-radius-md);width:100%;max-width:100%;display:block}iframe{aspect-ratio:9/6;border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer);background-color:var(--tp-background-color);width:100%}a{color:var(--tp-primary-text-colorful);font-weight:var(--tp-font-weight-semibold);text-underline-offset:.125em;text-decoration-thickness:.0625em;transition:color .15s}@media (hover:hover){a:hover{color:color-mix(in oklab, var(--tp-primary-text-colorful), black 10%)}}:is(a,button):focus-visible{outline:var(--tp-focus-ring);outline-offset:var(--tp-focus-offset)}a code,a pre{background-color:inherit;color:inherit}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted;-webkit-text-decoration-color:var(--tp-neutral-fill-mid);text-decoration-color:var(--tp-neutral-fill-mid);text-underline-offset:.125em;cursor:help;text-decoration-thickness:.09375em}del{text-decoration-style:solid;-webkit-text-decoration-color:var(--tp-destructive-fill-mid);text-decoration-color:var(--tp-destructive-fill-mid);text-decoration-thickness:.09375em}ins{text-decoration-style:solid;-webkit-text-decoration-color:var(--tp-constructive-fill-mid);text-decoration-color:var(--tp-constructive-fill-mid);text-underline-offset:.125em;text-decoration-thickness:.09375em}kbd{border:solid max(1px, .0715em) var(--tp-neutral-fill-soft);border-radius:var(--tp-border-radius-sm);box-shadow:0 max(1px, .0715em) 0 0 var(--tp-neutral-fill-soft);font:inherit;letter-spacing:.0625em;vertical-align:baseline;padding:.2125em .33em;font-size:.9375em}mark{border-radius:0;border-radius:var(--tp-border-radius-sm);color:inherit;background-color:oklab(88.866% -.037947 .181897/.25);padding:.125em .25em}small{color:var(--tp-text-muted);font-size:.875em}strong{font-weight:var(--tp-font-weight-bold)}u{text-underline-offset:.125em;text-decoration-thickness:.09375em}code,samp,tt,span.docutils.literal{color:var(--tp-brand-text-colorful);font-size:.875em;font-weight:500;font-family:var(--tp-font-family-code);tab-size:2;padding:.125em .25em}a:has(code,samp,tt,pre,span.docutils.literal){font-weight:inherit}pre{border-radius:var(--tp-border-radius-md);background:var(--tp-neutral-fill-softer);color:var(--tp-neutral-text-on-soft);font-size:.9375rem;font-family:var(--tp-font-family-code);tab-size:2;padding:2px;position:relative}pre code,pre samp,pre tt,pre span.docutils.literal{color:inherit}pre code{font-size:inherit}.hljs{color:var(--tp-syntax-foreground,#d4d4d4);background:0 0;display:block;overflow-x:auto}.hljs-subst{color:var(--tp-syntax-foreground,#d4d4d4)}.hljs-comment,.hljs-quote{color:var(--tp-syntax-token-comment,#6a9955);font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-name,.hljs-meta .hljs-keyword{color:var(--tp-syntax-token-keyword,#569cd6)}.hljs-string,.hljs-attr,.hljs-addition,.hljs-regexp,.hljs-template-tag,.hljs-template-variable{color:var(--tp-syntax-token-string,#ce9178)}.hljs-number,.hljs-symbol,.hljs-bullet{color:var(--tp-syntax-token-number,#b5cea8)}.hljs-variable,.hljs-params,.hljs-selector-class,.hljs-selector-id{color:var(--tp-syntax-token-variable,#9cdcfe)}.hljs-property,.hljs-attribute,.hljs-tag,.hljs-selector-attr,.hljs-selector-pseudo{color:var(--tp-syntax-token-property,#9cdcfe)}.hljs-type,.hljs-class .hljs-title,.hljs-title.class_{color:var(--tp-syntax-token-type,#4ec9b0)}.hljs-title,.hljs-title.function_,.hljs-function .hljs-title{color:var(--tp-syntax-token-function,#dcdcaa)}.hljs-link{color:var(--tp-syntax-token-link,#4fc1ff);text-decoration:underline}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:var(--tp-font-weight-bold)}ul,ol{margin-inline-start:1.1em;padding:0}ul li{list-style-type:disc}li>ol,li>ul{margin-inline-start:1.25em}ul ul,ol ol{margin-block-end:0}figure{padding:calc(var(--tp-content-spacing) / 2);border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer);border-radius:var(--tp-border-radius-md);box-shadow:var(--tp-shadow-softer)}figcaption{padding-block-start:calc(var(--tp-content-spacing) / 2)}dt{font-weight:var(--tp-font-weight-bold)}dd:not(:last-of-type){margin-block-end:calc(var(--tp-content-spacing) / 2)}details{padding-inline:calc(var(--tp-content-spacing) / 2);border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer);border-radius:var(--tp-border-radius-md);background-color:var(--tp-paper-color);box-shadow:var(--tp-shadow-softer)}details[open]{padding-block-end:calc(var(--tp-content-spacing) / 2)}details[open]>summary:before{rotate:90deg}details summary{font-weight:var(--tp-font-weight-bold);text-wrap:balance;font-size:.9375em}details summary:focus{outline:none}details[open]>summary{border-bottom:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer);margin-block-end:calc(var(--tp-content-spacing) / 2);padding-block-end:calc(var(--tp-content-spacing) / 2)}details:has(summary:focus-visible){outline:var(--tp-focus-ring);outline-offset:var(--tp-focus-offset)}details>:first-child{margin-block-start:0}details+details{margin-block-start:calc(var(--tp-content-spacing) / -1.5)}summary{cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;min-block-size:1.5em;margin-block:0;margin-inline:0;padding-block:.5rem;padding-inline:0 2em;display:flex;position:relative}summary~*{margin-block-start:0}summary:before{transform-origin:50%;content:\"\";width:1em;height:1em;color:var(--tp-text-body);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 6l6 6l-6 6' /%3E%3C/svg%3E\");background-position:50%;background-repeat:no-repeat;background-size:1.25em;transition:rotate 50ms;position:absolute;top:50%;right:.25em;translate:0 -50%}summary::-webkit-details-marker{display:none}.tp-dark summary:before{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ddd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 6l6 6l-6 6' /%3E%3C/svg%3E\")}table{border-spacing:0;width:100%;font-size:.9375rem}table caption{color:var(--tp-text-muted);caption-side:bottom;margin-block-start:1em;font-size:.9375em}thead th,thead td,tr:not(:last-of-type) th,tr:not(:last-of-type) td{border-bottom:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer)}tfoot th,tfoot td{border-top:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer)}th,td[scope],tfoot td{font-weight:var(--tp-font-weight-bold)}th,td{font-variant-numeric:tabular-nums;text-align:start;padding:.75em}table.tp-striped tbody tr:nth-child(2n){background-color:color-mix(in oklab, var(--tp-neutral-fill-softer), transparent 50%)}input,button,textarea,select{font:inherit}label{max-width:fit-content;font-weight:var(--tp-font-weight-semibold);line-height:1.2;display:inline-block}label:has(~input,~select,~textarea){margin-block-end:.25em}label.tp-xs{font-size:var(--tp-form-control-font-size-xs)}label.tp-sm{font-size:var(--tp-form-control-font-size-sm)}label.tp-md{font-size:var(--tp-form-control-font-size-md)}label.tp-lg{font-size:var(--tp-form-control-font-size-lg)}label.tp-xl{font-size:var(--tp-form-control-font-size-xl)}fieldset{border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-softer);border-radius:var(--tp-border-radius-md);margin:0;padding:1.5rem}fieldset:not(:last-child){margin-block-end:var(--tp-content-spacing)}legend{font-weight:var(--tp-font-weight-semibold);font-size:.9375em}input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea{appearance:none;width:100%;min-height:calc(var(--tp-form-control-height-md) - var(--tp-border-width) * 2);border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-sm);background-color:var(--tp-paper-color);color:var(--tp-text-body);font-size:var(--tp-form-control-font-size-md);padding-inline:.75em;display:block}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-xs{min-height:var(--tp-form-control-height-xs);font-size:var(--tp-form-control-font-size-xs)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-sm{min-height:var(--tp-form-control-height-sm);font-size:var(--tp-form-control-font-size-sm)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-md{min-height:var(--tp-form-control-height-md);font-size:var(--tp-form-control-font-size-md)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-lg{min-height:var(--tp-form-control-height-lg);font-size:var(--tp-form-control-font-size-lg)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-xl{min-height:var(--tp-form-control-height-xl);font-size:var(--tp-form-control-font-size-xl)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-filled{border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-fill-softer);border-radius:var(--tp-border-radius-sm);background-color:var(--tp-neutral-fill-softer)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-filled:not(textarea){padding:0 .75em}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea).tp-pill:not(textarea){border-radius:var(--tp-border-radius-pill);padding-inline:1em}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):focus{outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):focus-visible{outline:var(--tp-border-style) calc(var(--tp-border-width) + 1px) var(--tp-focus-color);outline-offset:calc(-1 * var(--tp-border-width))}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::placeholder{color:var(--tp-form-control-placeholder-color);-webkit-user-select:none;user-select:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):-webkit-autofill{-webkit-text-fill-color:var(--tp-primary-text-colorful)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):-webkit-autofill:hover{-webkit-text-fill-color:var(--tp-primary-text-colorful)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):-webkit-autofill:focus{-webkit-text-fill-color:var(--tp-primary-text-colorful)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea):-webkit-autofill:active{-webkit-text-fill-color:var(--tp-primary-text-colorful)}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-search-decoration{-webkit-appearance:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-search-cancel-button{-webkit-appearance:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-search-results-button{-webkit-appearance:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-search-results-decoration{-webkit-appearance:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]{padding:0 .25em}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]::-webkit-color-swatch-wrapper{padding:.25em 0}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]::-webkit-color-swatch{border-radius:var(--tp-border-radius-sm);border:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]::-moz-color-swatch{border-radius:var(--tp-border-radius-sm);height:calc(100% - .5em);padding:0}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]::-moz-focus-inner{border-radius:var(--tp-border-radius-sm);height:calc(100% - .5em);padding:0}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=color]:-moz-focus-inner{padding:0}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=number]::-webkit-inner-spin-button{width:1em;height:2em}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-year-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-month-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-week-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-day-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-ampm-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-meridiem-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-hour-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-millisecond-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-minute-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)::-webkit-datetime-edit-second-field:focus{background-color:var(--tp-selection-background-color);color:var(--tp-selection-color);outline:none}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=date],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=datetime-local],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=month],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=time],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=week]{appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round' style='color: %23a3a6b5;'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z' /%3E%3Cpath d='M16 3v4' /%3E%3Cpath d='M8 3v4' /%3E%3Cpath d='M4 11h16' /%3E%3Cpath d='M11 15h1' /%3E%3Cpath d='M12 15v3' /%3E%3C/svg%3E\");background-position:calc(100% - .75em);background-repeat:no-repeat;background-size:1.25em;align-items:center;width:100%;display:inline-flex}:is(:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=date],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=datetime-local],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=month],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=time],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=week])::-webkit-calendar-picker-indicator{display:none}:is(:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=date],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=datetime-local],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=month],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=time],:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=week])::-webkit-date-and-time-value{text-align:start}:is(input:not([type=checkbox],[type=radio],[type=range],[type=file]),select,textarea)[type=time]{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='color: %23a3a6b5;'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' /%3E%3Cpath d='M12 12l3 2' /%3E%3Cpath d='M12 7v5' /%3E%3C/svg%3E\")}@-moz-document url-prefix(){input[type=date],input[type=datetime-local],input[type=month],input[type=week]{background-image:none!important}}input[type=range]{appearance:none;cursor:pointer;background:0 0;width:100%;margin:.5em 0}input[type=range]:disabled{cursor:not-allowed;opacity:.5}input[type=range]:focus{outline:none}input[type=range]::-webkit-slider-runnable-track{border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-soft);height:.75em}input[type=range]::-moz-range-track{border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-soft);height:.75em}input[type=range]::-webkit-slider-thumb{appearance:none;border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-fill-mid);border-radius:var(--tp-border-radius-circle);background-color:#fff;width:1.4em;height:1.4em;margin-top:-.325em}input[type=range]::-moz-range-thumb{border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-fill-mid);border-radius:var(--tp-border-radius-circle);background-color:#fff;width:1.4em;height:1.4em}input[type=range]:focus::-webkit-slider-thumb{outline:var(--tp-focus-ring);outline-offset:calc(var(--tp-focus-offset) * 2)}input[type=range]:focus::-moz-range-thumb{outline:var(--tp-focus-ring);outline-offset:calc(var(--tp-focus-offset) * 2)}input[type=range]::-moz-range-progress{border-radius:var(--tp-border-radius-md);background-color:var(--tp-primary-fill-mid);height:.75em}meter{appearance:none;border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-softer);width:100%;height:1.25em;box-shadow:var(--tp-inset-shadow-soft);transition:all .3s linear;display:block;overflow:hidden}meter::-webkit-meter-bar{appearance:none;border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-softer);width:100%;height:1.25em;box-shadow:var(--tp-inset-shadow-soft);transition:all .3s linear;display:block;overflow:hidden}meter::-webkit-meter-optimum-value{background:#5dbb54;transition:inherit}:-moz-meter-optimum::-moz-meter-bar{background:#5dbb54;transition:inherit}meter::-webkit-meter-suboptimum-value{background:#e89a26;transition:inherit}:-moz-meter-sub-optimum::-moz-meter-bar{background:#e89a26;transition:inherit}meter::-webkit-meter-even-less-good-value{background:#ee5655;transition:inherit}:-moz-meter-sub-sub-optimum::-moz-meter-bar{background:#ee5655;transition:inherit}progress{appearance:none;border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-softer);width:100%;height:1.25em;box-shadow:var(--tp-inset-shadow-soft);border:none;display:block;overflow:hidden}progress::-webkit-progress-bar{appearance:none;border-radius:var(--tp-border-radius-pill);background:var(--tp-neutral-fill-softer);width:100%;height:1.25em;box-shadow:var(--tp-inset-shadow-soft);border:none;display:block;overflow:hidden}progress[value]::-webkit-progress-value{background:0 0;background-color:var(--tp-primary-fill-mid);transition:width .3s}progress[value]::-moz-progress-bar{background:0 0;background-color:var(--tp-primary-fill-mid);transition:width .3s}progress:indeterminate{appearance:none;background-image:linear-gradient(to right, var(--tp-primary-fill-mid) 30%, var(--tp-neutral-fill-softer) 30%);background-position:0 0;background-repeat:no-repeat;background-size:150% 150%;background-color:var(--tp-neutral-fill-softer)}progress:indeterminate::-webkit-progress-bar{background-color:#0000}progress:indeterminate::-moz-progress-bar{background-color:#0000}@keyframes tp-progress-indeterminate{0%{background-position:200% 0}to{background-position:-200% 0}}progress:indeterminate{animation:1.5s linear infinite tp-progress-indeterminate}textarea{box-sizing:border-box;resize:vertical;field-sizing:content;max-width:100%;margin-inline:0;padding-block:.7em}textarea.tp-xs{padding-block:.2em}textarea.tp-sm{padding-block:.35em}textarea.tp-md{padding-block:.7em}textarea.tp-lg{padding-block:.5em}textarea.tp-xl{padding-block:.55em}select:not([multiple]){background-image:url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-selector'%3e%3cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3e%3cpath d='M8 9l4 -4l4 4' /%3e%3cpath d='M16 15l-4 4l-4 -4' /%3e%3c/svg%3e\");background-position:right .75em top 50%;background-repeat:no-repeat;background-size:1.25em;padding-inline-end:2.5em}.tp-dark select:not([multiple]){background-image:url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-selector'%3e%3cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3e%3cpath d='M8 9l4 -4l4 4' /%3e%3cpath d='M16 15l-4 4l-4 -4' /%3e%3c/svg%3e\")}button,a.tp-button{appearance:none;width:auto;min-height:var(--tp-form-control-height-md);border-radius:var(--tp-border-radius-md);font:inherit;font-weight:var(--tp-font-weight-semibold);font-size:var(--tp-form-control-font-size-md);text-align:center;vertical-align:middle;white-space:nowrap;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none;background:0 0;border:none;justify-content:center;align-items:center;gap:.4em;padding-inline:1.25em;text-decoration:none;transition:color .1s,border-color .1s,background-color .1s,translate .1s;display:inline-block;position:relative}:is(button,a.tp-button).tp-xs{min-height:var(--tp-form-control-height-xs);font-size:var(--tp-form-control-font-size-xs);padding-inline:.85em}:is(button,a.tp-button).tp-sm{min-height:var(--tp-form-control-height-sm);font-size:var(--tp-form-control-font-size-sm);padding-inline:1em}:is(button,a.tp-button).tp-md{min-height:var(--tp-form-control-height-md);font-size:var(--tp-form-control-font-size-md);padding-inline:1.25em}:is(button,a.tp-button).tp-lg{min-height:var(--tp-form-control-height-lg);font-size:var(--tp-form-control-font-size-lg);padding-inline:1.33em}:is(button,a.tp-button).tp-xl{min-height:var(--tp-form-control-height-xl);font-size:var(--tp-form-control-font-size-xl);padding-inline:1.5em}:is(button,a.tp-button).tp-pill{border-radius:var(--tp-border-radius-pill)}:is(button,a.tp-button):not(.tp-primary,.tp-destructive){background-color:var(--tp-neutral-fill-softer);color:var(--tp-neutral-text-on-soft)}@media (hover:hover){:is(button,a.tp-button):not(.tp-primary,.tp-destructive):hover:not(:disabled,.tp-disabled){background-color:color-mix(in oklab, var(--tp-neutral-fill-softer), black 5%)}}:is(button,a.tp-button).tp-primary{background-color:var(--tp-primary-fill-mid);color:var(--tp-primary-text-on-mid)}@media (hover:hover){:is(button,a.tp-button).tp-primary:hover:not(:disabled,.tp-disabled){background-color:color-mix(in oklab, var(--tp-primary-fill-mid), black 5%)}}:is(button,a.tp-button).tp-destructive{background-color:var(--tp-destructive-fill-mid);color:var(--tp-destructive-text-on-mid)}@media (hover:hover){:is(button,a.tp-button).tp-destructive:hover:not(:disabled,.tp-disabled){background-color:color-mix(in oklab, var(--tp-destructive-fill-mid), black 5%)}}:is(button,a.tp-button):active:not(:disabled,.tp-disabled){translate:0 var(--tp-button-active-offset)}:is(button,a.tp-button):focus{outline:none}:is(button,a.tp-button):focus-visible{outline:var(--tp-focus-ring);outline-offset:var(--tp-focus-offset)}:is(button,a.tp-button):disabled,:is(button,a.tp-button).tp-disabled{cursor:not-allowed;opacity:.5}:is(button,a.tp-button)>tp-icon{stroke-width:1.75px;vertical-align:-.2em;margin-inline:.025em;font-size:1.25em}a.tp-button{line-height:var(--tp-form-control-height-md)}a.tp-button.tp-xs{line-height:var(--tp-form-control-height-xs)}a.tp-button.tp-sm{line-height:var(--tp-form-control-height-sm)}a.tp-button.tp-md{line-height:var(--tp-form-control-height-md)}a.tp-button.tp-lg{line-height:var(--tp-form-control-height-lg)}a.tp-button.tp-xl{line-height:var(--tp-form-control-height-xl)}a.tp-button.tp-disabled{pointer-events:none}input[type=checkbox],input[type=radio]{appearance:none;border:var(--tp-border-style) var(--tp-border-width) var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-sm);background-position:50%;background-repeat:no-repeat;background-color:var(--tp-paper-color);width:1.125em;height:1.125em;color:var(--tp-primary-text-on-mid);accent-color:var(--tp-primary-fill-mid);vertical-align:middle;cursor:pointer;margin-inline:0;transition:background-color .1s,border-color .1s}:is(input[type=checkbox],input[type=radio]):checked:not(:indeterminate),:is(input[type=checkbox],input[type=radio]):indeterminate{border-color:var(--tp-primary-fill-mid);background-color:var(--tp-primary-fill-mid);color:var(--tp-primary-text-on-mid)}:is(input[type=checkbox],input[type=radio])[type=checkbox]:checked{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M5 12l5 5l10 -10' /%3E%3C/svg%3E\");background-position:calc(50% - .5px);background-size:100%}:is(input[type=checkbox],input[type=radio])[type=checkbox]:indeterminate{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M5 12l14 0' /%3E%3C/svg%3E\");background-size:100%}:is(input[type=checkbox],input[type=radio])[type=radio]{border-radius:var(--tp-border-radius-circle)}:is(input[type=checkbox],input[type=radio])[type=radio]:checked{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z' /%3E%3C/svg%3E\");background-size:62%}:is(input[type=checkbox],input[type=radio]).tp-filled{border-color:var(--tp-neutral-fill-softer);background-color:var(--tp-neutral-fill-softer)}:is(input[type=checkbox],input[type=radio]):focus{outline:none}:is(input[type=checkbox],input[type=radio]):focus-visible{outline:var(--tp-focus-ring);outline-offset:var(--tp-focus-offset)}:is(input[type=checkbox],input[type=radio]):disabled{cursor:not-allowed;opacity:.5}label:has(input[type=checkbox],input[type=radio]){cursor:pointer;align-items:center;gap:.25em;display:inline-flex}label:has(input[type=checkbox],input[type=radio]) input{margin-inline-end:.5em}label:has(input[type=checkbox],input[type=radio]):not(:last-child){margin-inline-end:1em}dialog[open]{border-radius:var(--tp-border-radius-md);background:var(--tp-paper-color);width:30rem;height:fit-content;box-shadow:var(--tp-shadow-loud);opacity:1;border:none;flex-direction:column;margin-block:auto;padding:1.5rem;transition:opacity .15s,transform .15s;display:flex;position:fixed;inset-block:0;transform:scale(1)}@starting-style{dialog[open]{opacity:0;transform:scale(.7)}}dialog::backdrop{-webkit-backdrop-filter:var(--tp-backdrop-filter,blur(6px));background-color:var(--tp-backdrop-color,#00000040);opacity:1;transition:opacity .15s}@starting-style{dialog::backdrop{opacity:0}}:not(:defined){visibility:hidden}mjx-container:not(:defined){visibility:visible}[hidden]{display:none!important}}", o = "@layer tp{:root,.tp-light,.tp-dark{--tp-brand-seed:#88b1a1;--tp-neutral-seed:#918c87;--tp-success-seed:#5dbb55;--tp-danger-seed:#ef5655;--tp-warning-seed:#e89a26;--tp-info-seed:#4a97f4;--tp-content-spacing:1.75rem;--tp-font-family:system-ui, sans-serif;--tp-font-family-heading:var(--tp-font-family);--tp-font-family-code:SFMono-Regular, Consolas, Menlo, Monaco, \"liberation mono\", \"Courier New\", monospace;--tp-font-size:18px;--tp-font-weight-normal:400;--tp-font-weight-semibold:500;--tp-font-weight-bold:700;--tp-line-height:1.7;--tp-focus-width:3px;--tp-focus-offset:1px;--tp-backdrop-filter:blur(6px);--tp-border-style:solid;--tp-border-width:1px;--tp-border-radius-xs:.1875rem;--tp-border-radius-sm:.25rem;--tp-border-radius-md:.375rem;--tp-border-radius-lg:.5625rem;--tp-border-radius-xl:.75rem;--tp-border-radius-pill:9999px;--tp-border-radius-circle:50%;--tp-form-control-height-xs:1.75rem;--tp-form-control-height-sm:2.25rem;--tp-form-control-height-md:2.75rem;--tp-form-control-height-lg:3.25rem;--tp-form-control-height-xl:3.75rem;--tp-form-control-font-size-xs:.75rem;--tp-form-control-font-size-sm:.875rem;--tp-form-control-font-size-md:1rem;--tp-form-control-font-size-lg:1.25rem;--tp-form-control-font-size-xl:1.5rem;--tp-form-control-required-content:\"*\";--tp-form-control-placeholder-color:var(--tp-text-muted);--tp-button-active-offset:1px;--tp-brand-50:color-mix(in oklab, var(--tp-brand-seed), white 95%);--tp-brand-100:color-mix(in oklab, var(--tp-brand-seed), white 87%);--tp-brand-200:color-mix(in oklab, var(--tp-brand-seed), white 70%);--tp-brand-300:color-mix(in oklab, var(--tp-brand-seed), white 47%);--tp-brand-400:color-mix(in oklab, var(--tp-brand-seed), white 23%);--tp-brand-500:var(--tp-brand-seed);--tp-brand-600:color-mix(in oklab, var(--tp-brand-seed), black 15.5%);--tp-brand-700:color-mix(in oklab, var(--tp-brand-seed), black 28.25%);--tp-brand-800:color-mix(in oklab, var(--tp-brand-seed), black 43.5%);--tp-brand-900:color-mix(in oklab, var(--tp-brand-seed), black 58.5%);--tp-brand-950:color-mix(in oklab, var(--tp-brand-seed), black 73.75%);--tp-neutral-50:color-mix(in oklab, var(--tp-neutral-seed), white 95%);--tp-neutral-100:color-mix(in oklab, var(--tp-neutral-seed), white 87%);--tp-neutral-200:color-mix(in oklab, var(--tp-neutral-seed), white 70%);--tp-neutral-300:color-mix(in oklab, var(--tp-neutral-seed), white 47%);--tp-neutral-400:color-mix(in oklab, var(--tp-neutral-seed), white 23%);--tp-neutral-500:var(--tp-neutral-seed);--tp-neutral-600:color-mix(in oklab, var(--tp-neutral-seed), black 15.5%);--tp-neutral-700:color-mix(in oklab, var(--tp-neutral-seed), black 28.25%);--tp-neutral-800:color-mix(in oklab, var(--tp-neutral-seed), black 43.5%);--tp-neutral-900:color-mix(in oklab, var(--tp-neutral-seed), black 58.5%);--tp-neutral-950:color-mix(in oklab, var(--tp-neutral-seed), black 73.75%);--tp-success-50:color-mix(in oklab, var(--tp-success-seed), white 95%);--tp-success-100:color-mix(in oklab, var(--tp-success-seed), white 87%);--tp-success-200:color-mix(in oklab, var(--tp-success-seed), white 70%);--tp-success-300:color-mix(in oklab, var(--tp-success-seed), white 47%);--tp-success-400:color-mix(in oklab, var(--tp-success-seed), white 23%);--tp-success-500:var(--tp-success-seed);--tp-success-600:color-mix(in oklab, var(--tp-success-seed), black 15.5%);--tp-success-700:color-mix(in oklab, var(--tp-success-seed), black 28.25%);--tp-success-800:color-mix(in oklab, var(--tp-success-seed), black 43.5%);--tp-success-900:color-mix(in oklab, var(--tp-success-seed), black 58.5%);--tp-success-950:color-mix(in oklab, var(--tp-success-seed), black 73.75%);--tp-warning-50:color-mix(in oklab, var(--tp-warning-seed), white 95%);--tp-warning-100:color-mix(in oklab, var(--tp-warning-seed), white 87%);--tp-warning-200:color-mix(in oklab, var(--tp-warning-seed), white 70%);--tp-warning-300:color-mix(in oklab, var(--tp-warning-seed), white 47%);--tp-warning-400:color-mix(in oklab, var(--tp-warning-seed), white 23%);--tp-warning-500:var(--tp-warning-seed);--tp-warning-600:color-mix(in oklab, var(--tp-warning-seed), black 15.5%);--tp-warning-700:color-mix(in oklab, var(--tp-warning-seed), black 28.25%);--tp-warning-800:color-mix(in oklab, var(--tp-warning-seed), black 43.5%);--tp-warning-900:color-mix(in oklab, var(--tp-warning-seed), black 58.5%);--tp-warning-950:color-mix(in oklab, var(--tp-warning-seed), black 73.75%);--tp-danger-50:color-mix(in oklab, var(--tp-danger-seed), white 95%);--tp-danger-100:color-mix(in oklab, var(--tp-danger-seed), white 87%);--tp-danger-200:color-mix(in oklab, var(--tp-danger-seed), white 70%);--tp-danger-300:color-mix(in oklab, var(--tp-danger-seed), white 47%);--tp-danger-400:color-mix(in oklab, var(--tp-danger-seed), white 23%);--tp-danger-500:var(--tp-danger-seed);--tp-danger-600:color-mix(in oklab, var(--tp-danger-seed), black 15.5%);--tp-danger-700:color-mix(in oklab, var(--tp-danger-seed), black 28.25%);--tp-danger-800:color-mix(in oklab, var(--tp-danger-seed), black 43.5%);--tp-danger-900:color-mix(in oklab, var(--tp-danger-seed), black 58.5%);--tp-danger-950:color-mix(in oklab, var(--tp-danger-seed), black 73.75%);--tp-info-50:color-mix(in oklab, var(--tp-info-seed), white 95%);--tp-info-100:color-mix(in oklab, var(--tp-info-seed), white 87%);--tp-info-200:color-mix(in oklab, var(--tp-info-seed), white 70%);--tp-info-300:color-mix(in oklab, var(--tp-info-seed), white 47%);--tp-info-400:color-mix(in oklab, var(--tp-info-seed), white 23%);--tp-info-500:var(--tp-info-seed);--tp-info-600:color-mix(in oklab, var(--tp-info-seed), black 15.5%);--tp-info-700:color-mix(in oklab, var(--tp-info-seed), black 28.25%);--tp-info-800:color-mix(in oklab, var(--tp-info-seed), black 43.5%);--tp-info-900:color-mix(in oklab, var(--tp-info-seed), black 58.5%);--tp-info-950:color-mix(in oklab, var(--tp-info-seed), black 73.75%)}:root,.tp-light{--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light;--tp-silent:white;--tp-strident:black;--tp-background-color:white;--tp-paper-color:white;--tp-text-body:var(--tp-neutral-900);--tp-text-muted:var(--tp-neutral-600);--tp-focus-color:var(--tp-brand-fill-mid);--tp-focus-ring:var(--tp-border-style) var(--tp-focus-width) var(--tp-focus-color);--tp-backdrop-color:#00000040;--tp-selection-background-color:var(--tp-brand-300);--tp-selection-color:var(--tp-text-body);--tp-shadow-color:black;--tp-shadow-softer:0 .0625rem .0625rem color-mix(in oklab, transparent, var(--tp-shadow-color) 4%);--tp-shadow-soft:0 .125rem .1875rem color-mix(in oklab, transparent, var(--tp-shadow-color) 8%);--tp-shadow-mid:0 .1875rem .375rem color-mix(in oklab, transparent, var(--tp-shadow-color) 10%);--tp-shadow-loud:0 .375rem .75rem color-mix(in oklab, transparent, var(--tp-shadow-color) 12%);--tp-shadow-louder:0 .5rem 1rem color-mix(in oklab, transparent, var(--tp-shadow-color) 14%);--tp-inset-shadow-softer:inset 0 .125rem .125rem -.125rem oklab(0% none none/.06);--tp-inset-shadow-soft:inset 0 .25rem .25rem -.25rem oklab(0% none none/.1);--tp-inset-shadow-mid:inset 0 .5rem .5rem -.5rem oklab(0% none none/.12);--tp-inset-shadow-loud:inset 0 1rem 1rem -1rem oklab(0% none none/.15);--tp-inset-shadow-louder:inset 0 1.5rem 1.5rem -1.5rem oklab(0% none none/.18);--tp-syntax-surface:color-mix(in oklab, var(--tp-paper-color), var(--tp-neutral-100) 22%);--tp-syntax-foreground:var(--tp-text-body);--tp-syntax-muted:var(--tp-neutral-700);--tp-syntax-caret:var(--tp-text-body);--tp-syntax-selection:color-mix(in srgb, var(--tp-brand-fill-mid) 62%, transparent);--tp-syntax-active-line:color-mix(in srgb, var(--tp-neutral-fill-soft) 38%, transparent);--tp-syntax-gutter-background:color-mix(in srgb, var(--tp-neutral-fill-softer) 88%, transparent);--tp-syntax-gutter-foreground:var(--tp-neutral-700);--tp-syntax-gutter-border:var(--tp-neutral-stroke-soft);--tp-syntax-fold-background:color-mix(in srgb, var(--tp-neutral-fill-soft) 70%, transparent);--tp-syntax-token-keyword:var(--tp-info-800);--tp-syntax-token-string:var(--tp-warning-900);--tp-syntax-token-number:var(--tp-brand-800);--tp-syntax-token-comment:var(--tp-neutral-700);--tp-syntax-token-variable:var(--tp-info-800);--tp-syntax-token-property:var(--tp-info-800);--tp-syntax-token-type:var(--tp-brand-800);--tp-syntax-token-function:var(--tp-warning-900);--tp-syntax-token-link:var(--tp-info-800);--tp-brand-fill-softer:var(--tp-brand-100);--tp-brand-fill-soft:var(--tp-brand-200);--tp-brand-fill-mid:var(--tp-brand-700);--tp-brand-fill-loud:var(--tp-brand-800);--tp-brand-fill-louder:var(--tp-brand-900);--tp-brand-text-on-soft:var(--tp-brand-900);--tp-brand-text-on-mid:white;--tp-brand-text-on-loud:white;--tp-brand-text-colorful:color-mix(in oklab, var(--tp-brand-600), black 12.5%);--tp-brand-stroke-softer:color-mix(in oklab, var(--tp-brand-100), black 3%);--tp-brand-stroke-soft:var(--tp-brand-300);--tp-brand-stroke-mid:var(--tp-brand-500);--tp-neutral-fill-softer:var(--tp-neutral-100);--tp-neutral-fill-soft:var(--tp-neutral-200);--tp-neutral-fill-mid:var(--tp-neutral-700);--tp-neutral-fill-loud:var(--tp-neutral-800);--tp-neutral-fill-louder:var(--tp-neutral-900);--tp-neutral-text-on-soft:var(--tp-neutral-900);--tp-neutral-text-on-mid:white;--tp-neutral-text-on-loud:white;--tp-neutral-text-colorful:color-mix(in oklab, var(--tp-neutral-600), black 12.5%);--tp-neutral-stroke-softer:color-mix(in oklab, var(--tp-neutral-100), black 3%);--tp-neutral-stroke-soft:var(--tp-neutral-300);--tp-neutral-stroke-mid:var(--tp-neutral-500);--tp-success-fill-softer:var(--tp-success-100);--tp-success-fill-soft:var(--tp-success-200);--tp-success-fill-mid:var(--tp-success-700);--tp-success-fill-loud:var(--tp-success-800);--tp-success-fill-louder:var(--tp-success-900);--tp-success-text-on-soft:var(--tp-success-900);--tp-success-text-on-mid:white;--tp-success-text-on-loud:white;--tp-success-text-colorful:color-mix(in oklab, var(--tp-success-600), black 12.5%);--tp-success-stroke-softer:color-mix(in oklab, var(--tp-success-100), black 3%);--tp-success-stroke-soft:var(--tp-success-300);--tp-success-stroke-mid:var(--tp-success-500);--tp-warning-fill-softer:var(--tp-warning-100);--tp-warning-fill-soft:var(--tp-warning-200);--tp-warning-fill-mid:var(--tp-warning-800);--tp-warning-fill-loud:var(--tp-warning-800);--tp-warning-fill-louder:var(--tp-warning-900);--tp-warning-text-on-soft:var(--tp-warning-900);--tp-warning-text-on-mid:white;--tp-warning-text-on-loud:white;--tp-warning-text-colorful:color-mix(in oklab, var(--tp-warning-600), black 12.5%);--tp-warning-stroke-softer:color-mix(in oklab, var(--tp-warning-100), black 3%);--tp-warning-stroke-soft:var(--tp-warning-300);--tp-warning-stroke-mid:var(--tp-warning-500);--tp-danger-fill-softer:var(--tp-danger-100);--tp-danger-fill-soft:var(--tp-danger-200);--tp-danger-fill-mid:var(--tp-danger-700);--tp-danger-fill-loud:var(--tp-danger-800);--tp-danger-fill-louder:var(--tp-danger-900);--tp-danger-text-on-soft:var(--tp-danger-900);--tp-danger-text-on-mid:white;--tp-danger-text-on-loud:white;--tp-danger-text-colorful:color-mix(in oklab, var(--tp-danger-600), black 12.5%);--tp-danger-stroke-softer:color-mix(in oklab, var(--tp-danger-100), black 3%);--tp-danger-stroke-soft:var(--tp-danger-300);--tp-danger-stroke-mid:var(--tp-danger-500);--tp-info-fill-softer:var(--tp-info-100);--tp-info-fill-soft:var(--tp-info-200);--tp-info-fill-mid:var(--tp-info-700);--tp-info-fill-loud:var(--tp-info-800);--tp-info-fill-louder:var(--tp-info-900);--tp-info-text-on-soft:var(--tp-info-900);--tp-info-text-on-mid:white;--tp-info-text-on-loud:white;--tp-info-text-colorful:color-mix(in oklab, var(--tp-info-600), black 12.5%);--tp-info-stroke-softer:color-mix(in oklab, var(--tp-info-100), black 3%);--tp-info-stroke-soft:var(--tp-info-300);--tp-info-stroke-mid:var(--tp-info-500)}.tp-dark{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark;--tp-silent:black;--tp-strident:white;--tp-background-color:var(--tp-neutral-950);--tp-paper-color:color-mix(in oklab, var(--tp-neutral-950), white 2.5%);--tp-text-body:var(--tp-neutral-200);--tp-text-muted:var(--tp-neutral-500);--tp-focus-color:var(--tp-brand-fill-mid);--tp-focus-ring:var(--tp-border-style) var(--tp-focus-width) var(--tp-focus-color);--tp-backdrop-color:#00000080;--tp-selection-background-color:var(--tp-brand-700);--tp-selection-color:var(--tp-text-body);--tp-shadow-color:black;--tp-shadow-softer:0 1px 2px color-mix(in oklab, transparent, var(--tp-shadow-color) 8%);--tp-shadow-soft:0 2px 4px color-mix(in oklab, transparent, var(--tp-shadow-color) 12%);--tp-shadow-mid:0 4px 8px color-mix(in oklab, transparent, var(--tp-shadow-color) 16%);--tp-shadow-loud:0 8px 16px color-mix(in oklab, transparent, var(--tp-shadow-color) 20%);--tp-shadow-louder:0 12px 20px color-mix(in oklab, transparent, var(--tp-shadow-color) 24%);--tp-syntax-surface:color-mix(in oklab, var(--tp-neutral-950), white 5%);--tp-syntax-foreground:color-mix(in oklab, var(--tp-neutral-100), white 8%);--tp-syntax-muted:color-mix(in oklab, var(--tp-success-500), var(--tp-neutral-500) 45%);--tp-syntax-caret:var(--tp-neutral-100);--tp-syntax-selection:color-mix(in srgb, var(--tp-info-fill-mid) 55%, transparent);--tp-syntax-active-line:color-mix(in srgb, var(--tp-neutral-fill-soft) 30%, transparent);--tp-syntax-gutter-background:color-mix(in srgb, var(--tp-neutral-900) 92%, transparent);--tp-syntax-gutter-foreground:var(--tp-neutral-400);--tp-syntax-gutter-border:var(--tp-neutral-700);--tp-syntax-fold-background:color-mix(in srgb, var(--tp-neutral-700) 55%, transparent);--tp-syntax-token-keyword:color-mix(in oklab, var(--tp-info-300), white 4%);--tp-syntax-token-string:color-mix(in oklab, var(--tp-warning-300), white 6%);--tp-syntax-token-number:color-mix(in oklab, var(--tp-success-300), white 2%);--tp-syntax-token-comment:color-mix(in oklab, var(--tp-success-500), var(--tp-neutral-500) 45%);--tp-syntax-token-variable:color-mix(in oklab, var(--tp-info-300), white 14%);--tp-syntax-token-property:color-mix(in oklab, var(--tp-info-300), white 8%);--tp-syntax-token-type:color-mix(in oklab, var(--tp-success-300), var(--tp-info-300) 45%);--tp-syntax-token-function:color-mix(in oklab, var(--tp-warning-200), white 2%);--tp-syntax-token-link:color-mix(in oklab, var(--tp-info-300), white 8%);--tp-brand-fill-softer:color-mix(in oklab, var(--tp-brand-900), white 1%);--tp-brand-fill-soft:var(--tp-brand-800);--tp-brand-fill-mid:var(--tp-brand-700);--tp-brand-fill-loud:var(--tp-brand-200);--tp-brand-fill-louder:var(--tp-brand-100);--tp-brand-text-on-soft:var(--tp-brand-100);--tp-brand-text-on-mid:white;--tp-brand-text-on-loud:black;--tp-brand-text-colorful:var(--tp-brand-500);--tp-brand-stroke-softer:color-mix(in oklab, var(--tp-brand-900), white 7.5%);--tp-brand-stroke-soft:var(--tp-brand-800);--tp-brand-stroke-mid:var(--tp-brand-600);--tp-neutral-fill-softer:color-mix(in oklab, var(--tp-neutral-900), white 1%);--tp-neutral-fill-soft:var(--tp-neutral-800);--tp-neutral-fill-mid:var(--tp-neutral-700);--tp-neutral-fill-loud:var(--tp-neutral-200);--tp-neutral-fill-louder:var(--tp-neutral-100);--tp-neutral-text-on-soft:var(--tp-neutral-100);--tp-neutral-text-on-mid:white;--tp-neutral-text-on-loud:black;--tp-neutral-text-colorful:var(--tp-neutral-500);--tp-neutral-stroke-softer:color-mix(in oklab, var(--tp-neutral-900), white 7.5%);--tp-neutral-stroke-soft:var(--tp-neutral-800);--tp-neutral-stroke-mid:var(--tp-neutral-600);--tp-success-fill-softer:color-mix(in oklab, var(--tp-success-900), white 1%);--tp-success-fill-soft:var(--tp-success-800);--tp-success-fill-mid:var(--tp-success-700);--tp-success-fill-loud:var(--tp-success-200);--tp-success-fill-louder:var(--tp-success-100);--tp-success-text-on-soft:var(--tp-success-100);--tp-success-text-on-mid:white;--tp-success-text-on-loud:black;--tp-success-text-colorful:var(--tp-success-500);--tp-success-stroke-softer:color-mix(in oklab, var(--tp-success-900), white 7.5%);--tp-success-stroke-soft:var(--tp-success-800);--tp-success-stroke-mid:var(--tp-success-600);--tp-warning-fill-softer:color-mix(in oklab, var(--tp-warning-900), white 1%);--tp-warning-fill-soft:var(--tp-warning-800);--tp-warning-fill-mid:var(--tp-warning-800);--tp-warning-fill-loud:var(--tp-warning-200);--tp-warning-fill-louder:var(--tp-warning-100);--tp-warning-text-on-soft:var(--tp-warning-100);--tp-warning-text-on-mid:white;--tp-warning-text-on-loud:black;--tp-warning-text-colorful:var(--tp-warning-500);--tp-warning-stroke-softer:color-mix(in oklab, var(--tp-warning-900), white 7.5%);--tp-warning-stroke-soft:var(--tp-warning-800);--tp-warning-stroke-mid:var(--tp-warning-600);--tp-info-fill-softer:color-mix(in oklab, var(--tp-info-900), white 1%);--tp-info-fill-soft:var(--tp-info-800);--tp-info-fill-mid:var(--tp-info-700);--tp-info-fill-loud:var(--tp-info-200);--tp-info-fill-louder:var(--tp-info-100);--tp-info-text-on-soft:var(--tp-info-100);--tp-info-text-on-mid:white;--tp-info-text-on-loud:black;--tp-info-text-colorful:var(--tp-info-500);--tp-info-stroke-softer:color-mix(in oklab, var(--tp-info-900), white 7.5%);--tp-info-stroke-soft:var(--tp-info-800);--tp-info-stroke-mid:var(--tp-info-600);--tp-danger-fill-softer:color-mix(in oklab, var(--tp-danger-900), white 1%);--tp-danger-fill-soft:var(--tp-danger-800);--tp-danger-fill-mid:var(--tp-danger-700);--tp-danger-fill-loud:var(--tp-danger-200);--tp-danger-fill-louder:var(--tp-danger-100);--tp-danger-text-on-soft:var(--tp-danger-100);--tp-danger-text-on-mid:white;--tp-danger-text-on-loud:black;--tp-danger-text-colorful:var(--tp-danger-500);--tp-danger-stroke-softer:color-mix(in oklab, var(--tp-danger-900), white 7.5%);--tp-danger-stroke-soft:var(--tp-danger-800);--tp-danger-stroke-mid:var(--tp-danger-600)}.tp-light,.tp-dark{color:var(--tp-text-body)}.tp-cloak:has(:not(:defined)){animation:2s step-end tpCloakAnimation}@keyframes tpCloakAnimation{0%{opacity:0}to{opacity:1}}.tp-default,.tp-default-style{--tp-brand-seed:#88b1a1}.tp-red,.tp-red-style{--tp-brand-seed:#ef5655}.tp-orange,.tp-orange-style{--tp-brand-seed:#f08039}.tp-amber,.tp-amber-style{--tp-brand-seed:#e89a26}.tp-yellow,.tp-yellow-style{--tp-brand-seed:#dcb31e}.tp-lime,.tp-lime-style{--tp-brand-seed:#9abb28}.tp-green,.tp-green-style{--tp-brand-seed:#5dbb55}.tp-emerald,.tp-emerald-style{--tp-brand-seed:#47b873}.tp-teal,.tp-teal-style{--tp-brand-seed:#37b995}.tp-glaz,.tp-glaz-style{--tp-brand-seed:#88b1a1}.tp-cyan,.tp-cyan-style{--tp-brand-seed:#20b8bc}.tp-sky,.tp-sky-style{--tp-brand-seed:#1caedd}.tp-blue,.tp-blue-style{--tp-brand-seed:#4a97f4}.tp-indigo,.tp-indigo-style{--tp-brand-seed:#6e85f8}.tp-violet,.tp-violet-style{--tp-brand-seed:#927cfb}.tp-purple,.tp-purple-style{--tp-brand-seed:#ae75f6}.tp-fuchsia,.tp-fuchsia-style{--tp-brand-seed:#d26ae8}.tp-pink,.tp-pink-style{--tp-brand-seed:#e468b0}.tp-rose,.tp-rose-style{--tp-brand-seed:#ee6383}.tp-zinc,.tp-zinc-style{--tp-brand-seed:#8b8c93}.tp-ivory,.tp-ivory-style{--tp-brand-seed:ivory}.tp-stone,.tp-stone-style{--tp-brand-seed:#918c87}.tp-default,.tp-default-style,.tp-red,.tp-red-style,.tp-orange,.tp-orange-style,.tp-amber,.tp-amber-style,.tp-yellow,.tp-yellow-style,.tp-lime,.tp-lime-style,.tp-green,.tp-green-style,.tp-emerald,.tp-emerald-style,.tp-teal,.tp-teal-style,.tp-glaz,.tp-glaz-style,.tp-cyan,.tp-cyan-style,.tp-sky,.tp-sky-style,.tp-blue,.tp-blue-style,.tp-indigo,.tp-indigo-style,.tp-violet,.tp-violet-style,.tp-purple,.tp-purple-style,.tp-fuchsia,.tp-fuchsia-style,.tp-pink,.tp-pink-style,.tp-rose,.tp-rose-style,.tp-zinc,.tp-zinc-style,.tp-ivory,.tp-ivory-style,.tp-stone,.tp-stone-style{--tp-brand-50:color-mix(in oklab, var(--tp-brand-seed), white 95%);--tp-brand-100:color-mix(in oklab, var(--tp-brand-seed), white 87%);--tp-brand-200:color-mix(in oklab, var(--tp-brand-seed), white 70%);--tp-brand-300:color-mix(in oklab, var(--tp-brand-seed), white 47%);--tp-brand-400:color-mix(in oklab, var(--tp-brand-seed), white 23%);--tp-brand-500:var(--tp-brand-seed);--tp-brand-600:color-mix(in oklab, var(--tp-brand-seed), black 15.5%);--tp-brand-700:color-mix(in oklab, var(--tp-brand-seed), black 28.25%);--tp-brand-800:color-mix(in oklab, var(--tp-brand-seed), black 43.5%);--tp-brand-900:color-mix(in oklab, var(--tp-brand-seed), black 58.5%);--tp-brand-950:color-mix(in oklab, var(--tp-brand-seed), black 73.75%);--tp-brand-fill-softer:var(--tp-brand-100);--tp-brand-fill-soft:var(--tp-brand-200);--tp-brand-fill-mid:color-mix(in oklab, var(--tp-brand-600), black 2.5%);--tp-brand-fill-loud:var(--tp-brand-800);--tp-brand-fill-louder:var(--tp-brand-900);--tp-brand-text-on-soft:var(--tp-brand-900);--tp-brand-text-on-mid:white;--tp-brand-text-on-loud:white;--tp-brand-text-colorful:color-mix(in oklab, var(--tp-brand-600), black 12.5%);--tp-brand-stroke-softer:color-mix(in oklab, var(--tp-brand-100), black 3%);--tp-brand-stroke-soft:var(--tp-brand-300);--tp-brand-stroke-mid:var(--tp-brand-500)}.tp-dark .tp-default,.tp-dark .tp-default-style,.tp-dark .tp-red,.tp-dark .tp-red-style,.tp-dark .tp-orange,.tp-dark .tp-orange-style,.tp-dark .tp-amber,.tp-dark .tp-amber-style,.tp-dark .tp-yellow,.tp-dark .tp-yellow-style,.tp-dark .tp-lime,.tp-dark .tp-lime-style,.tp-dark .tp-green,.tp-dark .tp-green-style,.tp-dark .tp-emerald,.tp-dark .tp-emerald-style,.tp-dark .tp-teal,.tp-dark .tp-teal-style,.tp-dark .tp-glaz,.tp-dark .tp-glaz-style,.tp-dark .tp-cyan,.tp-dark .tp-cyan-style,.tp-dark .tp-sky,.tp-dark .tp-sky-style,.tp-dark .tp-blue,.tp-dark .tp-blue-style,.tp-dark .tp-indigo,.tp-dark .tp-indigo-style,.tp-dark .tp-violet,.tp-dark .tp-violet-style,.tp-dark .tp-purple,.tp-dark .tp-purple-style,.tp-dark .tp-fuchsia,.tp-dark .tp-fuchsia-style,.tp-dark .tp-pink,.tp-dark .tp-pink-style,.tp-dark .tp-rose,.tp-dark .tp-rose-style,.tp-dark .tp-zinc,.tp-dark .tp-zinc-style,.tp-dark .tp-ivory,.tp-dark .tp-ivory-style,.tp-dark .tp-stone,.tp-dark .tp-stone-style{--tp-brand-fill-softer:color-mix(in oklab, var(--tp-brand-900), white 1%);--tp-brand-fill-soft:var(--tp-brand-800);--tp-brand-fill-mid:color-mix(in oklab, var(--tp-brand-600), black 7.5%);--tp-brand-fill-loud:var(--tp-brand-200);--tp-brand-fill-louder:var(--tp-brand-100);--tp-brand-text-on-soft:var(--tp-brand-100);--tp-brand-text-on-mid:white;--tp-brand-text-on-loud:black;--tp-brand-text-colorful:var(--tp-brand-500);--tp-brand-stroke-softer:color-mix(in oklab, var(--tp-brand-900), white 7.5%);--tp-brand-stroke-soft:var(--tp-brand-800);--tp-brand-stroke-mid:var(--tp-brand-600)}}.tp-default-style,.tp-red-style,.tp-orange-style,.tp-amber-style,.tp-yellow-style,.tp-lime-style,.tp-green-style,.tp-emerald-style,.tp-teal-style,.tp-glaz-style,.tp-cyan-style,.tp-sky-style,.tp-blue-style,.tp-indigo-style,.tp-violet-style,.tp-purple-style,.tp-fuchsia-style,.tp-pink-style,.tp-rose-style,.tp-zinc-style,.tp-ivory-style,.tp-stone-style{color:var(--tp-brand-text-colorful)}", s = "data-tp-preserve-document-styles";
function c(e) {
	return e.documentElement.hasAttribute(s);
}
var l = class s extends HTMLElement {
	static baseStyleId = "tp-base-styles";
	static resetStyleId = "tp-reset-styles";
	static tokenStyleId = "tp-token-styles";
	static sourceAttribute = "data-source";
	static globalHelpKeydownAttached = !1;
	static currentHelpElement = null;
	static hoveredHelpElement = null;
	initialHelpMarkup = null;
	baseHelpListenerAttached = !1;
	handleBaseHelpFocusIn = () => {
		s.currentHelpElement = this;
	};
	handleBaseHelpKeydown = (e) => {
		s.openHelpFromKeyboard(e, this);
	};
	static get observedAttributes() {
		return ["dir", "lang"];
	}
	connectedCallback() {
		this.captureInitialHelpMarkup(), this.ensureBaseStyles(), this.setAttribute("data-tp-base-host", ""), s.ensureGlobalHelpKeydown(), this.baseHelpListenerAttached ||= (this.addEventListener("keydown", this.handleBaseHelpKeydown), this.addEventListener("focusin", this.handleBaseHelpFocusIn), !0);
	}
	static ensureGlobalHelpKeydown() {
		s.globalHelpKeydownAttached || typeof document > "u" || (document.addEventListener("keydown", (e) => {
			let t = s.currentHelpElement?.isConnected === !0 ? s.currentHelpElement : null, n = (s.hoveredHelpElement?.isConnected ? s.hoveredHelpElement : null) ?? s.findHelpElement(e.target, e) ?? t;
			n !== null && s.openHelpFromKeyboard(e, n);
		}), document.addEventListener("pointerover", (e) => {
			s.hoveredHelpElement = s.findHelpElement(e.target, e);
		}), document.addEventListener("mouseover", (e) => {
			s.hoveredHelpElement = s.findHelpElement(e.target, e);
		}), document.addEventListener("pointerout", (e) => {
			s.hoveredHelpElement = s.findHelpElement(e.relatedTarget);
		}), document.addEventListener("mouseout", (e) => {
			s.hoveredHelpElement = s.findHelpElement(e.relatedTarget);
		}), window.addEventListener("blur", () => {
			s.hoveredHelpElement = null;
		}), s.globalHelpKeydownAttached = !0);
	}
	static findHelpElement(e, t) {
		for (let e of t?.composedPath() ?? []) {
			if (e instanceof s) return e;
			if (e instanceof Element) {
				let t = e.closest("[data-tp-base-host]");
				if (t instanceof s) return t;
			}
		}
		if (!(e instanceof Node)) return null;
		let n = (e instanceof Element ? e : e.parentElement)?.closest("[data-tp-base-host]");
		return n instanceof s ? n : null;
	}
	static openHelpFromKeyboard(e, t) {
		if (e.defaultPrevented || !(e.key === "?" || e.shiftKey && (e.code === "Slash" || e.code === "Comma" || e.code === "KeyM" && e.key === ",")) || e.altKey || !e.ctrlKey || e.metaKey) return;
		e.preventDefault(), e.stopPropagation();
		let n = s.hoveredHelpElement?.isConnected ? s.hoveredHelpElement : t;
		s.currentHelpElement = n, n.help();
	}
	async help() {
		let e = await this.loadComponentApi();
		if (e === null) return;
		await import("../components/drawer/drawer.js"), await import("../components/markdown/markdown.js");
		let t = this.getOrCreateHelpDrawer();
		t.setAttribute("label", "User help"), t.setAttribute("placement", "end"), t.setAttribute("width", "75%"), t.setAttribute("outside-click", ""), t.setAttribute("backdrop", "");
		let n = this.renderHelpContent(e);
		typeof t.setContent == "function" ? t.setContent(n) : t.replaceChildren(n), t.show?.();
	}
	attributeChangedCallback(e, t, n) {}
	ensureBaseStyles(e = document) {
		t(e), this.ensureGlobalStyle(s.tokenStyleId, o, e), !c(e) && (this.ensureGlobalStyle(s.resetStyleId, a, e), this.ensureGlobalStyle(s.baseStyleId, i, e));
	}
	ensureGlobalStyle(e, t, n = document) {
		if (n.getElementById(e)) return;
		let r = n.createElement("style");
		r.id = e, r.textContent = t, n.head.append(r);
	}
	getBooleanAttribute(e) {
		return this.hasAttribute(e);
	}
	setBooleanAttribute(e, t) {
		if (t) {
			this.setAttribute(e, "");
			return;
		}
		this.removeAttribute(e);
	}
	getStringAttribute(e, t = "") {
		return this.getAttribute(e) ?? t;
	}
	setStringAttribute(e, t) {
		if (t === "") {
			this.removeAttribute(e);
			return;
		}
		this.setAttribute(e, t);
	}
	removeAttributes(...e) {
		for (let t of e) this.removeAttribute(t);
	}
	queryElement(e, t = this) {
		let n = t.querySelector(e);
		return n instanceof Element ? n : null;
	}
	getClosestSkippingContainers(e) {
		let t = /* @__PURE__ */ new Set([
			"TP-TOOLBAR",
			"TP-MENU",
			"TP-DROPDOWN",
			"TP-BUTTON-GROUP",
			"TP-CONTEXTMENU"
		]), n = this;
		for (; n instanceof HTMLElement;) {
			if (!t.has(n.tagName) && n.matches(e)) return n;
			let r = n.parentElement;
			if (!(r instanceof HTMLElement)) break;
			n = t.has(r.tagName) ? r.parentElement : r;
		}
		return null;
	}
	async loadComponentApi() {
		let e = this.getComponentApiSources();
		for (let t of e) try {
			let e = await fetch(t);
			if (!e.ok) continue;
			return await e.json();
		} catch {}
		return null;
	}
	getComponentApiSources() {
		let e = this.tagName.toLowerCase().replace(/^tp-/, ""), t = this.getAttribute("data-tp-help-src");
		return t !== null && t !== "" ? this.getExplicitComponentApiSources(t, e) : [
			...this.getComponentApiRootSources(e),
			`/src/components/${e}/${e}.json`,
			`/components/${e}/${e}.json`
		];
	}
	getExplicitComponentApiSources(e, t) {
		if (this.isAbsoluteApiSource(e)) return [e];
		let n = this.getComponentApiRoots(), r = /* @__PURE__ */ new Set();
		for (let i of n) try {
			let n = e.includes("/") ? e : `${t}/${e}`;
			r.add(new URL(n, i).href);
		} catch {}
		return [...r];
	}
	isAbsoluteApiSource(e) {
		if (e.startsWith("/")) return !0;
		try {
			let t = new URL(e);
			return t.protocol === "http:" || t.protocol === "https:" || t.protocol === "file:";
		} catch {
			return !1;
		}
	}
	getComponentApiRootSources(e) {
		return this.getComponentApiRoots().map((t) => `${t}${e}/${e}.json`);
	}
	getComponentApiRoots() {
		let e = /* @__PURE__ */ new Set(), t = new URL(import.meta.url);
		return this.addDocumentComponentApiRoots(e, document), this.addParentDocumentComponentApiRoots(e), t.pathname.includes("/src/components/base/") && e.add(new URL("../", t).href), t.pathname.includes("/dist/chunks/") && e.add(new URL("../components/", t).href), t.pathname.includes("/dist/components/base/") && e.add(new URL("../", t).href), [...e];
	}
	addParentDocumentComponentApiRoots(e) {
		if (!(typeof window > "u" || window.parent === window)) try {
			let t = window.parent;
			for (; t !== window && (this.addDocumentComponentApiRoots(e, t.document), t.parent !== t);) t = t.parent;
		} catch {}
	}
	addDocumentComponentApiRoots(e, t) {
		for (let n of t.querySelectorAll("script[src]")) {
			let r = n.getAttribute("src");
			if (!(r === null || !r.includes("tp-loader"))) try {
				let n = new URL(r, t.baseURI);
				e.add(new URL("./components/", n).href);
			} catch {}
		}
		let n = this.getDocumentDirectoryUrl(t);
		if (n === null) return;
		let r = n.pathname.includes("/public/"), i = n.pathname.includes("/dist/");
		if (r) {
			e.add(new URL("../dist/components/", n).href);
			return;
		}
		e.add(new URL("components/", n).href), e.add(new URL("../dist/components/", n).href), e.add(new URL("../components/", n).href), i || e.add(new URL("dist/components/", n).href);
	}
	getDocumentDirectoryUrl(e) {
		for (let t of this.getDocumentBaseCandidates(e)) try {
			let e = new URL(t);
			return new URL(".", e);
		} catch {}
		return null;
	}
	getDocumentBaseCandidates(e) {
		let t = [e.baseURI, e.location.href];
		try {
			if (e.defaultView?.parent !== e.defaultView) {
				let n = e.defaultView?.parent.document;
				t.push(n?.baseURI, n?.location.href);
			}
		} catch {}
		return t.filter((e) => this.isUsableDocumentUrl(e));
	}
	isUsableDocumentUrl(e) {
		if (e == null || e === "") return !1;
		try {
			let t = new URL(e);
			return t.protocol === "http:" || t.protocol === "https:" || t.protocol === "file:";
		} catch {
			return !1;
		}
	}
	getOrCreateHelpDrawer() {
		let e = document.fullscreenElement instanceof HTMLElement ? document.fullscreenElement : document.body, t = document.getElementById("tp-component-help-drawer");
		if (t instanceof HTMLElement) return t.parentElement !== e && e.append(t), t;
		let n = document.createElement("tp-drawer");
		return n.id = "tp-component-help-drawer", e.append(n), n;
	}
	renderHelpContent(e) {
		let t = document.createElement("section");
		t.className = "tp-component-help";
		let i = document.createElement("h2");
		i.textContent = e.userHelp?.displayName?.trim() || e.tagname.replace(/^tp-/, "").replaceAll("-", " ").replace(/^./, (e) => e.toUpperCase()), t.append(i);
		let a = document.createElement("section");
		a.className = "tp-component-help-current";
		let o = document.createElement("h3");
		o.textContent = "Current element";
		let s = document.createElement("div");
		s.className = "tp-component-help-preview";
		let c = document.createElement("template");
		c.innerHTML = this.getStoredHelpMarkup();
		let l = c.content.firstElementChild;
		if (l instanceof HTMLElement) {
			[...l.attributes].forEach((e) => {
				this.hasAttribute(e.name) || l.removeAttribute(e.name);
			}), [...this.attributes].filter((e) => !this.isInternalSourceAttribute(e)).forEach((e) => {
				l.setAttribute(e.name, e.value);
			}), l.removeAttribute("autoplay");
			let e = this.getCurrentDocumentBaseHref() ?? document.baseURI;
			[l, ...l.querySelectorAll("*")].forEach((t) => {
				[
					"src",
					"href",
					"poster",
					"repository",
					"data-tp-markdown-source"
				].forEach((n) => {
					let r = t.getAttribute(n);
					if (r && !r.startsWith("#")) try {
						t.setAttribute(n, new URL(r, e).href);
					} catch {}
				});
			}), l.querySelectorAll("script").forEach((e) => {
				!e.type.startsWith("tp/") && e.type !== "application/json" && e.remove();
			});
			let t = /* @__PURE__ */ new Map();
			[l, ...l.querySelectorAll("[id]")].forEach((e) => {
				if (e.id) {
					let n = `tp-help-${crypto.randomUUID()}`;
					t.set(e.id, n), e.id = n;
				}
			}), [l, ...l.querySelectorAll("*")].forEach((e) => {
				[
					"for",
					"aria-labelledby",
					"aria-describedby",
					"aria-controls",
					"aria-owns",
					"list"
				].forEach((n) => {
					let r = e.getAttribute(n);
					r && e.setAttribute(n, r.split(/\s+/).map((e) => t.get(e) ?? e).join(" "));
				});
				let n = e.getAttribute("href");
				n?.startsWith("#") && t.has(n.slice(1)) && e.setAttribute("href", `#${t.get(n.slice(1))}`);
			});
			let n = this.closest("[lang]")?.getAttribute("lang");
			n && l.setAttribute("lang", n), s.append(l);
		}
		if (a.append(o), e.userHelp?.introduction) {
			let t = document.createElement("tp-markdown");
			t.className = "tp-component-help-introduction";
			let n = document.createElement("script");
			n.type = "tp/markdown", n.textContent = e.userHelp.introduction, t.append(n), a.append(t);
		}
		a.append(s);
		let u = document.createElement("section"), d = document.createElement("h3");
		d.textContent = "User interactions";
		let f = document.createElement("tp-markdown"), p = document.createElement("script");
		p.type = "tp/markdown", p.textContent = r(e.userHelp?.interactions || "No user interaction instructions are available for this component."), f.append(p), u.append(d);
		let m = n(this, e.userHelp?.interactions ?? "");
		if (m && u.append(m), u.append(f), e.userHelp?.keyboard.length && !/^#### Keyboard interactions\s*$/m.test(e.userHelp.interactions)) {
			let t = document.createElement("dl");
			e.userHelp.keyboard.forEach((e) => {
				let n = document.createElement("dt");
				for (let [t, r] of e.key.split(/\+(?!$)/).entries()) {
					t && n.append("+");
					let e = document.createElement("kbd");
					e.textContent = r, n.append(e);
				}
				let r = document.createElement("dd");
				r.textContent = e.description, t.append(n, r);
			}), u.append(t);
		}
		return t.append(a, u), t;
	}
	getCurrentDocumentBaseHref() {
		let e = this.closest("[data-tp-markdown-source]")?.getAttribute("data-tp-markdown-source")?.trim();
		if (e === void 0 || e === "") return null;
		for (let t of this.getDocumentBaseCandidates(document)) try {
			return new URL(".", new URL(e, t)).href;
		} catch {}
		return null;
	}
	captureInitialHelpMarkup() {
		this.captureHelpSource();
	}
	captureHelpSource() {
		if (this.initialHelpMarkup !== null) return;
		let e = this.getAttribute(s.sourceAttribute);
		this.initialHelpMarkup = e !== null && e !== "" ? this.stripInternalGeneratedMarkup(e) : this.serializeUserFacingElement(), (e === null || e === "") && this.setAttribute(s.sourceAttribute, this.initialHelpMarkup);
	}
	getStoredHelpMarkup() {
		let e = this.getAttribute(s.sourceAttribute);
		return e !== null && e !== "" ? this.stripInternalGeneratedMarkup(e) : this.initialHelpMarkup ?? this.serializeUserFacingElement();
	}
	stripInternalGeneratedMarkup(e) {
		let t = document.createElement("template");
		return t.innerHTML = e, this.normalizeHelpMarkupWhitespace(this.serializeStoredSourceChildNodes(t.content));
	}
	serializeUserFacingElement() {
		let t = this.tagName.toLowerCase(), n = [t, ...Array.from(this.attributes).filter((e) => !this.isInternalSourceAttribute(e)).flatMap((e) => {
			let t = this.getUserFacingAttributeValue(e);
			return t === null ? [] : e.value === "" ? [e.name] : [`${e.name}="${u(t)}"`];
		})].join(" "), r = this.normalizeHelpMarkupWhitespace(e(this.serializeUserFacingChildNodes(this)));
		return r.trim() !== "" && this.getAttribute("src") === null ? `<${n}>${r}</${t}>` : `<${n}></${t}>`;
	}
	serializeUserFacingChildNodes(e) {
		return Array.from(e.childNodes).map((e) => this.serializeUserFacingNode(e)).join("");
	}
	serializeStoredSourceChildNodes(e) {
		return Array.from(e.childNodes).map((e) => this.serializeStoredSourceNode(e)).join("");
	}
	serializeStoredSourceNode(e) {
		if (e.nodeType === Node.TEXT_NODE) return u(e.textContent ?? "");
		if (!(e instanceof Element) || this.isInternalGeneratedElement(e)) return "";
		let t = e.tagName.toLowerCase(), n = [t, ...Array.from(e.attributes).filter((e) => !this.isInternalSourceAttribute(e)).map((e) => e.value === "" ? e.name : `${e.name}="${u(e.value)}"`)].join(" ");
		return this.isContentlessGeneratedComponent(t) ? `<${n}></${t}>` : t === "script" || t === "style" ? `<${n}>${e.textContent ?? ""}</${t}>` : `<${n}>${this.serializeStoredSourceChildNodes(e)}</${t}>`;
	}
	serializeUserFacingNode(e) {
		if (e.nodeType === Node.TEXT_NODE) return u(e.textContent ?? "");
		if (!(e instanceof Element) || !(e instanceof s) && this.isInternalGeneratedElement(e)) return "";
		if (e instanceof Element) {
			let t = e.getAttribute(s.sourceAttribute);
			if (t !== null && t !== "") return this.stripInternalGeneratedMarkup(t);
		}
		if (e instanceof s) return e.getStoredHelpMarkup();
		let t = e.tagName.toLowerCase(), n = [t, ...Array.from(e.attributes).filter((e) => !this.isInternalSourceAttribute(e)).map((e) => e.value === "" ? e.name : `${e.name}="${u(e.value)}"`)].join(" ");
		return this.isContentlessGeneratedComponent(t) ? `<${n}></${t}>` : t === "script" || t === "style" ? `<${n}>${e.textContent ?? ""}</${t}>` : `<${n}>${this.serializeUserFacingChildNodes(e)}</${t}>`;
	}
	isContentlessGeneratedComponent(e) {
		return e === "tp-icon-button";
	}
	normalizeHelpMarkupWhitespace(e) {
		let t = [];
		return e.replace(/<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, (e) => {
			let n = t.push(e) - 1;
			return `TP_PRESERVED_BLOCK_${String(n)}`;
		}).replace(/[ \t]+\n/g, "\n").replace(/\n\s*\n/g, "\n").trim().replace(/TP_PRESERVED_BLOCK_(\d+)/g, (e, n) => t[Number(n)] ?? "");
	}
	isInternalSourceAttribute(e) {
		let t = e.name;
		return this.isGeneratedDropdownSourceAttribute(e) || t === "data-tp-base-host" || t === s.sourceAttribute || t.startsWith("data-") && !this.isUserFacingDataAttribute(t);
	}
	isGeneratedDropdownSourceAttribute(e) {
		if (this.tagName.toLowerCase() !== "tp-dropdown") return !1;
		let t = e.ownerElement;
		if (t === null) return !1;
		let n = t.tagName.toLowerCase(), r = e.name, i = e.value;
		return n === "ul" ? r === "role" && i === "menu" : n === "li" ? r === "role" && i === "menuitem" || r === "tabindex" || r === "aria-haspopup" || r === "aria-expanded" : !1;
	}
	isInternalGeneratedElement(e) {
		return Array.from(e.attributes).some((e) => e.name.startsWith("data-tp-") && !this.isUserFacingDataAttribute(e.name));
	}
	isUserFacingDataAttribute(e) {
		return e === "data-tp-help-src" || e === "data-tp-markdown-source";
	}
	getUserFacingAttributeValue(e) {
		if (e.name !== "class") return e.value;
		let t = this.tagName.toLowerCase(), n = e.value.split(/\s+/).filter((e) => e !== "" && e !== t);
		return n.length === 0 ? null : n.join(" ");
	}
};
function u(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function d() {
	if (typeof document > "u" || (t(document), f("tp-token-styles", o), c(document)) || (f("tp-reset-styles", a), f("tp-base-styles", i), typeof window > "u")) return;
	let e = document.body;
	if (!(e instanceof HTMLElement) || e.classList.contains("tp-light") || e.classList.contains("tp-dark")) return;
	let n = window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0;
	e.classList.add(n ? "tp-dark" : "tp-light");
}
function f(e, t) {
	if (document.getElementById(e)) return;
	let n = document.createElement("style");
	n.id = e, n.textContent = t, document.head.append(n);
}
customElements.get("tp-base") || customElements.define("tp-base", l);
//#endregion
export { d as n, l as t };

//# sourceMappingURL=base.js.map