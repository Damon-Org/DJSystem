import Modules from '@/src/Modules.js'

export default class DJDisable extends Modules.commandRegistrar.BaseCommand {
    /**
     * @param {string} category
     * @param {Main} main
     */
    constructor(category, main) {
        super(main);

        this.register(DJDisable, {
            category: category,
            guild_only: true,

            name: 'dj disable',
            aliases: [],
            description: 'Disable the DJ system.',
            usage: 'dj disable',
            params: [],
            permissions: {
                logic: 'OR',
                levels: [
                    {
                        type: 'server',
                        name: 'MANAGE_CHANNELS'
                    }
                ]
            },
            example: 'dj disable'
        });

        const { DJMode } = this._m.modules.dj.constants;
        this.mode = DJMode;
    }

    /**
     * @param {string} trigger string representing what triggered the command
     */
    run(trigger) {
        const
            guildSetting = this.modules.guildSetting,
            currentMode = guildSetting.get(this.server.id, 'dj_mode');

        if (!currentMode || currentMode == this.mode['FREEFORALL']) {
            this.send('The DJ system is already disabled.');

            return true;
        }

        this.server.options.delete(3);
        guildSetting.set(this.server.id, 'dj_mode', this.mode['FREEFORALL']);

        this.send('The DJ system has been disabled.');

        return true;
    }
}
