import config from "../config";
import { Mode } from "./mode";
import { Terminal } from "./terminal";

export class Phase {
	public startTime = 0;
	public active = false;
	public score = {
		RaiderScore: 0,
		DefenderScore: 0,
	};
	public modeOrTerminals: Terminal[] | Mode | undefined;
	public winFunction: undefined | ((team: Team) => void);

	private startedEvent = new Instance("BindableEvent");
	private stoppedEvent = new Instance("BindableEvent");
	private scoredEvent = new Instance("BindableEvent");
	public started = this.startedEvent.Event;
	public stopped = this.stoppedEvent.Event;
	public scored = this.scoredEvent.Event;

	constructor(
		public name: string,
		public spawns: SpawnLocation[],
		public maxTime: number,
		public winScore: number,
	) {}

	public start() {
		this.startTime = tick();
		this.active = true;
		this.startedEvent.Fire();

		if (this.modeOrTerminals === undefined) {
			this.stop();
			return;
		}

		if (this.modeOrTerminals instanceof Mode) {
			this.modeOrTerminals.start();
		} else {
			this.modeOrTerminals.forEach((terminal) => {
				terminal.start();
			});
		}

		while (this.active) {
			const oldScore = this.score;
			if (tick() - this.startTime >= this.maxTime) {
				this.stop();
			} else if (this.score.RaiderScore >= this.winScore || this.score.DefenderScore >= this.winScore) {
				this.stop();
			}
			task.wait(1);
			if (
				oldScore.RaiderScore !== this.score.RaiderScore ||
				oldScore.DefenderScore !== this.score.DefenderScore
			) {
				this.scoredEvent.Fire(this.score);
			}
		}
	}

	public stop() {
		this.active = false;
		if (this.modeOrTerminals instanceof Mode) {
			this.modeOrTerminals.stop();
		} else if (this.modeOrTerminals !== undefined) {
			this.modeOrTerminals.forEach((terminal) => {
				terminal.stop();
			});
		}

		this.stoppedEvent.Fire();

		if (this.winFunction === undefined) {
			return;
		}

		if (this.score.RaiderScore >= this.winScore) {
			this.winFunction(config.RaiderTeam);
		} else if (this.score.DefenderScore >= this.winScore) {
			this.winFunction(config.DefenderTeam);
		} else {
			this.winFunction(config.NeutralTeam);
		}
	}

	public reset() {
		this.active = false;
		this.score = {
			RaiderScore: 0,
			DefenderScore: 0,
		};
	}

	public setModeOrTerminals(modeOrTerminals: Terminal[] | Mode) {
		this.modeOrTerminals = modeOrTerminals;
	}

	public setWinFunction(winFunction: (team: Team) => void) {
		this.winFunction = winFunction;
	}
}
