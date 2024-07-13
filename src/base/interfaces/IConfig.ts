import { z } from 'zod';

export const ConfigSchema = z.object({
  token: z.string(),
  devToken: z.string(),
  discordClientId: z.string(),
  devDiscordClientId: z.string(),
  devGuildId: z.string(),
  mongoUrl: z.string(),
  devMongoUrl: z.string(),
  devUserIds: z.array(z.string()),
});

export type IConfig = z.infer<typeof ConfigSchema>;
