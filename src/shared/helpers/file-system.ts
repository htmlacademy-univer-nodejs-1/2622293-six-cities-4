import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCurrentModuleDirectoryPath(): string {
  const filepath = fileURLToPath(import.meta.url);
  return dirname(filepath);
}
