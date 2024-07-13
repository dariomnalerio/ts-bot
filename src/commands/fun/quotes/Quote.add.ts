import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import CustomClient from '../../../base/classes/CustomClient';
import SubCommand from '../../../base/classes/SubCommand';
import Quote from '../../../base/schemas/Quote';
import GuildConfig from '../../../base/schemas/GuildConfig';

export default class AddQuote extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: 'quote.add',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const quote = interaction.options.getString('quote', true);
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild?.id;

    if (!guildId) {
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Guild not found')],
        ephemeral: true,
      });
      return;
    }

    const settings = await GuildConfig.findOne({ guildId, quotesChannelId: { $exists: true } });

    if (!settings) {
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Quotes channel not set')],
        ephemeral: true,
      });
      return;
    }

    try {
      const newQuote = new Quote({
        quote,
        userId: user ? user.id : null,
        guildId,
      });

      await newQuote.save();

      await interaction.reply({
        embeds: [new EmbedBuilder().setDescription('✅ Quote added successfully.')],
        ephemeral: true,
      });

      if (settings && settings.quotesChannelId) {
        const channel = interaction.guild?.channels.cache.get(settings.quotesChannelId);
        if (channel?.isTextBased()) {
          const embed = new EmbedBuilder().setDescription(quote).setColor('Blue');

          if (user) {
            embed.setThumbnail(user.displayAvatarURL());
            embed.addFields({
              name: '-',
              value: user.toString(),
            });
          }

          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error: any) {
      console.error(error);
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ An error occurred while adding the quote.')],
        ephemeral: true,
      });
    }
  }
}
