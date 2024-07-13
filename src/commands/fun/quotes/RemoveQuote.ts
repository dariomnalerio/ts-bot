import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import { Category } from "../../../base/enums/Category";
import Quote from "../../../base/schemas/Quote";

export default class RemoveQuote extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "quote-remove",
      description: "Remove a quote",
      category: Category.Admin,
      cooldown: 3,
      dev: false,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      options: [
        {
          name: "index",
          description: "The index of the quote to remove",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const index = interaction.options.getInteger("index", true);
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

      if (index < 1 || index > quotes.length) {
        await interaction.reply({
          embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Invalid quote index")],
          ephemeral: true,
        });
        return;
      }

      const quoteToRemove = quotes[index - 1];
      await Quote.deleteOne({ _id: quoteToRemove._id });

      await interaction.reply({
        embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Quote removed successfully")],
        ephemeral: true,
      });
    } catch (error: any) {
      console.error(error);
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ An error occurred while removing the quote.")],
        ephemeral: true,
      });
    }
  }
}
