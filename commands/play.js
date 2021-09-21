const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');
const {
	AudioPlayerStatus,
    NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play some music!')
    .addStringOption(option =>
		option.setName('link')
			.setDescription('The Youtube Video Link You Want To Play!')
			.setRequired(true)),
    async execute(interaction, args) {
        const { joinVoiceChannel } = require('@discordjs/voice');

        if(!interaction.member.voice?.channel) return interaction.reply('Please Join A VC!')

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });

    
        const ytlink = interaction.options.getString('link')

        console.log(`${interaction.user.tag} just played ${ytlink} !`);

        const stream = await play.stream(ytlink);
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        player.play(resource);

        connection.subscribe(player);

        await interaction.reply(`Now Playing **${ytlink}** !`);


        player.on(AudioPlayerStatus.Idle, () => {
            player.stop()
            interaction.followUp('Music Done Playing!:)')
        })
    },
}
