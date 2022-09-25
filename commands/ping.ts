import { ICommand } from "wokcommands";

export default {
    category: 'testing',
    description: 'replies with pong!!',

    slash: 'both',
    testOnly: true,

    callback: ({}) => {
        return 'pong'
    },
} as ICommand