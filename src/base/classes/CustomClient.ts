import { Client, Collection } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { loadAndValidateConfig } from "../utils/validateConfig";

export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  config: IConfig;
  commands: Collection<string, Command>;
  subcommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    super({
      intents: [],
    });
    const configPath = `${process.cwd()}/data/config.json`;
    this.config = loadAndValidateConfig(configPath);
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subcommands = new Collection();
    this.cooldowns = new Collection();
  }

  LoadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }

  Init() {
    this.LoadHandlers();
    this.login(this.config.token).catch((err) => {
      console.error(err);
    });
  }
}
