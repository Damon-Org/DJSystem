import Modules from '@/src/Modules.js'

export default class DJLock extends Modules.dj.DJCommand {
    /**
     * @param {string} category
     * @param {Main} main
     */
    constructor(category, main) {
        super(main);

        this.register(DJLock, {
            category: category,
            guild_only: true,

            name: 'dj lock',
            aliases: [
                'dj unlock'
            ],
            description: 'Lock the playlist from being modified by non DJ users.',
            usage: 'dj lock',
            params: [],
            example: 'dj lock'
        });
    }

    /**
     * @param {string} trigger string representing what triggered the command
     */
    run(trigger) {
        if (!this.voiceChannel) {
            this.reply('where are you? I can\'t seem to find you in any voice channel. <:thinking_hard:560389998806040586>')
                .then(msg => setTimeout(msg.delete, 5e3));

            return true;
        }

        if (!this.music.active()) {
            this.reply('tell me to play some music for you before using this command. 🎵')
                .then(msg => setTimeout(msg.delete, 5e3));

            return true;
        }

        if (!this.music.isDamonInVC(this.voiceChannel)) {
            this.reply('you aren\'t in my voice channel! 😣')
                .then(msg => setTimeout(msg.delete, 5e3));

            return true;
        }

        this.dj.playlistLock = command === 'dj lock' ? true : false;
        if (command === 'dj lock') {
            this.send('I\'ve locked the playlist, only DJ\'s can add songs now.');

            return true;
        }

        this.send('I\'ve unlocked the playlist, everyone can add songs again!');

        return true;
    }
}
