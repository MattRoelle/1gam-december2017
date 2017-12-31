class Input {
	constructor() {
	}

	init() {
		game.phaser.input.gamepad.start();
		this.gamepad = game.phaser.input.gamepad.pad1;
		this.movement = game.phaser.input.keyboard.createCursorKeys();
		this.jump = game.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.interact = game.phaser.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.w = game.phaser.input.keyboard.addKey(Phaser.Keyboard.W);
		this.a = game.phaser.input.keyboard.addKey(Phaser.Keyboard.A);
		this.d = game.phaser.input.keyboard.addKey(Phaser.Keyboard.D);
		this.pause = game.phaser.input.keyboard.addKey(Phaser.Keyboard.P);
		this.jumpLastFrame = false;
		this.jumping = false;
	}

	update() {
		if (this.jump.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)) {
			this.jumping = !this.jumpLastFrame;
			this.jumpLastFrame = true;
		} else {
			this.jumpLastFrame = false;
		}
	}

	left() { return this.movement.left.isDown || this.a.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1; } 
	right() { return this.movement.right.isDown || this.d.isDown  || this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1; } 
	up() { return this.movement.up.isDown || this.w.isDown  || this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1; } 
	isJumpDown() { return this.jump.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A); }
	isPauseDown() { return this.pause.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_START); }
	isJumping() { return this.jumping; }
}
