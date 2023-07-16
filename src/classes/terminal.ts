import { Zone } from "@rbxts/zone-plus";
import config from "../config";

export class Terminal {
	public zone: Zone;
	public raiderPoints = 0;
	public defenderPoints = 0;
	public active = false;
	public captureProgress = 50;
	public scoreFunction: undefined | ((team: Team) => void);

	private startedEvent = new Instance("BindableEvent");
	private stoppedEvent = new Instance("BindableEvent");
	private capturedEvent = new Instance("BindableEvent");
	public started = this.startedEvent.Event;
	public stopped = this.stoppedEvent.Event;
	public captured = this.capturedEvent.Event;

	constructor(
		public readonly name: string,
		public part: Part,
		public captureSpeed: number = 10,
		public raiderCanCapture: boolean = true,
		public defenderCanCapture: boolean = true,
	) {
		this.zone = new Zone(part);
	}

	public start() {
		this.active = true;

		this.startedEvent.Fire();

		if (this.scoreFunction === undefined) {
			this.stop();
			return;
		}

		while (this.active) {
			this.zone.getPlayers().forEach((player) => {
				if (player.Team === config.RaiderTeam) {
					this.captureProgress += this.captureSpeed;
				} else if (player.Team === config.DefenderTeam) {
					this.captureProgress -= this.captureSpeed;
				}
				if (this.captureProgress > 100) {
					this.captureProgress = 100;
				} else if (this.captureProgress < 0) {
					this.captureProgress = 0;
				}
			});

			if (this.captureProgress === 100 && this.raiderCanCapture) {
				this.capturedEvent.Fire(config.RaiderTeam);
				this.scoreFunction(config.RaiderTeam);
			} else if (this.captureProgress === 0 && this.defenderCanCapture) {
				this.capturedEvent.Fire(config.DefenderTeam);
				this.scoreFunction(config.DefenderTeam);
			}

			task.wait(1);
		}
	}

	public stop() {
		this.active = false;

		this.stoppedEvent.Fire();
	}

	public reset() {
		this.captureProgress = 50;
		this.raiderPoints = 0;
		this.defenderPoints = 0;
	}

	public setScoreFunction(scoreFunction: (team: Team) => void) {
		this.scoreFunction = scoreFunction;
	}
}
