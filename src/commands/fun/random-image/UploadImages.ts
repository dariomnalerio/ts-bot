import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from 'discord.js';
import Command from '../../../base/classes/Command';
import CustomClient from '../../../base/classes/CustomClient';
import { Category } from '../../../base/enums/Category';
import RandomImage from '../../../base/schemas/RandomImage';
import { checkImageURL } from '../../../utils';

export default class UploadRandomImages extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: 'upload-random-images',
      description: 'The image(s) URL(s) to upload, separated by commas',
      category: Category.Developer,
      cooldown: 2,
      dev: true,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.AttachFiles,
      options: [
        {
          name: 'images',
          description: 'The image(s) url(s) to upload',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const imageUrls = interaction.options.getString('images', true);
      const imageUrlsArray = imageUrls.split(',').map((url) => ({ imageUrl: url.trim() }));

      if (imageUrlsArray.some((image) => !checkImageURL(image.imageUrl))) {
        interaction.reply({
          embeds: [new EmbedBuilder().setDescription('❌ Invalid image URL(s) provided.')],
          ephemeral: true,
        });
        return;
      }

      await RandomImage.insertMany(imageUrlsArray);

      interaction.reply({
        embeds: [new EmbedBuilder().setDescription('✅ Image(s) uploaded successfully.')],
      });
    } catch (error: any) {
      console.error(error);
      interaction.reply({
        embeds: [new EmbedBuilder().setDescription('❌ An error occurred while uploading the image(s).')],
        ephemeral: true,
      });
    }
  }
}
