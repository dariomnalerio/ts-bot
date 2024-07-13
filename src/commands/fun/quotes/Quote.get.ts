import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import SubCommand from '../../../base/classes/SubCommand';
import Quote from '../../../base/schemas/Quote';
import CustomClient from '../../../base/classes/CustomClient';

export default class GetRandomQuote extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: 'quote.random',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild?.id;

    if (!guildId) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Guild not found')],
        ephemeral: true,
      });
      return;
    }

    try {
      const query = { guildId, ...(user && { userId: user.id }) };
      const quotes = await Quote.find(query);

      if (quotes.length === 0) {
        interaction.reply({
          embeds: [new EmbedBuilder().setDescription('❌ No quotes found.')],
          ephemeral: true,
        });
        return;
      }

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      const embed = new EmbedBuilder().setDescription(randomQuote.quote).setColor('Blue');

      if (randomQuote.userId) {
        const quotedUser = interaction.guild?.members.cache.get(randomQuote.userId)?.user;
        if (quotedUser) {
          embed.setThumbnail(quotedUser.displayAvatarURL());
          embed.addFields({
            name: '-',
            value: quotedUser.toString(),
          });
        }
      }

      interaction.reply({ embeds: [embed] });
    } catch (error: any) {
      console.error(error);
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription('❌ An error occurred while fetching the quote.')],
        ephemeral: true,
      });
    }
  }
}
