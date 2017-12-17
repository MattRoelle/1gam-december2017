;(function() {
	window._1gam.game = window._1gam.game || {};
	window._1gam.level = {};

	const level = window._1gam.level;

	const entityCtorLookup = {
		"sawblade": _1gam.entities.Sawblade,
		"crusher": _1gam.entities.Crusher,
		"warp": _1gam.entities.Warp,
		"sign": _1gam.entities.Sign,
		"spinner": _1gam.entities.Spinner,
		"kill": _1gam.entities.Kill,
		"conveyor": _1gam.entities.Conveyor,
		"turret": _1gam.entities.Turret,
	};

	level.Level = class Level {
		constructor(tmx) {
			_1gam.p.physics.arcade.TILE_BIAS = 40;
			this.setupParticles();
			this.id = tmx;
			this.loadMap(tmx);
			this.loadEntities();
		}

		setupParticles() {
			this.emitter = _1gam.p.add.emitter(0, 0, 20);
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
			this.map = _1gam.p.add.tilemap(tmx);
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
					_1gam.game.player.sprite.x = e.x;
					_1gam.game.player.sprite.y = e.y;
				} else {
					this.createEntity(e);
				}

			}
		}

		createEntity(definition) {
			console.log(definition.type);
			this.entities.push(new (entityCtorLookup[definition.type])(definition));
		}

		update () {
			if (_1gam.game.player.dead) {
				_1gam.p.physics.arcade.collide(_1gam.game.player.deathEmitter, this.tileLayer);
			} else {
				this.emitter.x = _1gam.game.player.sprite.x - 300;
				this.emitter.y = _1gam.game.player.sprite.y - 300;
				_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.tileLayer);
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
})();
