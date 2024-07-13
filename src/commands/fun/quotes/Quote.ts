import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';
import Command from '../../../base/classes/Command';
import CustomClient from '../../../base/classes/CustomClient';
import { Category } from '../../../base/enums/Category';

export default class Quote extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: 'quote',
      description: 'Quote commands',
      category: Category.Fun,
      cooldown: 3,
      dev: false,
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.SendMessages,
      options: [
        {
          name: 'add',
          description: 'Add a quote',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'quote',
              description: 'The quote to add',
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: 'user',
              description: 'The user who said the quote (optional)',
              type: ApplicationCommandOptionType.User,
              required: false,
            },
          ],
        },
        {
          name: 'random',
          description: 'Get a random quote from a specific user (optional)',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'user',
              description: 'The user to get a random quote from (optional)',
              type: ApplicationCommandOptionType.User,
              required: false,
            },
          ],
        },
      ],
    });
  }
}
