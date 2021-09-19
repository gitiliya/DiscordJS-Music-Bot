const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	joinVoiceChannel,
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves The VC.'),
    async execute(interaction) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });
        connection.destroy()
        await interaction.reply(`Left!`);
    },
}