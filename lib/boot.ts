// First-load flag: module state resets on every full document load and
// survives client-side navigation, which is exactly "show splash on reload,
// never during in-app navigation".
let booted = false;

export function isBooted(): boolean {
  return booted;
}

export function markBooted(): void {
  booted = true;
}
