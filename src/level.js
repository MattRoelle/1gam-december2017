const entityCtorLookup = {
	"sawblade": Sawblade,
	"crusher": Crusher,
	"warp": Warp,
	"sign": Sign,
	"spinner": Spinner,
	"kill": KillZone,
	"conveyor": Conveyor,
	"turret": Turret,
};

class Level {
	constructor(tmx) {
		game.phaser.physics.arcade.TILE_BIAS = 40;
		this.setupParticles();
		this.id = tmx;
		this.loadMap(tmx);
		this.loadEntities();
	}

	setupParticles() {
		this.emitter = game.phaser.add.emitter(0, 0, 20);
		this.emitter.makeParticles("white-particle");
		this.emitter.setXSpeed(-5, 5);
		this.emitter.setYSpeed(-5, -5);
		this.emitter.gravity = 0;
		this.emitter.width = 1500;
		this.emitter.height = 1500;
		this.emitter.setScale(0, 1, 0, 1, -300);
		this.emitter.start(false, 500, 1, 0, false);
	}

	loadMap(tmx) {
		this.map = game.phaser.add.tilemap(tmx);
		this.map.addTilesetImage("tilemap", "tilemap");
		this.tileLayers = [];
		for(let i = 0; i < this.map.layers.length; i++) {
			const newLayer = this.map.createLayer(i);
			if (i == 0) {
				this.tileLayer = newLayer;
			}
			this.tileLayers.push(newLayer);
		}
		this.tileLayer.resizeWorld();
		this.map.setCollisionByExclusion([1]);
	}

	loadEntities() {
		this.entities = [];

		for(let e of this.map.objects.entities) {
			if (e.type == "playerSpawn") {
				game.player.sprite.x = e.x;
				game.player.sprite.y = e.y;
			} else {
				this.createEntity(e);
			}

		}
	}

	createEntity(definition) {
		this.entities.push(new (entityCtorLookup[definition.type])(definition));
	}

	update () {
		if (game.player.dead) {
			game.phaser.physics.arcade.collide(game.player.deathEmitter, this.tileLayer);
		} else {
			this.emitter.x = game.player.sprite.x - 300;
			this.emitter.y = game.player.sprite.y - 300;
			game.phaser.physics.arcade.collide(game.player.sprite, this.tileLayer);
		}
		for(let e of this.entities) {
			e.update();
		}
	};

	render() {
		for(let e of this.entities) {
			e.render();
		}
	};

	destroy() {
		this.map.destroy();
		this.emitter.destroy();
		for(let layer of this.tileLayers) {
			layer.destroy();
		}
		for(let e of this.entities) {
			e.destroy();
		}
	};
}
