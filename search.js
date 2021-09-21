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
    .setName('search')
    .setDescription('Search for some music!')
    .addStringOption(option =>
		option.setName('name')
			.setDescription('The Youtube Video Name You Want To Search For!')
			.setRequired(true)),
    async execute(interaction) {
        const { joinVoiceChannel } = require('@discordjs/voice');

        if(!interaction.member.voice?.channel) return interaction.reply('Please Join A VC!')

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });

        const search = interaction.options.getString('name')

        const yt_info = await play.search(search, { limit : 1 })
		const stream = await play.stream(yt_info[0].url)
        const resource = createAudioResource(stream.stream, {
            inputType : stream.type
        })
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })
        player.play(resource)

        connection.subscribe(player)
        
        await interaction.reply(`Now Playing **${yt_info[0].url}** !`);

        console.log(`${interaction.user.tag} just searched for ${search} and recieved ${yt_info[0].url} !`);

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop()
            interaction.followUp('Music Done Playing!:)')
        })
	}
}