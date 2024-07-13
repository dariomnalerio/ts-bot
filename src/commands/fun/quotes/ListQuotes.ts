import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import { Category } from "../../../base/enums/Category";
import Quote from "../../../base/schemas/Quote";

export default class ListQuotes extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "quote-list",
      description: "List all quotes with indexes",
      category: Category.Utilities,
      cooldown: 3,
      dev: false,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      options: [],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guild?.id;

    if (!guildId) {
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Guild not found")],
        ephemeral: true,
      });
      return;
    }

    try {
      const quotes = await Quote.find({ guildId });

      if (quotes.length === 0) {
        await interaction.reply({
          embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No quotes found")],
          ephemeral: true,
        });
        return;
      }

      const quoteList = quotes
        .map((quote, index: number) => `${index + 1}. ${quote.quote} - ${quote.userId ? `<@${quote.userId}>` : ""}`)
        .join("\n");

      await interaction.reply({
        embeds: [new EmbedBuilder().setDescription(quoteList)],
        ephemeral: true,
      });
    } catch (error: any) {
      console.error(error);
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ An error occurred while fetching the quotes.")],
        ephemeral: true,
      });
    }
  }
}
