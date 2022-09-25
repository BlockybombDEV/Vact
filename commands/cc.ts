import { ICommand } from "wokcommands";

export default {
    category: 'moderation',
    description: 'Deletes Multiple messages at once.',

    permissions: ['MANAGE_MESSAGES'],

    slash: 'both',
    testOnly: false,

    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '[amount]',

    callback: async ({ message, interaction, channel, args }) => {
        const amount = args.length ? parseInt(args.shift()!) : 10

        if (message) {
            await message.delete()
        }

        //const { size } = await channel.bulkDelete(amount, true)

        const messages = await channel.messages.fetch({ limit: amount })
        const { size } = messages
        messages.forEach((message) => message.delete())

        const reply = `Deleted ${size} message(s).`

        if (interaction) {
          return reply
        }

        channel.send(reply)
    }
} as ICommand
