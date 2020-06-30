import { ChocoCommandListenerDetails } from './command/types';

export interface ChocoCommandListenerDetailsError extends ChocoCommandListenerDetails {
  error: any;
}
