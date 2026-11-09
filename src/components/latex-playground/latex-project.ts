/** @module components/latex-playground/latex-project */
import { TpProject } from "../playground/project.js";
/** Serializable LaTeX project, using the shared playground file model. */
export class TpLatexProject extends TpProject {
	public override clone(): TpLatexProject {
		return new TpLatexProject(this.toJSON());
	}
}
