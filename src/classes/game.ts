import { Phase } from "./phase";

export class TerminalGame {
	public currentPhase = 0;
	public active = false;

	private startedEvent = new Instance("BindableEvent");
	private stoppedEvent = new Instance("BindableEvent");
	private phaseChangedEvent = new Instance("BindableEvent");
	public started = this.startedEvent.Event;
	public stopped = this.stoppedEvent.Event;
	public phaseChanged = this.phaseChangedEvent.Event;

	constructor(public phases: Phase[]) {}

	public start() {
		this.active = true;
		this.startedEvent.Fire();

		while (this.active) {
			this.phases[this.currentPhase].start();
			this.phaseChangedEvent.Fire(this.currentPhase);
			this.currentPhase += 1;
			if (this.currentPhase >= this.phases.size()) {
				this.stop();
			}
		}
	}

	public stop() {
		this.active = false;
		this.stoppedEvent.Fire();

		this.phases[this.currentPhase].stop();
	}

	public reset() {
		this.currentPhase = 0;
	}
}
