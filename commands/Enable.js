import Modules from '@/src/Modules.js'

export default class DJEnable extends Modules.commandRegistrar.BaseCommand {
    /**
     * @param {string} category
     * @param {Main} main
     */
    constructor(category, main) {
        super(main);

        this.register(DJEnable, {
            category: category,
            guild_only: true,

            name: 'dj enable',
            aliases: [],
            description: 'Enable the DJ system.',
            usage: 'dj enable',
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
            example: 'dj enable'
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
            this.server.options.update(3, this.mode['MANAGED']);
            guildSetting.set(this.server.id, 'dj_mode', this.mode['MANAGED']);

            this.send('The DJ system has been enabled.');

            return true;
        }

        this.send('The DJ system is already enabled!');

        return true;
    }
}
