import "animate.css";

import { ensureTpBaseStyles } from "./components/base/base.js";

ensureTpBaseStyles();

export {
	TpAccordion,
	type TpAccordionAppearance,
} from "./components/accordion/accordion.js";
export { TpAlarm } from "./components/alarm/alarm.js";
export { TpAnimation } from "./components/animation/animation.js";
export {
	setupTpAnimationTriggers,
	teardownTpAnimationTriggers,
} from "./components/animation/animation-triggers.js";
export { TpAsciidoc } from "./components/asciidoc/asciidoc.js";
export { TpAsciidocMultiPages } from "./components/asciidoc-multi-pages/asciidoc-multi-pages.js";
export { TpAsciidocMultiSlides } from "./components/asciidoc-multi-slides/asciidoc-multi-slides.js";
export {
	type TpAsciidocExtension,
	TpAsciidocPlayground,
	TpAsciidocProject,
} from "./components/asciidoc-playground/asciidoc-playground.js";
export { TpAsciidocSinglePage } from "./components/asciidoc-single-page/asciidoc-single-page.js";
export { TpAsciidocViewer } from "./components/asciidoc-viewer/asciidoc-viewer.js";
export { TpAsciidocViewerQuestion } from "./components/asciidoc-viewer-question/asciidoc-viewer-question.js";
export {
	TpAvatar,
	type TpAvatarShape,
	type TpAvatarSize,
} from "./components/avatar/avatar.js";
export {
	TpAvatarGroup,
	type TpAvatarGroupOrder,
	type TpAvatarGroupOrientation,
} from "./components/avatar-group/avatar-group.js";
export { TpBadge } from "./components/badge/badge.js";
export { TpBinary } from "./components/binary/binary.js";
export { TpBlank } from "./components/blank/blank.js";
export { TpBox } from "./components/box/box.js";
export { TpButton } from "./components/button/button.js";
export { TpButtonGroup } from "./components/button-group/button-group.js";
export { TpCallout } from "./components/callout/callout.js";
export { TpCard } from "./components/card/card.js";
export { TpCenter } from "./components/center/center.js";
export { TpCheckboxList } from "./components/checkbox-list/checkbox-list.js";
export { TpChronometer } from "./components/chronometer/chronometer.js";
export { TpClock } from "./components/clock/clock.js";
export { TpCluster } from "./components/cluster/cluster.js";
export { TpCodeComment } from "./components/code-comment/code-comment.js";
export { TpCodeEditor } from "./components/code-editor/code-editor.js";
export { TpColor } from "./components/color/color.js";
export { TpColorPicker } from "./components/color-picker/color-picker.js";
export { TpCompare } from "./components/compare/compare.js";
export { TpConsole } from "./components/console/console.js";
export { TpContextmenu } from "./components/contextmenu/contextmenu.js";
export { TpCopyCode } from "./components/copy-code/copy-code.js";
export {
	setupTpCopyCodeButtons,
	teardownTpCopyCodeButtons,
} from "./components/copy-code/setup-tp-copy-code-buttons.js";
export { TpCover } from "./components/cover/cover.js";
export { TpCrossword } from "./components/crossword/crossword.js";
export { TpCryptarithm } from "./components/cryptarithm/cryptarithm.js";
export { TpCsvTable } from "./components/csv-table/csv-table.js";
export {
	TpDatefield,
	type TpDatefieldLabelPosition,
} from "./components/datefield/datefield.js";
export { TpDialog } from "./components/dialog/dialog.js";
export { TpDir } from "./components/dir/dir.js";
export {
	TpDivider,
	type TpDividerOrientation,
} from "./components/divider/divider.js";
export { TpDrawer } from "./components/drawer/drawer.js";
export {
	setupTpDrawerTriggers,
	teardownTpDrawerTriggers,
} from "./components/drawer/drawer-triggers.js";
export { TpDropdown } from "./components/dropdown/dropdown.js";
export {
	setupTpDropdownTriggers,
	teardownTpDropdownTriggers,
} from "./components/dropdown/dropdown-triggers.js";
export { TpEditorQuestion } from "./components/editor-question/editor-question.js";
export {
	getEmojiMetadata,
	parseEmojiTestData,
	TpEmojiPicker,
	type TpEmojiPickerCopyFormat,
	type TpEmojiPickerItem,
	type TpEmojiPickerMetadata,
} from "./components/emoji-picker/emoji-picker.js";
export { TpFileTree } from "./components/file-tree/file-tree.js";
export { TpFilesystem } from "./components/filesystem/filesystem.js";
export { TpFillBlank } from "./components/fill-blank/fill-blank.js";
export { TpFlipCard } from "./components/flip-card/flip-card.js";
export {
	spreadsheetFormulaNames,
	spreadsheetFormulaSignature,
	TpFormulaPicker,
} from "./components/formula-picker/formula-picker.js";
export { TpFrame } from "./components/frame/frame.js";
export { TpFullscreen } from "./components/fullscreen/fullscreen.js";
export { TpGameLife } from "./components/game-life/game-life.js";
export {
	simulateAnalogCircuit,
	TP_ANALOG_CAPACITOR,
	TP_ANALOG_CURRENT_SOURCE,
	TP_ANALOG_DIODE,
	TP_ANALOG_GROUND,
	TP_ANALOG_HUB,
	TP_ANALOG_INDUCTOR,
	TP_ANALOG_LAMP,
	TP_ANALOG_LED,
	TP_ANALOG_MOTOR,
	TP_ANALOG_OP_AMP,
	TP_ANALOG_POTENTIOMETER,
	TP_ANALOG_PROBE,
	TP_ANALOG_RESISTOR,
	TP_ANALOG_RHEOSTAT,
	TP_ANALOG_SCOPE,
	TP_ANALOG_SWITCH,
	TP_ANALOG_TRANSISTOR,
	TP_ANALOG_TRANSISTOR_NPN,
	TP_ANALOG_TRANSISTOR_PNP,
	TP_ANALOG_VOLTAGE_SOURCE,
	TP_ANALOG_WIRE,
	type TpAnalogMeasurementMode,
	type TpAnalogSample,
	type TpAnalogSimulation,
	TpGraphAnalogCircuit,
	validateAnalogCircuit,
} from "./components/graph-analog-circuit/graph-analog-circuit.js";
export {
	createDfaStep,
	TP_DFA_STATE,
	TP_DFA_TRANSITION,
	TpGraphDfa,
	validateDfaGraph,
} from "./components/graph-dfa/graph-dfa.js";
export {
	graphEdgeMeasurements,
	TP_GRAPH_COMMENT,
	TP_GRAPH_HUB,
	TP_GRAPH_MEASUREMENT,
	type TpGraphCommentColor,
	type TpGraphDocument,
	type TpGraphEdge,
	type TpGraphEdgeDirection,
	type TpGraphEdgeRouting,
	TpGraphEditor,
	type TpGraphMeasurement,
	type TpGraphNode,
	type TpGraphPalette,
	type TpGraphPoint,
	type TpGraphPort,
	type TpGraphShape,
	type TpGraphSimulator,
	type TpGraphTransition,
} from "./components/graph-editor/graph-editor.js";
export { TpGraphDocumentSchema } from "./components/graph-editor/graph-schema.js";
export {
	analyzeGeometricOptics,
	TP_OPTICS_CONVERGING_LENS,
	TP_OPTICS_DIVERGING_LENS,
	TP_OPTICS_SCREEN,
	TP_OPTICS_SOURCE,
	TpGraphGeometricOptics,
	type TpOpticsAnalysis,
	type TpOpticsMatrix,
	type TpOpticsMatrixStage,
	validateGeometricOpticsGraph,
} from "./components/graph-geometric-optics/graph-geometric-optics.js";
export {
	evaluateLogicalCircuit,
	getLogicalEquations,
	TP_LOGIC_AND,
	TP_LOGIC_AND_3,
	TP_LOGIC_HUB,
	TP_LOGIC_INPUT,
	TP_LOGIC_NAND,
	TP_LOGIC_NAND_3,
	TP_LOGIC_NOR,
	TP_LOGIC_NOR_3,
	TP_LOGIC_NOT,
	TP_LOGIC_OR,
	TP_LOGIC_OR_3,
	TP_LOGIC_OUTPUT,
	TP_LOGIC_WIRE,
	TP_LOGIC_XOR,
	TP_LOGIC_XOR_3,
	TpGraphLogicalCircuit,
	type TpLogicalEquation,
	type TpLogicalEquationNotation,
	type TpLogicGateRepresentation,
	validateLogicalCircuit,
} from "./components/graph-logical-circuit/graph-logical-circuit.js";
export {
	createNfaStep,
	regexToNfa,
	TP_NFA_EPSILON,
	TP_NFA_STATE,
	TP_NFA_TRANSITION,
	TpGraphNfa,
	validateNfaGraph,
} from "./components/graph-nfa/graph-nfa.js";
export {
	createPetriFireTransition,
	getEnabledPetriTransitions,
	getPetriArcWeight,
	getPetriIncidenceMatrix,
	getPetriReachabilityGraph,
	getPetriTokens,
	TP_PETRI_ARC,
	TP_PETRI_PLACE,
	TP_PETRI_TOKEN,
	TP_PETRI_TRANSITION,
	TpGraphPetri,
	validatePetriGraph,
} from "./components/graph-petri/graph-petri.js";
export {
	queryTreeToSql,
	TP_QUERY_AGGREGATION,
	TP_QUERY_DIFFERENCE,
	TP_QUERY_EDGE,
	TP_QUERY_INTERSECTION,
	TP_QUERY_JOIN,
	TP_QUERY_PRODUCT,
	TP_QUERY_PROJECTION,
	TP_QUERY_RELATION,
	TP_QUERY_RENAME,
	TP_QUERY_SELECTION,
	TP_QUERY_SORT,
	TP_QUERY_UNION,
	TpGraphQueryTree,
	validateQueryTree,
} from "./components/graph-query-tree/graph-query-tree.js";
export {
	evaluateSequentialCombinational,
	TP_LOGIC_CLOCK,
	TP_LOGIC_D_FLIP_FLOP,
	TP_LOGIC_D_LATCH,
	TP_LOGIC_JK_FLIP_FLOP,
	TP_LOGIC_SR_LATCH,
	TP_LOGIC_T_FLIP_FLOP,
	TpGraphSequentialCircuit,
	validateSequentialCircuit,
} from "./components/graph-sequential-circuit/graph-sequential-circuit.js";
export { TpGrid } from "./components/grid/grid.js";
// export { TpHtml } from './components/html/html.js';
export { TpHtmlMultiPages } from "./components/html-multi-pages/html-multi-pages.js";
export { TpHtmlMultiSlides } from "./components/html-multi-slides/html-multi-slides.js";
export {
	TpHtmlPlayground,
	TpHtmlProject,
} from "./components/html-playground/html-playground.js";
export { TpHtmlSinglePage } from "./components/html-single-page/html-single-page.js";
export { TpHtmlViewer } from "./components/html-viewer/html-viewer.js";
export { TpHtmlViewerQuestion } from "./components/html-viewer-question/html-viewer-question.js";
export { TpIcon } from "./components/icon/icon.js";
export {
	clearTpIconRegistry,
	getTpIcon,
	hasTpIcon,
	listTpIconLibraries,
	listTpIcons,
	registerTpIcon,
	registerTpIconLibrary,
} from "./components/icon/icon-registry.js";
export { setupTpIcons } from "./components/icon/icon-setup.js";
export { registerTpIconLibraryFromGlob } from "./components/icon/icon-vite.js";
export {
	TpIconPicker,
	type TpIconPickerCopyFormat,
} from "./components/icon-picker/icon-picker.js";
export { TpIframe } from "./components/iframe/iframe.js";
export {
	setupTpIframeControls,
	teardownTpIframeControls,
} from "./components/iframe/iframe-controls.js";
export { TpInclude } from "./components/include/include.js";
export { TpInline } from "./components/inline/inline.js";
export { TpJavascriptNotebook } from "./components/javascript-notebook/javascript-notebook.js";
export {
	TpJavascriptPlayground,
	TpJavascriptProject,
} from "./components/javascript-playground/javascript-playground.js";
export { TpJavascriptPlaygroundQuestion } from "./components/javascript-playground-question/javascript-playground-question.js";
export { TpJavascriptViewer } from "./components/javascript-viewer/javascript-viewer.js";
export { TpJavascriptViewerQuestion } from "./components/javascript-viewer-question/javascript-viewer-question.js";
export { TpLang } from "./components/lang/lang.js";
export { TpListTable } from "./components/list-table/list-table.js";
export { TpLoremIpsum } from "./components/lorem-ipsum/lorem-ipsum.js";
export { TpLoto, type TpLotoDrawDetail } from "./components/loto/loto.js";
export { TpLsystem } from "./components/lsystem/lsystem.js";
export { TpMap } from "./components/map/map.js";
export { TpMarkdown } from "./components/markdown/markdown.js";
export { TpMarkdownMultiPages } from "./components/markdown-multi-pages/markdown-multi-pages.js";
export { TpMarkdownMultiSlides } from "./components/markdown-multi-slides/markdown-multi-slides.js";
export {
	type TpMarkdownExtension,
	TpMarkdownPlayground,
	TpMarkdownProject,
} from "./components/markdown-playground/markdown-playground.js";
export { TpMarkdownSinglePage } from "./components/markdown-single-page/markdown-single-page.js";
export { TpMarkdownViewer } from "./components/markdown-viewer/markdown-viewer.js";
export { TpMarkdownViewerQuestion } from "./components/markdown-viewer-question/markdown-viewer-question.js";
export { TpMarkupMultiPages } from "./components/markup-multi-pages/markup-multi-pages.js";
export { TpMarkupMultiSlides } from "./components/markup-multi-slides/markup-multi-slides.js";
export { TpMarkupSinglePage } from "./components/markup-single-page/markup-single-page.js";
export { TpMarkupViewerQuestion } from "./components/markup-viewer-question/markup-viewer-question.js";
export { TpMastermind } from "./components/mastermind/mastermind.js";
export {
	TpMatching,
	type TpMatchingGroup,
	type TpMatchingPair,
	type TpMatchingValue,
} from "./components/matching/matching.js";
export { TpMatchingQuestion } from "./components/matching-question/matching-question.js";
export { TpMath, type TpMathMode } from "./components/math/math.js";
export {
	TpMathfield,
	type TpMathfieldLabelPosition,
	type TpMathfieldMode,
} from "./components/mathfield/mathfield.js";
export { TpMemory } from "./components/memory/memory.js";
export { TpMenu } from "./components/menu/menu.js";
export { TpModal } from "./components/modal/modal.js";
export {
	setupTpModalTriggers,
	teardownTpModalTriggers,
} from "./components/modal/modal-triggers.js";
export { TpMultiChoiceQuestion } from "./components/multi-choice-question/multi-choice-question.js";
export { TpNotebook } from "./components/notebook/notebook.js";
export {
	TpNumberfield,
	type TpNumberfieldLabelPosition,
} from "./components/numberfield/numberfield.js";
export { TpObjectTree } from "./components/object-tree/object-tree.js";
export { TpOverlayElement } from "./components/overlay/overlay.js";
export { TpPlaygroundQuestion } from "./components/playground-question/playground-question.js";
// export { TpPlayground } from './components/playground/playground.js';
export { TpPopover } from "./components/popover/popover.js";
export {
	setupTpPopoverTriggers,
	teardownTpPopoverTriggers,
} from "./components/popover/popover-triggers.js";
export { TpPostIt, type TpPostItColor } from "./components/post-it/post-it.js";
export { TpPostItEditor } from "./components/post-it-editor/post-it-editor.js";
export { TpPrologNotebook } from "./components/prolog-notebook/prolog-notebook.js";
export {
	TpPrologPlayground,
	TpPrologProject,
} from "./components/prolog-playground/prolog-playground.js";
export { TpPrologPlaygroundQuestion } from "./components/prolog-playground-question/prolog-playground-question.js";
export { TpPrologViewer } from "./components/prolog-viewer/prolog-viewer.js";
export { TpPrologViewerQuestion } from "./components/prolog-viewer-question/prolog-viewer-question.js";
export { TpProseEditor } from "./components/prose-editor/prose-editor.js";
export { TpPythonNotebook } from "./components/python-notebook/python-notebook.js";
export {
	TpPythonPlayground,
	TpPythonProject,
} from "./components/python-playground/python-playground.js";
export { TpPythonPlaygroundQuestion } from "./components/python-playground-question/python-playground-question.js";
export { TpPythonViewer } from "./components/python-viewer/python-viewer.js";
export { TpPythonViewerQuestion } from "./components/python-viewer-question/python-viewer-question.js";
export { TpQuestion } from "./components/question/question.js";
export { TpRadioList } from "./components/radio-list/radio-list.js";
export {
	createTpRestructuredTextParser,
	dedentRestructuredTextSource,
	parseRestructuredTextToAst,
	renderRestructuredTextInto,
	renderRestructuredTextToHtml,
	TpRestructuredText,
} from "./components/restructuredtext/restructuredtext.js";
export { TpRestructuredTextMultiPages } from "./components/restructuredtext-multi-pages/restructuredtext-multi-pages.js";
export { TpRestructuredTextMultiSlides } from "./components/restructuredtext-multi-slides/restructuredtext-multi-slides.js";
export {
	TpRestructuredTextPlayground,
	TpRestructuredTextProject,
} from "./components/restructuredtext-playground/restructuredtext-playground.js";
export { TpRestructuredTextSinglePage } from "./components/restructuredtext-single-page/restructuredtext-single-page.js";
export { TpRestructuredTextViewer } from "./components/restructuredtext-viewer/restructuredtext-viewer.js";
export { TpRestructuredTextViewerQuestion } from "./components/restructuredtext-viewer-question/restructuredtext-viewer-question.js";
export {
	TpSaveImage,
	type TpSaveImageFormat,
} from "./components/save-image/save-image.js";
export { TpSidebar } from "./components/sidebar/sidebar.js";
export { TpSingleChoiceQuestion } from "./components/single-choice-question/single-choice-question.js";
export { TpSkeleton } from "./components/skeleton/skeleton.js";
export { TpSlider } from "./components/slider/slider.js";
export { TpSolitaire } from "./components/solitaire/solitaire.js";
export { TpSource } from "./components/source/source.js";
export { TpSpeechToText } from "./components/speech-to-text/speech-to-text.js";
export { TpSplitter } from "./components/splitter/splitter.js";
export {
	setupTpSplitterTriggers,
	teardownTpSplitterTriggers,
} from "./components/splitter/splitter-triggers.js";
export {
	cellCoordinates,
	columnName,
	parseSpreadsheetCsv,
	serializeSpreadsheetCsv,
	TpSpreadsheetEditor,
	type TpSpreadsheetFileFormat,
} from "./components/spreadsheet-editor/spreadsheet-editor.js";
export { TpSqlNotebook } from "./components/sql-notebook/sql-notebook.js";
export {
	type TpSqlDatabase,
	type TpSqlDatabaseType,
	TpSqlPlayground,
	TpSqlProject,
} from "./components/sql-playground/sql-playground.js";
export { TpSqlViewer } from "./components/sql-viewer/sql-viewer.js";
export { TpStack } from "./components/stack/stack.js";
export { TpSudoku } from "./components/sudoku/sudoku.js";
export { TpSwitcher } from "./components/switcher/switcher.js";
export {
	getSymbolMetadata,
	parseHtmlSymbols,
	TpSymbolPicker,
	type TpSymbolPickerCopyFormat,
	type TpSymbolPickerItem,
	type TpSymbolPickerMetadata,
} from "./components/symbol-picker/symbol-picker.js";
export { TpTabs } from "./components/tabs/tabs.js";
export { TpTextToSpeech } from "./components/text-to-speech/text-to-speech.js";
export {
	TpTextfield,
	type TpTextfieldLabelPosition,
	type TpTextfieldType,
} from "./components/textfield/textfield.js";
export { TpTheme } from "./components/theme/theme.js";
export {
	TpTimefield,
	type TpTimefieldLabelPosition,
} from "./components/timefield/timefield.js";
export {
	TpTimeline,
	type TpTimelineOrientation,
} from "./components/timeline/timeline.js";
export { TpTimer } from "./components/timer/timer.js";
export { TpToc } from "./components/toc/toc.js";
export {
	TpToolbar,
	type TpToolbarOrientation,
	type TpToolbarPlacement,
} from "./components/toolbar/toolbar.js";
export { TpTooltip } from "./components/tooltip/tooltip.js";
export {
	setupTpTooltipTriggers,
	teardownTpTooltipTriggers,
} from "./components/tooltip/tooltip-triggers.js";
export { TpTree } from "./components/tree/tree.js";
export { TpTurtle } from "./components/turtle/turtle.js";
export { TpTypescriptNotebook } from "./components/typescript-notebook/typescript-notebook.js";
export {
	TpTypescriptPlayground,
	TpTypescriptProject,
} from "./components/typescript-playground/typescript-playground.js";
export { TpTypescriptPlaygroundQuestion } from "./components/typescript-playground-question/typescript-playground-question.js";
export { TpTypescriptViewer } from "./components/typescript-viewer/typescript-viewer.js";
export { TpTypescriptViewerQuestion } from "./components/typescript-viewer-question/typescript-viewer-question.js";
export { TpTypewriting } from "./components/typewriting/typewriting.js";
export { TpXYPlot, type TpXYPlotData } from "./components/xy-plot/xy-plot.js";
export { TpYakazu } from "./components/yakazu/yakazu.js";

console.log("tp-lib loaded");

export { TpBiblio } from "./components/biblio/biblio.js";
export { TpCalculator } from "./components/calculator/calculator.js";
export { TpGlossary } from "./components/glossary/glossary.js";
export { TpListof } from "./components/listof/listof.js";
export { TpLogigram } from "./components/logigram/logigram.js";
export { TpNote } from "./components/note/note.js";
export { TpRef } from "./components/ref/ref.js";
