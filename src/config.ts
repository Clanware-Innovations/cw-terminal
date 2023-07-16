import { Teams } from "@rbxts/services";

export default {
	DefenderTeam: Teams.WaitForChild("Defenders") as Team,
	RaiderTeam: Teams.WaitForChild("Raiders") as Team,
	NeutralTeam: Teams.WaitForChild("Neutral") as Team,
};
