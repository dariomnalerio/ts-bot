import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import { Category } from "../../../base/enums/Category";

export default class Afk extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "afk",
      description: "Afk count command",
      category: Category.Fun,
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 3,
      dev: false,
      options: [
        {
          name: "add",
          description: "Add afk count to a user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "Add AFK count to a user",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
          ],
        },
        {
          name: "get-one",
          description: "Get afk count of a specific user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get AFK count of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
          ],
        },
        {
          name: "get-all",
          description: "Get afk count of all users",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    });
  }
}
