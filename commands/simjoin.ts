import { ICommand } from "wokcommands";

export default {
    category: 'testing',
    description: 'Simulate a join',

    permissions: ['ADMINISTRATOR'],

    slash: 'both',
    testOnly: true,

    callback: ({ member, client }) => {
        client.emit('guildMemberAdd', member)
        return 'Join simulated'
    },
} as ICommand