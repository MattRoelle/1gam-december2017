class Input {
	constructor() {
	}

	init() {
		this.movement = game.phaser.input.keyboard.createCursorKeys();
		this.jump = game.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.interact = game.phaser.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.w = game.phaser.input.keyboard.addKey(Phaser.Keyboard.W);
		this.a = game.phaser.input.keyboard.addKey(Phaser.Keyboard.A);
		this.d = game.phaser.input.keyboard.addKey(Phaser.Keyboard.D);
		this.jumpLastFrame = false;
		this.jumping = false;
	}

	update() {
		if (this.jump.isDown) {
			this.jumping = !this.jumpLastFrame;
			this.jumpLastFrame = true;
		} else {
			this.jumpLastFrame = false;
		}
	}

	left() { return this.movement.left.isDown || this.a.isDown; } 
	right() { return this.movement.right.isDown || this.d.isDown; } 
	up() { return this.movement.up.isDown || this.w.isDown; } 
	isJumping() { return this.jumping; }
}
