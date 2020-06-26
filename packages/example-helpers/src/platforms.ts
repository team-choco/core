import { ChocoPlatform } from '@team-choco/core';
import { ChocoShellPlatform } from '@team-choco/shell-platform';
import { ChocoDiscordPlatform } from '@team-choco/discord-platform';
import { CONFIG } from './config';

const platforms: ChocoPlatformType[] = ['SHELL','DISCORD'];

export function isChocoPlatformType(value?: string): value is ChocoPlatformType {
  return Boolean(value) && platforms.includes(value as ChocoPlatformType);
}

export type ChocoPlatformType = ('SHELL'|'DISCORD');

export function getChocoPlatform(type: 'SHELL'): ChocoShellPlatform;
export function getChocoPlatform(type: 'DISCORD'): ChocoDiscordPlatform;
export function getChocoPlatform(type: ChocoPlatformType): ChocoPlatform;
export function getChocoPlatform(type: ChocoPlatformType): ChocoPlatform {
  if (type === 'DISCORD') {
    return new ChocoDiscordPlatform({
      token: CONFIG.DISCORD_TOKEN,
    })
  }

  return new ChocoShellPlatform({
    name: 'Choco Bot',
  });
}

export const PLATFORM: ChocoPlatform = getChocoPlatform(isChocoPlatformType(process.env.PLATFORM) ? process.env.PLATFORM : 'SHELL');
