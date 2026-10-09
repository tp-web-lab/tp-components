/** Adds language, voice and sample-text controls to the documentation example. */
export function setupVoiceComparison(root = document) {
	const speech = root.querySelector("#voice-comparison");
	if (!speech || speech.hasAttribute("data-voice-selector-ready")) return;
	speech.setAttribute("data-voice-selector-ready", "");
	const doc = speech.ownerDocument;
	const synthesis = doc.defaultView?.speechSynthesis;
	const initialLanguage = speech.getAttribute("lang")?.trim() || "en-US";
	// Keep the author's language family even when a regional variant is selected.
	const languageFamily = initialLanguage.split("-")[0].toLowerCase();
	const samples = {
		en: "Welcome to tp-components. You can pause this reading and resume it whenever you want.",
		fr: "Bienvenue dans tp-components. Vous pouvez mettre cette lecture en pause, puis la reprendre à votre rythme.",
	};
	const languageLabel = doc.createElement("label");
	languageLabel.textContent = "Language: ";
	const language = doc.createElement("select");
	language.dataset.role = "speech-language";
	languageLabel.append(language);
	const voiceLabel = doc.createElement("label");
	voiceLabel.textContent = "Voice: ";
	const select = doc.createElement("select");
	select.dataset.role = "speech-voice";
	voiceLabel.append(select);
	const textLabel = doc.createElement("label");
	textLabel.textContent = "Text to speak: ";
	const text = doc.createElement("textarea");
	text.rows = 3;
	text.value = speech.getAttribute("value") || samples[languageFamily] || "";
	textLabel.append(text);
	const status = doc.createElement("p");
	status.setAttribute("role", "status");
	speech.before(languageLabel, voiceLabel, textLabel, status);
	let availableVoices = [];

	/** Lists only voices for the selected locale, keeping Automatic available. */
	function refreshVoiceOptions() {
		const previous = select.value;
		select.replaceChildren();
		const automatic = doc.createElement("option");
		automatic.value = "";
		automatic.textContent = `Automatic (browser default for ${language.value})`;
		select.append(automatic);
		const voices = availableVoices.filter(
			(voice) => voice.lang.toLowerCase() === language.value.toLowerCase(),
		);
		for (const voice of voices) {
			const option = doc.createElement("option");
			option.value = voice.voiceURI;
			option.textContent = `${voice.name}${voice.localService ? " (local)" : " (online)"}`;
			option.dataset.name = voice.name;
			select.append(option);
		}
		select.value = previous;
		if (select.selectedIndex < 0) {
			select.value = "";
			speech.stop?.();
			speech.removeAttribute("voice");
		}
		select.disabled = synthesis === undefined;
		status.textContent =
			synthesis === undefined
				? "Speech synthesis is unavailable in this browser."
				: `${voices.length} voices available for ${language.value}. Choose a voice, then press Speak.`;
	}

	/** Loads only locales in the initial lang family, including asynchronously added voices. */
	function refreshVoices() {
		const previous = language.value || initialLanguage;
		availableVoices = synthesis?.getVoices() ?? [];
		const locales = [
			...new Set([
				initialLanguage,
				previous,
				...availableVoices
					.map((voice) => voice.lang)
					.filter(
						(locale) => locale.split("-")[0].toLowerCase() === languageFamily,
					),
			]),
		].sort();
		language.replaceChildren();
		for (const locale of locales) {
			const option = doc.createElement("option");
			option.value = locale;
			option.textContent = locale;
			language.append(option);
		}
		language.value = previous;
		language.disabled = synthesis === undefined;
		refreshVoiceOptions();
	}

	/** Stops speech before applying a voice, without starting a new reading. */
	function selectVoice() {
		speech.stop?.();
		const option = select.selectedOptions[0];
		speech.setAttribute("lang", language.value);
		if (option?.dataset.name) {
			speech.setAttribute("voice", option.dataset.name);
			status.textContent = `Selected voice: ${option.dataset.name} (${language.value}). Use this name in the voice attribute.`;
		} else {
			speech.removeAttribute("voice");
			status.textContent =
				"Automatic voice selection restored. Press Speak to listen.";
		}
	}

	/** Resets the voice and supplies a matching sample, or invites custom text. */
	function selectLanguage() {
		speech.stop?.();
		speech.removeAttribute("voice");
		speech.setAttribute("lang", language.value);
		select.value = "";
		const baseLanguage = language.value.split("-")[0].toLowerCase();
		text.value = samples[baseLanguage] ?? "";
		text.placeholder = `Enter text in ${language.value}.`;
		speech.setAttribute("value", text.value);
		refreshVoiceOptions();
	}

	/** Keeps the component source aligned with the editable comparison text. */
	function updateText() {
		speech.stop?.();
		speech.setAttribute("value", text.value);
	}

	language.addEventListener("change", selectLanguage);
	select.addEventListener("change", selectVoice);
	text.addEventListener("input", updateText);
	synthesis?.addEventListener("voiceschanged", refreshVoices);
	doc.defaultView?.addEventListener(
		"pagehide",
		() => {
			synthesis?.removeEventListener("voiceschanged", refreshVoices);
			language.removeEventListener("change", selectLanguage);
			select.removeEventListener("change", selectVoice);
			text.removeEventListener("input", updateText);
		},
		{ once: true },
	);
	refreshVoices();
}

setupVoiceComparison();
