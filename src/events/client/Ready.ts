import { Collection, Events, REST, Routes } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Ready Event",
      once: true,
    });
  }

  async Execute(): Promise<void> {
    console.log(`Logged in as ${this.client.user?.tag}`);

    const clientId = this.client.developmentMode
      ? this.client.config.devDiscordClientId
      : this.client.config.discordClientId;
    const rest = new REST().setToken(this.client.config.token);

    if (!this.client.developmentMode) {
      const globalCommands: any = await rest.put(Routes.applicationCommands(clientId), {
        body: this.GetJson(this.client.commands.filter((command) => !command.dev)),
      });

      for (const command of globalCommands) {
        console.log(`Successfully loaded ${command.name} global command`);
      }

      console.log(`Successfully loaded ${globalCommands.length} global commands`);
    }

    const devCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, this.client.config.devGuildId), {
      body: this.GetJson(this.client.commands.filter((command) => command.dev)),
    });

    console.log(`Successfully loaded ${devCommands.length} developer commands`);
  }

  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = [];

    commands.forEach((command) => {
      data.push({
        name: command.name,
        description: command.description,
        options: command.options,
        default_member_permissions: command.default_member_permissions.toString(),
        dm_permission: command.dm_permission,
      });
    });

    return data;
  }
}
