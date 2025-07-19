class StatusBarCoin extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coins/blue/100.png'
    ];
    percentage = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
        this.x = 10;
        this.y = 25;
        this.width = 200;
        this.height = 45;
    }
}