import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import CustomClient from '../../../base/classes/CustomClient';
import SubCommand from '../../../base/classes/SubCommand';
import AfkCount from '../../../base/schemas/AfkCount';

export default class AfkGetOne extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: 'afk.get-one',
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild?.id;

    if (!user) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ User not found`)],
        ephemeral: true,
      });
      return;
    }

    if (!guildId) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ Guild not found`)],
        ephemeral: true,
      });
      return;
    }

    try {
      const afkCount = await AfkCount.findOne({ userId: user.id, guildId });

      if (!afkCount) {
        interaction.reply({
          embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ ${user.toString()} has not gone AFK yet`)],
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
        .setDescription(`✅ AFK Count: ${afkCount.count}`);

      interaction.reply({
        embeds: [embed],
      });
    } catch (error: any) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while getting the AFK count.', ephemeral: true });
    }
  }
}
