import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        const width = this.scale.width / 2;
        const height = this.scale.height / 2;

        const flat = this.add.image(width, height, 'flat');
        const gloss = this.add.image(width, height + flat.height, 'gloss');
        const gradient = this.add.image(width, height + flat.height * 2, 'gradient');
    }
}
