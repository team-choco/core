import { ChocoMessage } from '@team-choco/core';
import { ChocoPattern } from '../pattern';
import { ChocoArgs } from '../args';

export interface ChocoRawCommandOptions {
  pattern: string;
  listener: ChocoCommandListener;
}

export interface ChocoCommandOptions {
  pattern: ChocoPattern;
  listener: ChocoCommandListener;
}

export type ChocoCommandListener = (details: ChocoCommandListenerDetails) => void;

export interface ChocoCommandListenerDetails {
  message: ChocoMessage;
  args: ChocoArgs;
}

export interface ChocoCommandListenerDetailsError extends ChocoCommandListenerDetails {
  error: any;
}