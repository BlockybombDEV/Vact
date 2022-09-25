import { Client } from "discord.js";

export default (client: Client) => {
    const statusOptions = [
        'Follow IzFalcon on twitch',
        'Valorant',
        'with commands'
    ]
    let counter = 0

    const updateStatus = () => {
        client.user?.setPresence({
            status: 'online',
            activities : [
                {
                    name: statusOptions[counter]
                }
            ]
        })

        if (++counter >= statusOptions.length) {
            counter = 0
        }

        setTimeout(updateStatus, 1000 * 120)
    }
    updateStatus()
}

export const config = {
    dbName: 'STATUS_CHANGER',
    displayName: 'Status Changer'
}