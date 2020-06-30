import { config } from 'dotenv';
import { resolve } from 'app-root-path';

config({
  path: resolve('.env'),
});

export const CONFIG: Config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
};

export interface Config {
  DISCORD_TOKEN?: string;
}
