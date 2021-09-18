const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies With Latency!'),
    async execute(interaction) {
        await interaction.reply(`Pong! :ping_pong: ${Date.now() - interaction.createdTimestamp}ms.`);
    },
}