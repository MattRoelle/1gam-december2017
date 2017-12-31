const SFX_TYPES = {
	WALK: { 
		key: "walk",
		volume: 0.125
	},
	WALK2: { 
		key: "walk2",
		volume: 0.125
	},
	JUMP: { 
		key: "jump",
		volume: 0.3
	},
	DEATH: { 
		key: "death",
		volume: 1
	},
	DEATH_EXPLOSION: { 
		key: "deathexpl",
		volume: 0.7
	},
	DOOR: { 
		key: "door",
		volume: 0.2
	},
	DOOR2: { 
		key: "door2",
		volume: 0.2
	},
};
 
class GameAudio {
	constructor() {
		this.muted = false;
	}

	toggleMute() {
		this.muted = !this.muted;
		game.phaser.sound.volume = this.muted ? 0 : 1;
		return this.muted;
	}

	playMusic() {
		this.music.play();
	}

	pauseMusic() {
		this.music.pause();
	}

	startMusic() {
		this.music = game.phaser.add.audio("music");
		this.music.loop = true;
		this.music.volume = 0.45;
		this.playMusic();
	}

	playSfx(s) {
		const sfx = game.phaser.add.audio(s.key);
		sfx.volume = s.volume;
		sfx.play();
	}
}
