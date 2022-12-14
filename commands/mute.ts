import { Message, MessageEmbed, User } from 'discord.js'
import { ICommand } from 'wokcommands'
import punishmentSchema from '../models/punishment-schema'

export default {
    category: 'Moderation',
    description: 'Mutes a user',

    permissions: ['MUTE_MEMBERS'],

    slash: 'both',
    testOnly: false,

    minArgs: 3,
    expectedArgs: '<user> <duration> <reason>',
    expectedArgsTypes: ['USER', 'STRING', 'STRING'],

    callback: async ({
        args,
        member: staff,
        guild,
        client,
        message,
        interaction,
    }) => {
        if (!guild) {
            return 'You can only use this in a server.'
        }

        let userId = args.shift()!
        const duration = args.shift()!
        const reason = args.join(' ')
        let user: User | undefined

        if (message) {
            user = message.mentions.users?.first()
        } else {
            user = interaction.options.getUser('user') as User
        }

        if (!user) {
            userId = userId.replace(/[<@!>]/g, '')
            user = await client.users.fetch(userId)

            if (!user) {
                return `Could not find a user with the ID "${userId}"`
            }
        }

        userId = user.id

        let time
        let type
        try {
            const split = duration.match(/\d+|\D+/g)
            time = parseInt(split![0])
            type = split![1].toLowerCase()
        } catch (e) {
            return "Invalid time format! Example format: \"10d\" where 'd' = days, 'h' = hours and 'm' = minutes. "
        }

        if (type === 'h') {
            time *=60
        } else if (type === 'd') {
            time *= 60 * 24
        } else if (type !== 'm') {
            return 'Please "m", "h", or "d" for minutes, hours and days respectively'
        }

        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'mute',
        })
        if (result) {
            let MuteExist = `<@${userId}> is already muted in this server.`

            const embed4 = new MessageEmbed().setTitle(MuteExist).setColor('ORANGE')

            return embed4
        }

        try {
            const member = await guild.members.fetch(userId)
            if (member) {
                const muteRole = guild.roles.cache.find((role) => role.name === 'Muted')
                if (!muteRole) {
                    let MuteMissing = 'This server does not have a "Muted" role. Create one to continue.'

                    const embed3 = new MessageEmbed().setTitle(MuteMissing).setColor('RED')

                    return embed3
                }

                member.roles.add(muteRole)
            }

            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'mute',
            }).save()
        } catch (ignored) {
            let MuteFail = 'Cannot mute that user.'

            const embed2 = new MessageEmbed().setTitle(MuteFail).setColor('RED')

            return embed2
        }
        let Mute = `<@${userId}> has been muted for "${duration}"`

        const embed = new MessageEmbed().setTitle(Mute).setColor('GREEN')

        return embed
    },
} as ICommand