export async function wait(ms = 0): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
