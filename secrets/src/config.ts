import path from "path";

export const DIST_DIR = process.cwd();
export const STATIC_DIR = path.join(DIST_DIR, "static");
export const CERT_DIR = path.join(DIST_DIR, "certs");
