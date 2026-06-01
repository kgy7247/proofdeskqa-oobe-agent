import Phaser from "phaser";

const TARGET_TOKENS = 8;

type Velocity = {
  x: number;
  y: number;
};

export class ProofRunnerScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private tokens!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private scoreText!: Phaser.GameObjects.Text;
  private stateText!: Phaser.GameObjects.Text;
  private collected = 0;
  private resetTimer = 0;

  constructor() {
    super("proof-runner");
  }

  create(): void {
    this.createTextures();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;

    this.addGrid();
    this.tokens = this.physics.add.group();
    this.hazards = this.physics.add.group();

    this.player = this.physics.add.sprite(90, 90, "runner");
    this.player.setCollideWorldBounds(true);
    this.player.setDrag(900);
    this.player.setMaxVelocity(260);

    this.scoreText = this.add.text(22, 18, "proof 0/8", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#f5f8fb"
    });
    this.stateText = this.add.text(22, 44, "collect evidence tokens", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#aeb9c8"
    });

    this.spawnTokens();
    this.spawnHazards();

    this.physics.add.overlap(this.player, this.tokens, (_, token) => this.collectToken(token as Phaser.Physics.Arcade.Sprite));
    this.physics.add.overlap(this.player, this.hazards, () => this.hitHazard());
    this.scale.on("resize", this.onResize, this);
    this.emitTokenCount();
  }

  update(_time: number, delta: number): void {
    const velocity = this.readMovement();
    this.player.setAcceleration(velocity.x * 720, velocity.y * 720);
    this.player.setAngle(this.player.body!.velocity.x * 0.06);

    this.hazards.children.iterate((child) => {
      const hazard = child as Phaser.Physics.Arcade.Sprite;
      if (hazard.x < 20 || hazard.x > this.scale.width - 20) {
        hazard.setVelocityX(-hazard.body!.velocity.x);
      }
      if (hazard.y < 20 || hazard.y > this.scale.height - 20) {
        hazard.setVelocityY(-hazard.body!.velocity.y);
      }
      return true;
    });

    this.resetTimer = Math.max(0, this.resetTimer - delta);
  }

  private readMovement(): Velocity {
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    return {
      x: Number(right) - Number(left),
      y: Number(down) - Number(up)
    };
  }

  private createTextures(): void {
    const runner = this.add.graphics();
    runner.fillStyle(0x63e6be, 1);
    runner.fillRoundedRect(2, 6, 34, 24, 8);
    runner.fillStyle(0x0b1016, 1);
    runner.fillCircle(28, 18, 4);
    runner.generateTexture("runner", 38, 38);
    runner.destroy();

    const token = this.add.graphics();
    token.fillStyle(0xf5c542, 1);
    token.fillCircle(16, 16, 12);
    token.lineStyle(3, 0xfff6c7, 1);
    token.strokeCircle(16, 16, 9);
    token.generateTexture("token", 32, 32);
    token.destroy();

    const hazard = this.add.graphics();
    hazard.fillStyle(0xff5a5f, 1);
    hazard.fillTriangle(18, 2, 34, 34, 2, 34);
    hazard.lineStyle(2, 0xffced0, 1);
    hazard.strokeTriangle(18, 2, 34, 34, 2, 34);
    hazard.generateTexture("hazard", 36, 36);
    hazard.destroy();
  }

  private addGrid(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2c3642, 0.45);
    for (let x = 0; x < 1200; x += 48) {
      graphics.lineBetween(x, 0, x, 900);
    }
    for (let y = 0; y < 900; y += 48) {
      graphics.lineBetween(0, y, 1200, y);
    }
  }

  private spawnTokens(): void {
    const positions = [
      [220, 100],
      [390, 120],
      [680, 150],
      [780, 320],
      [580, 410],
      [340, 360],
      [170, 430],
      [720, 480]
    ];

    positions.forEach(([x, y]) => {
      const token = this.tokens.create(x, y, "token") as Phaser.Physics.Arcade.Sprite;
      token.setCircle(13);
      this.tweens.add({
        targets: token,
        y: y - 8,
        yoyo: true,
        repeat: -1,
        duration: 900 + Math.random() * 500,
        ease: "Sine.easeInOut"
      });
    });
  }

  private spawnHazards(): void {
    [
      { x: 520, y: 250, vx: 150, vy: 110 },
      { x: 270, y: 250, vx: -120, vy: 95 },
      { x: 720, y: 90, vx: 90, vy: 150 }
    ].forEach((item) => {
      const hazard = this.hazards.create(item.x, item.y, "hazard") as Phaser.Physics.Arcade.Sprite;
      hazard.setVelocity(item.vx, item.vy);
      hazard.setBounce(1);
      hazard.setCollideWorldBounds(true);
    });
  }

  private collectToken(token: Phaser.Physics.Arcade.Sprite): void {
    token.disableBody(true, true);
    this.collected += 1;
    this.scoreText.setText(`proof ${this.collected}/${TARGET_TOKENS}`);
    this.stateText.setText(this.collected >= TARGET_TOKENS ? "delivery proof complete" : "evidence secured");
    this.cameras.main.flash(90, 245, 197, 66);
    this.emitTokenCount();
  }

  private hitHazard(): void {
    if (this.resetTimer > 0) {
      return;
    }
    this.resetTimer = 900;
    this.collected = Math.max(0, this.collected - 1);
    this.scoreText.setText(`proof ${this.collected}/${TARGET_TOKENS}`);
    this.stateText.setText("error hit: proof token lost");
    this.cameras.main.shake(180, 0.012);
    this.player.setPosition(90, 90);
    this.emitTokenCount();
  }

  private emitTokenCount(): void {
    window.dispatchEvent(new CustomEvent("proof-token-change", {
      detail: {
        current: this.collected,
        target: TARGET_TOKENS
      }
    }));
  }

  private onResize(): void {
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
  }
}
