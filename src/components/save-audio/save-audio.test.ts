import { afterEach, expect, it, vi } from "vitest";
import { TpSaveAudio } from "./save-audio.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.clearAllMocks();
	vi.restoreAllMocks();
});
it("delegates to an anchored provider and marks only successful formats", async () => {
	const target = document.createElement("div") as HTMLDivElement & {
		saveAudio: ReturnType<typeof vi.fn>;
	};
	target.id = "audio-source";
	target.saveAudio = vi.fn().mockResolvedValue(true);
	const control = new TpSaveAudio();
	control.anchor = "#audio-source";
	control.filename = "My voice.wav";
	document.body.append(target, control);
	const saved = vi.fn();
	control.addEventListener("tp-save-audio-save", saved);
	await control.save("ogg");
	expect(target.saveAudio).toHaveBeenCalledWith("ogg", "My-voice");
	expect(control.format).toBe("ogg");
	expect(saved).toHaveBeenCalledOnce();
	target.saveAudio.mockResolvedValue(false);
	await control.save("wav");
	expect(control.format).toBe("ogg");
	expect(saved).toHaveBeenCalledOnce();
	control.disabled = true;
	await control.save("mp3");
	expect(target.saveAudio).toHaveBeenCalledTimes(2);
});
it("reports invalid providers and recovers after errors", async () => {
	const control = new TpSaveAudio();
	document.body.append(control);
	const error = vi.fn();
	control.addEventListener("tp-save-audio-error", error);
	await expect(control.save()).rejects.toThrow("must implement saveAudio");
	expect(error).toHaveBeenCalledOnce();
	control.target = { saveAudio: vi.fn().mockResolvedValue(true) };
	await control.save("wav");
	expect(control.format).toBe("wav");
	expect(
		control.querySelector("tp-icon-button")?.hasAttribute("disabled"),
	).toBe(false);
});
it("prevents duplicate requests while a save is pending", async () => {
	const control = new TpSaveAudio();
	let finish: (saved: boolean) => void = () => {};
	const saveAudio = vi.fn(
		() =>
			new Promise<boolean>((resolve) => {
				finish = resolve;
			}),
	);
	control.target = { saveAudio };
	document.body.append(control);
	const saving = control.save("wav");
	await control.save("ogg");
	expect(saveAudio).toHaveBeenCalledOnce();
	finish(true);
	await saving;
	expect(control.format).toBe("wav");
});

it.each(["Enter", " "])("saves with the %s key", async (key) => {
	const control = new TpSaveAudio();
	const saveAudio = vi.fn().mockResolvedValue(true);
	control.target = { saveAudio };
	document.body.append(control);
	control
		.querySelector('[data-format="wav"]')
		?.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
	await vi.waitFor(() => expect(saveAudio).toHaveBeenCalledOnce());
	expect(saveAudio).toHaveBeenCalledWith("wav", "audio");
});

it("uses the component icon by default and preserves custom trigger icons", () => {
	const control = new TpSaveAudio();
	document.body.append(control);
	const trigger = control.querySelector("tp-icon-button");
	expect(trigger?.getAttribute("name")).toBe("save-audio");
	expect(trigger?.getAttribute("library")).toBe("components");
	control.name = "heart";
	expect(trigger?.getAttribute("name")).toBe("heart");
	expect(trigger?.hasAttribute("library")).toBe(false);
});

it("downloads matching native sources without renaming unsupported formats", async () => {
	const { chooseSaveTarget, saveBlob } = await import(
		"../../utilities/save-file.js"
	);
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "sample.mp3" });
	vi.mocked(saveBlob).mockResolvedValue();
	const fetch = vi
		.spyOn(globalThis, "fetch")
		.mockResolvedValue(
			new Response(new Blob(["audio"], { type: "audio/mpeg" })),
		);
	document.body.innerHTML =
		'<audio id="sample"><source src="/sample.mp3" type="audio/mpeg"></audio>';
	const control = new TpSaveAudio();
	control.anchor = "#sample";
	control.filename = "sample";
	document.body.append(control);
	expect(
		control.querySelector('[data-format="wav"]')?.getAttribute("aria-disabled"),
	).toBe("true");
	expect(
		control.querySelector('[data-format="wav"]')?.hasAttribute("hidden"),
	).toBe(true);
	expect(
		control.querySelector('[data-format="ogg"]')?.hasAttribute("hidden"),
	).toBe(true);
	expect(
		control.querySelector('[data-format="mp3"]')?.hasAttribute("hidden"),
	).toBe(false);
	await control.save("mp3");
	expect(fetch).toHaveBeenCalledWith(
		new URL("/sample.mp3", document.baseURI).href,
	);
	expect(saveBlob).toHaveBeenCalledOnce();
	await expect(control.save("wav")).rejects.toThrow("No WAV source");
	expect(fetch).toHaveBeenCalledTimes(1);
	vi.mocked(chooseSaveTarget).mockResolvedValue(null);
	await control.save("mp3");
	expect(fetch).toHaveBeenCalledTimes(1);
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "sample.mp3" });
	fetch.mockResolvedValue(new Response(null, { status: 404 }));
	await expect(control.save("mp3")).rejects.toThrow("404");
	expect(saveBlob).toHaveBeenCalledOnce();
	fetch.mockRestore();
});

it("shows only the playing source format and refreshes when the source changes", () => {
	document.body.innerHTML =
		'<audio id="sample"><source src="/sample.mp3" type="audio/mpeg"><source src="/sample.ogg" type="audio/ogg"></audio>';
	const audio = document.querySelector("audio");
	if (!audio) throw new Error("Missing audio fixture");
	let current = new URL("/sample.ogg", document.baseURI).href;
	Object.defineProperty(audio, "currentSrc", { get: () => current });
	const control = new TpSaveAudio();
	control.anchor = "#sample";
	document.body.append(control);
	const visible = () =>
		[...control.querySelectorAll<HTMLElement>("[data-format]")]
			.filter((item) => !item.hidden)
			.map((item) => item.dataset.format);
	expect(visible()).toEqual(["ogg"]);
	current = new URL("/sample.mp3", document.baseURI).href;
	control
		.querySelector("tp-icon-button")
		?.dispatchEvent(new MouseEvent("click"));
	expect(visible()).toEqual(["mp3"]);
});
