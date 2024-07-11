import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";
import AfkCount from "../../../base/schemas/AfkCount";

export default class AfkAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "afk.add",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser("user");
    const guildId = interaction.guild?.id;

    if (!user) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ User not found`)],
        ephemeral: true,
      });
      return;
    }

    if (!guildId) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ Guild not found`)],
        ephemeral: true,
      });
      return;
    }

    try {
      const afkCount = await AfkCount.findOneAndUpdate(
        { userId: user.id, guildId },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
        .setDescription(`✅ AFK Count: ${afkCount.count}`);

      interaction.reply({
        embeds: [embed],
      });
    } catch (error: any) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while updating the AFK count.", ephemeral: true });
    }
  }
}
