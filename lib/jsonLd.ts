import { Thing } from 'schema-dts';

export function jsonLd(data: Thing): string {
  return JSON.stringify(data);
}
