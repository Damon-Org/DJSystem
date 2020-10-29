import ServerModule from './structures/ServerModule.js'
import Constants, { DJMode, RevokeTime } from './util/Constants.js'
import DJUser from './structures/dj/User.js'
import { GuildMember } from 'discord.js'

export default class DJSystem extends ServerModule {
    _cache = new Map();

    /**
     * @param {Main} main
     * @param {Guild} server
     */
    constructor(main, server) {
        super(main, server);

        this.register(DJSystem, {
            name: 'dj',
            scope: 'server',
            requires: [
                'music'
            ]
        });

        if (this.server !== -1 && this.modules.mongodb.ready) this.reset();
    }

    get constants() {
        return Constants;
    }

    /**
     * @param {GuildMember}
     */
    add(serverMember) {
        if (this.mode != DJMode['MANAGED']) return;

        this.users.set(serverMember.id, new DJUser(this, serverMember));
    }

    /**
     * @param {GuildMemberResolvable} guildMemberResolvable
     */
    has(guildMemberResolvable) {
        if (this.mode != DJMode['MANAGED']) return true;

        const serverMemberId = guildMemberResolvable instanceof GuildMember ? guildMemberResolvable.id : guildMemberResolvable;

        return this.users.has(serverMemberId);
    }

    /**
     * @param {GuildMember}
     */
    join(serverMember) {
        if (this.mode != DJMode['MANAGED']) return;

        const djUser = this.users.get(serverMember.id);

        if (djUser) {
            djUser.clear();
        }
    }

    /**
     * @param {boolean} [hard=false]
     */
    async reset(hard = false) {
        await this.server.setting.awaitData();

        if (hard) this.mode = this.server.setting.data.guildMode || DJMode['FREEFORALL'];
        this.playlistLock = false;

        if (!this.users)
            this.users = new Map();

        this.users.forEach((djUser) => {
            djUser.clear();

            this.users.delete(djUser.id);
        });
    }

    /**
     * @param {GuildMember}
     */
    remove(serverMember) {
        if (this.mode != DJMode['MANAGED']) return;

        const djUser = this.users.get(serverMember.id);

        if (djUser && this.size == 1) {
            djUser.revokeDelay(this.revokeTime);
        }
    }

    /**
     * @param {GuildMember}
     */
    resign(serverMember) {
        const djUser = this.users.get(serverMember.id);
        djUser.clear();

        if (djUser && this.size == 1) {
            this.setMode(DJMode['FREEFORALL']);

            this.music.channel.send(`${serverMember} has resigned as DJ, all users in voice channel can now use music commands.`);

            return;
        }

        this.users.delete(djUser.id);
    }

    /**
     * @param {number} mode
     * @param {boolean} persist
     */
    setMode(mode, persist = false) {
        if (persist) {
            this.server.setting.update({
                djMode: mode
            });
        }

        this.mode = mode;

        this.reset();
    }

    /**
     * This method is only ran once to setup the module
     * we can abuse this to add our event listeners globally
     */
    setup() {


        return true;
    }
}
