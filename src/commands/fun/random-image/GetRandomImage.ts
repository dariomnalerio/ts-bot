import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import { Category } from "../../../base/enums/Category";
import RandomImage from "../../../base/schemas/RandomImage";

export default class GetRandomImage extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "get-random-image",
      description: "Retrieves a random image from the database",
      category: Category.Fun,
      cooldown: 1,
      dev: false,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.AttachFiles,
      options: [],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const images = await RandomImage.find();

      if (images.length === 0) {
        interaction.reply({
          embeds: [new EmbedBuilder().setDescription("❌ No images found in the database.")],
          ephemeral: true,
        });
        return;
      }

      const randomImage = images[Math.floor(Math.random() * images.length)].imageUrl;

      interaction.reply({
        embeds: [new EmbedBuilder().setImage(randomImage)],
      });
    } catch (error: any) {
      console.error(error);
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription("❌ An error occurred while fetching the image.")],
        ephemeral: true,
      });
    }
  }
}
