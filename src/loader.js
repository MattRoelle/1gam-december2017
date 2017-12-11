;(function() {
	window._1gam.loader = window._1gam.loader || {};
	const loader = window._1gam.loader;

	loader.load = (g) => {
		g.load.tilemap("level1", "assets/level1.json", null, Phaser.Tilemap.TILED_JSON);
		g.load.image("tilemap", "assets/tilemap.png", 32, 32);
		g.load.spritesheet("grape", "assets/grape.png", 32, 32);
		g.load.image("sawblade", "assets/sawblade.png");
		g.load.image("sawblade-base", "assets/sawblade_base.png");
		g.load.image("grape-particle", "assets/grape-particle.png");
		g.load.image("white-particle", "assets/white-particle.png");
		g.load.image("crusher-base", "assets/crusher-base.png");
		g.load.image("crusher-head", "assets/crusher-head.png");
		g.load.image("crusher-arm", "assets/crusher-arm.png");
	};
})();
