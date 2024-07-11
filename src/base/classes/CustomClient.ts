import { Client, Collection, GatewayIntentBits } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { loadAndValidateConfig } from "../utils/validateConfig";
import { connect } from "mongoose";

export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  config: IConfig;
  commands: Collection<string, Command>;
  subcommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  developmentMode: boolean;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
    });
    const configPath = `${process.cwd()}/data/config.json`;
    this.config = loadAndValidateConfig(configPath);
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subcommands = new Collection();
    this.cooldowns = new Collection();
    this.developmentMode = process.argv.slice(2).includes("--dev");
  }

  LoadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }

  Init() {
    console.log(`Starting the bot in ${this.developmentMode ? "development" : "production"} mode...`);
    this.LoadHandlers();
    this.login(this.developmentMode ? this.config.devToken : this.config.token).catch((err) => {
      console.error(err);
    });

    connect(this.developmentMode ? this.config.devMongoUrl : this.config.mongoUrl)
      .then(() => {
        console.log("Connected to MongoDB!");
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
