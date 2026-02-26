declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/std@0.168.0/http/server" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

// Generic fallback for other Deno std imports (avoid editor errors)
declare module "https://deno.land/std@*" {
  const whatever: any;
  export default whatever;
}
