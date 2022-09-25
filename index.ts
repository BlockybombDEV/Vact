import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import mongoose from 'mongoose'
import 'dotenv/config'

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', async () => {

    new WOKCommands(client, {
        // The name of the local folder for your command files
        commandsDir: path.join(__dirname, 'commands'),
        // Allow importing of .ts files if you are using ts-node
        featuresDir: path.join(__dirname, 'features'),
        typeScript: true,
        testServers: ['987774034286628895'],
        botOwners: ['586264973903265802', '297534226637651970'],
        mongoUri: process.env.MONGO_URI,
        dbOptions: {
            keepAlive: true
        },
      }) 
})

client.login(process.env.TOKEN)