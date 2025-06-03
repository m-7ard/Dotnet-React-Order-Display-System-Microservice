import { CERT_DIR } from "config";
import fs from "fs";
import path from "path";
import selfsigned from "selfsigned";

function generateCert(params: {
    nodeEnv: "DOCKER" | "DEVELOPMENT" | "PRODUCTION",
    host: "127.0.0.1" | "secrets"
}) {
    if (!fs.existsSync(CERT_DIR)) {
        fs.mkdirSync(CERT_DIR, { recursive: true });
    }

    try {
        const attrs: Array<{
            name: string;
            value: string;
        }> = [{ name: "organizationName", value: params.nodeEnv }];

        // Environment-specific configuration
        let commonName, altNames;

        if (params.nodeEnv === "DEVELOPMENT") {
            commonName = "localhost";
            altNames = [
                { type: 2, value: "localhost" },
                { type: 2, value: "*.localhost" },
                { type: 7, ip: "127.0.0.1" },
                { type: 7, ip: "::1" },
            ];
        } else {
            commonName = "secrets";
            altNames = [
                { type: 2, value: "secrets" },
                { type: 2, value: "secrets.internal" },
                { type: 2, value: "localhost" },
                { type: 7, ip: "127.0.0.1" },
            ];
        }

        attrs.push({ name: "commonName", value: commonName });

        const options = {
            keySize: 2048,
            days: 365,
            algorithm: "sha256",
            extensions: [
                {
                    name: "basicConstraints",
                    cA: false,
                },
                {
                    name: "keyUsage",
                    keyCertSign: false,
                    digitalSignature: true,
                    keyEncipherment: true,
                },
                {
                    name: "subjectAltName",
                    altNames: altNames,
                },
            ],
        };

        const pems = selfsigned.generate(attrs, options);

        fs.writeFileSync(path.join(CERT_DIR, "private-key.pem"), pems.private);
        fs.writeFileSync(path.join(CERT_DIR, "certificate.pem"), pems.cert);

        console.log("✅ Certificates generated successfully!");
        console.log(`   CN: ${commonName}`);
        console.log(`   SANs: ${altNames.map((alt) => alt.value || alt.ip).join(", ")}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error generating certificates:", error.message);
        }

        process.exit(1);
    }
}

export default generateCert;
