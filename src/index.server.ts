import { Workspace } from "@rbxts/services";
import { Phase } from "./classes/phase";
import { Mode } from "./classes/mode";
import config from "./config";
import { TerminalGame } from "./classes/game";

const phase1 = new Phase("Phase 1", Workspace.WaitForChild("Phase 1 Spawns").GetChildren() as SpawnLocation[], 60, 100);

const deathmatch = new Mode("Deathmatch");
deathmatch.setScoreFunction(() => {
	config.RaiderTeam.GetPlayers().forEach((player) => {
		player.CharacterAdded.Connect((character) => {
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;
			humanoid.Died.Connect(() => {
				phase1.score.DefenderScore += 1;
			});
		});
	});
	config.DefenderTeam.GetPlayers().forEach((player) => {
		player.CharacterAdded.Connect((character) => {
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;
			humanoid.Died.Connect(() => {
				phase1.score.RaiderScore += 1;
			});
		});
	});
});

phase1.setModeOrTerminals(deathmatch);

phase1.setWinFunction((team) => {
	print(`${team.Name} won ${phase1.name}!`);
	print(`Raider Score: ${phase1.score.RaiderScore}`);
	print(`Defender Score: ${phase1.score.DefenderScore}`);
});

phase1.start();

phase1.stopped.Once((winner) => {
	if (winner !== undefined) {
		print(`${winner.Name} won!`);
		print(`Raider Score: ${phase1.score.RaiderScore}`);
		print(`Defender Score: ${phase1.score.DefenderScore}`);
	} else {
		print("Nobody won! The game ended early or ended in a tie!");
	}
});

phase1.scored.Connect((score) => {
	print("--------------");
	print(`Raider Score: ${score.RaiderScore}`);
	print(`Defender Score: ${score.DefenderScore}`);
});

// Or,
const terminalgame = new TerminalGame([phase1]);
terminalgame.start();
