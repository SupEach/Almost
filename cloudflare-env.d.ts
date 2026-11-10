// Optional binding: hosting.json currently declares no database.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
