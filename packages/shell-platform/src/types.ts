export interface ChocoShellPlatformInternalOptions extends ChocoShellPlatformOptions {
  whoami: string;
}

export interface ChocoShellPlatformOptions {
  /**
   * The bots username.
   */
  name: string;

  /**
   * Your username.
   *
   * @defaultValue 'user'
   */
  whoami?: string;
}
