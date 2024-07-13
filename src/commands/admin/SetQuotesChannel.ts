import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Command from "../../base/classes/Command";
import { Category } from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class SetQuotesChannel extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "set-quotes-channel",
      description: "Set the channel where quotes will be sent",
      category: Category.Admin,
      cooldown: 2,
      dev: false,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      options: [
        {
          name: "channel",
          description: "The channel to set as the quotes channel",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel("channel");
    const guildId = interaction.guild?.id;

    if (!channel || !guildId) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Invalid channel or guild ID.")],
        ephemeral: true,
      });
      return;
    }

    // chheck channel type
    if (channel.type !== ChannelType.GuildText) {
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Channel must be a text channel.")],
        ephemeral: true,
      });
      return;
    }

    try {
      await GuildConfig.findOneAndUpdate({ guildId }, { quotesChannelId: channel.id }, { new: true, upsert: true });

      interaction.reply({
        embeds: [new EmbedBuilder().setDescription(`✅ Quotes channel set to <#${channel.id}>.`)],
        ephemeral: true,
      });
    } catch (error: any) {
      console.error(error);
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription("❌ An error occurred while setting the quotes channel.")],
        ephemeral: true,
      });
    }
  }
}
