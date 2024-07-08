import { ChatInputCommandInteraction, Collection, EmbedBuilder, Events } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command handler event",
      once: false,
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command: Command = this.client.commands.get(interaction.commandName)!;

    if (!command) {
      this.client.commands.delete(interaction.commandName);
      return interaction.reply({ content: "This command does not exist!", ephemeral: true });
    }

    const { cooldowns } = this.client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id) && now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount) {
      const timeLeft = (timestamps.get(interaction.user.id) || 0) + cooldownAmount - now;

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ Please wait ${timeLeft / 1000} more seconds before reusing the \`${command.name}\` command.`
            ),
        ],
        ephemeral: true,
      });
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => {
      timestamps.delete(interaction.user.id);
    }, cooldownAmount);

    try {
      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${
        interaction.options.getSubcommand(false) || ""
      }`;

      return this.client.subcommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
    } catch (err) {
      console.log(err);
    }
  }
}
