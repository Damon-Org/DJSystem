import Modules from '@/src/Modules.js'

export default class DJPersistMode extends Modules.commandRegistrar.BaseCommand {
    /**
     * @param {string} category
     * @param {Main} main
     */
    constructor(category, main) {
        super(main);

        this.register(DJPersistMode, {
            category: category,
            guild_only: true,

            name: 'dj persistmode',
            aliases: [
                'dj persist mode'
            ],
            description: 'This will enforce a set DJ mode on the server.',
            usage: 'dj persistmode <# mode>',
            params: [
                {
                    name: 'mode',
                    description: 'The new mode to be used for DJ\'s',
                    type: 'string',
                    required: true
                }
            ],
            example: 'dj persistmode'
        });

        const { DJMode } = this._m.modules.dj.constants;
        this.mode = DJMode;
    }

    /**
     * @param {string} trigger string representing what triggered the command
     */
    run(trigger) {
        const mode = this.mode[this.args[0].toUpperCase()];
        if (mode) {
            this.dj.setMode(mode, true);

            this.send(`Changed DJ mode to \`${this.args[0].toUpperCase()}\``);

            return true;
        }

        this.send(`Unknown DJ mode, use \`${this.server.prefix}dj info\` to get more information around the DJ system.`)
            .then(msg => setTimeout(msg.delete, 5e3));

        return true;
    }
}
