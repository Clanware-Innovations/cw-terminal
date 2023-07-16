import config from "../config";

export class Mode {
	public active = false;
	public scoreFunction: undefined | (() => void);

	constructor(public name: string) {}

	public start() {
		this.active = true;

		if (this.scoreFunction === undefined) {
			this.stop();
			return;
		}
		this.scoreFunction();
	}

	public stop() {
		this.active = false;
	}

	public setScoreFunction(scoreFunction: () => void) {
		this.scoreFunction = scoreFunction;
	}
}
