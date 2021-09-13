import DJCommand from '../../../structures/commands/DJCommand.js'

export default class DJLeave extends DJCommand {
    /**
     * @param {string} category
     * @param {Main} main
     */
    constructor(category, main) {
        super(main);

        this.register(DJLeave, {
            category: category,
            guild_only: true,

            name: 'dj leave',
            aliases: [
                'resign'
            ],
            description: 'Add a DJ user.',
            usage: 'dj leave',
            params: [],
            example: 'dj leave'
        });
    }

    /**
     * @param {string} command string representing what triggered the command
     */
    async run(command) {
        if (!this.voiceChannel) {
            this.reply('where are you? I can\'t seem to find you in any voice channel. <:thinking_hard:560389998806040586>')
                .then(msg => setTimeout(msg.delete, 5e3));

            return true;
        }

        if (!this.music.isDamonInVC(this.voiceChannel)) {
            this.reply('you aren\'t in my voice channel! 😣')
                .then(msg => setTimeout(msg.delete, 5e3));

            return true;
        }

        this.dj.resign(this.serverMember);

        this.reply('bye bye DJ. 👋');

        return true;
    }
}
