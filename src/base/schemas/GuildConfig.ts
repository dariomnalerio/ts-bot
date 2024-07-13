import { model, Schema } from "mongoose";

interface IGuildConfig {
  guildId: string;
  quotesChannelId?: string;
}

const guildConfigSchema = new Schema<IGuildConfig>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  quotesChannelId: {
    type: String,
    required: false,
  },
});

const GuildConfig = model<IGuildConfig>("GuildConfig", guildConfigSchema);

export default GuildConfig;
