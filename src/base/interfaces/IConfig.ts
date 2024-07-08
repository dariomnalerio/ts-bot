import { z } from "zod";

export const ConfigSchema = z.object({
  token: z.string(),
  discordClientId: z.string(),
  guildId: z.string(),
});

export type IConfig = z.infer<typeof ConfigSchema>;
