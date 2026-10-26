import { afterEach, expect, it, vi } from "vitest";
import { TpSaveAudio } from "./save-audio.js";

afterEach(() => document.body.replaceChildren());
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
