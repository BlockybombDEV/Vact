import { Client, GuildMember, Interaction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Role, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Configuration',
    description: 'Add role to auto role message.',

    permissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],

    minArgs: 3,
    maxArgs: 3,
    expectedArgs: '<channel> <messageId> <role>',
    expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE'],

    slash: 'both',
    testOnly: false,

    init: (client: Client) => {
        client.on('interactionCreate', Interaction => {
            if (!Interaction.isSelectMenu()) {
                return
            }

            const { customId, values, member } = Interaction

            if (customId === 'auto_roles' && member instanceof GuildMember) {
                    const component = Interaction.component as MessageSelectMenu
                    const removed = component.options.filter((option) => {
                        return !values.includes(option.value)
                    })

                    for (const id of removed) {
                        member.roles.add(id.value)
                    }

                    for (const id of values) {
                        member.roles.add(id)
                    }
                

                    Interaction.reply({
                        content: 'Your roles have been given!',
                        ephemeral: true,
                    })
            }
        })
    },

    callback: async ({ message, interaction, args, client }) => {
        const channel = (message ? message.mentions.channels.first() : interaction.options.getChannel('channel')) as TextChannel
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return 'Please tag a text channel'
        }

        const messageId = args[1]

        const role = (message ? message.mentions.roles.first() : interaction.options.getRole('role')) as Role
        if (!role) {
            return 'Unknown role!'
        }

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true,
        })

        if (!targetMessage) {
            return 'Unknown message ID.'
        }

        if (targetMessage.author.id !== client.user?.id) {
            return `please provide a message ID that was sent from <@${client.user?.id}>`
        }

        let row = targetMessage.components[0] as MessageActionRow
        if (!row) {
            row = new MessageActionRow()
        }

        const option: MessageSelectOptionData[] = [{
            label: role.name,
            value: role.id
        }]

        let menu = row.components[0] as MessageSelectMenu
        if (menu) {
            for (const o of menu.options) {
                if (o.value == option[0].value) {
                    return {
                        custom: true,
                        content: `<@&${o.value}> is already part of this menu.`,
                        allowedMentions: {
                            roles: [],
                        },
                        ephemeral: true,
                    }
                }
            }

            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                    .setCustomId('auto_roles')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .setPlaceholder('Select your roles...')
                    .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row]
        })

        return {
            custom: true,
            content: `Added <@&${role.id}> to the auto roles menu.`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        }


    }
} as ICommand