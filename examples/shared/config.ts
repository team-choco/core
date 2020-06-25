import { config } from 'dotenv';
import { resolve } from 'app-root-path';

const { error } = config({
  path: resolve('.env'),
});

if (error) throw error;

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error(`Expected token to be provided via "DISCORD_TOKEN".`);
}

export const CONFIG: Config = {
  DISCORD_TOKEN: token,
};

export interface Config {
  DISCORD_TOKEN: string;
}
