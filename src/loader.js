class Loader {
	load(g) {
		g.load.tilemap("level1", "assets/levels/level1.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level2", "assets/levels/level2.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level3", "assets/levels/level3.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level4", "assets/levels/level4.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level5", "assets/levels/level5.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("level6", "assets/levels/level6.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.tilemap("testlevel", "assets/levels/testlevel.json", null, Phaser.Tilemap.TILED_JSON);

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

		g.load.image("spinner-base", "assets/spinner-base.png");
		g.load.image("spinner-head", "assets/spinner-head.png");
		g.load.image("spinner-arm", "assets/spinner-arm.png");

		g.load.image("turret", "assets/turret.png");
		g.load.image("turret-bullet", "assets/bullet.png");

	}
}

loader = new Loader();
