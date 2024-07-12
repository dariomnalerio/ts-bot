import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";
import AfkCount from "../../../base/schemas/AfkCount";
import { getUser } from "../../../utils";

export default class AfkGetAll extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "afk.get-all",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guild?.id;

    if (!guildId) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ Guild not found`)],
        ephemeral: true,
      });
      return;
    }

    try {
      const afkCounts = await AfkCount.find({ guildId });

      if (!afkCounts.length) {
        interaction.reply({
          embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ No users have gone AFK yet`)],
        });
        return;
      }

      const embed = new EmbedBuilder().setColor("Green").setTitle("AFK Count");

      const descriptions = await Promise.all(
        afkCounts
          .sort((a, b) => b.count - a.count)
          .map(async (afkCount, index) => {
            const user = await getUser(this.client, afkCount.userId);
            return `${index + 1}. ${user}: ${afkCount.count}`;
          })
      );

      embed.setDescription(descriptions.join("\n"));

      interaction.reply({
        embeds: [embed],
      });
    } catch (error: any) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while getting the AFK count.", ephemeral: true });
    }
  }
}
