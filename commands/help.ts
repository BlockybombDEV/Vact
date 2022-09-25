import { Message, MessageEmbed } from 'discord.js'
import  { ICommand } from 'wokcommands'

export default {
    category: 'Utility',
    description: 'help',

    slash: 'both',
    testOnly: true,

    callback: async ({ message, text }) => {
      const embed = new MessageEmbed()
        .setColor('DARK_GREEN')
        .addFields(
          [
            {
              name: "MODERATION",
              value: "moderation commands",
              inline: true
            },
            {
              name: "/ban",
              value: "**⤷** Bas an user"
            },
            {
              name: "/cc",
              value:"**⤷** Bulk deletes messages"
            },
            {
              name: "/kick",
              value: "**⤷** Kicks an user"
            },
            {
              name: "/mute",
              value: "**⤷** Mutes an user"
            },
            {
              name: "/warn",
              value: "**⤷** Warns an user"
            },
          ]
        )
      return embed
    } 
} as ICommand
