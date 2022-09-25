import { ICommand } from "wokcommands";

export default {
    category: 'Configuration',
    description: 'Sets the bots status',

    minArgs: 1,
    expectedArgs: '<status>',

    ownerOnly: true,

    slash: 'both',
    testOnly: false,

    callback: ({ client, text }) => {
        client.user?.setPresence({
            status: 'online',
            activities: [
                {
                    name: text
                }
            ]
        })

        return 'Status updated.'
    }
    
} as ICommand