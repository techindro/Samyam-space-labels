declare namespace Deno {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void;
  export function serve(options: any, handler?: any): void;
  export const env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
  };
}

declare module "npm:*" {
  const content: any;
  export default content;
  export const createSupabaseHandler: any;
  export const createClient: any;
  export const corsHeaders: any;
}

declare module "https://*" {
  const content: any;
  export default content;
  export const serve: any;
}
