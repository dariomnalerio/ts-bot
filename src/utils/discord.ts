import { Client, User } from "discord.js";

export async function getUser(client: Client, userId: string): Promise<User | null> {
  try {
    const user = await client.users.fetch(userId);
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
}
