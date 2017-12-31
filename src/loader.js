class Loader {
	load(g) {
		g.load.tilemap("title", "assets/levels/title.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level1", "assets/levels/level1.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level2", "assets/levels/level2.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level3", "assets/levels/level3.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level3.5", "assets/levels/level3.5.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level4", "assets/levels/level4.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level5", "assets/levels/level5.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level5.5", "assets/levels/level5.5.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level6", "assets/levels/level6.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level7", "assets/levels/level7.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level7.5", "assets/levels/level7.5.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level8", "assets/levels/level8.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level9", "assets/levels/level9.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level10", "assets/levels/level10.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("balcony", "assets/levels/balcony.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("testlevel", "assets/levels/testlevel.json", null, Phaser.Tilemap.TILED_JSON);

		g.load.image("logo", "assets/logo.png");
		g.load.image("titletext", "assets/titletext.png");

		g.load.image("tilemap", "assets/tilemap.png", 32, 32);
		g.load.spritesheet("grape", "assets/grape.png", 32, 32);
		g.load.spritesheet("door", "assets/door.png", 32, 64);
		g.load.spritesheet("conveyor", "assets/conveyor.png", 15, 30);
		g.load.image("sawblade", "assets/sawblade.png");
		g.load.image("sawblade-base", "assets/sawblade-base.png");
		g.load.image("grape-particle", "assets/grape-particle.png");
		g.load.image("white-particle", "assets/white-particle.png");
		g.load.image("crusher-base", "assets/crusher-base.png");
		g.load.image("crusher-head", "assets/crusher-head.png");
		g.load.image("crusher-arm", "assets/crusher-arm.png");
		g.load.image("warp", "assets/warp.png");
		g.load.image("sign", "assets/sign.png");
		g.load.image("arrow", "assets/arrow.png");
		g.load.image("text-bg", "assets/text.png");
		g.load.image("ui-bg", "assets/ui-top.png");
		g.load.image("dead-grape", "assets/dead-grape.png");
		g.load.image("mute", "assets/mute.png");
		g.load.image("unmute", "assets/unmute.png");

		g.load.image("spinner-base", "assets/spinner-base.png");
		g.load.image("spinner-head", "assets/spinner-head.png");
		g.load.image("spinner-arm", "assets/spinner-arm.png");

		g.load.image("turret", "assets/turret.png");
		g.load.image("turret-bullet", "assets/bullet.png");

		g.load.audio("music", ["assets/audio/theme.ogg"]);
		g.load.audio("walk", ["assets/audio/walk.wav"]);
		g.load.audio("walk2", ["assets/audio/walk2.wav"]);
		g.load.audio("jump", ["assets/audio/jump.wav"]);
		g.load.audio("death", ["assets/audio/death.wav"]);
		g.load.audio("deathexpl", ["assets/audio/deathexpl.wav"]);
		g.load.audio("door", ["assets/audio/door.wav"]);
		g.load.audio("door2", ["assets/audio/door2.wav"]);
	}
}

loader = new Loader();
