module.exports = async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Método não permitido." });
    }

    if (!req.headers["content-type"]?.startsWith("application/json")) {
        return res.status(415).json({ error: "Envie os dados em formato JSON." });
    }

    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > 4096) {
        return res.status(413).json({ error: "Os dados enviados são muito grandes." });
    }

    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ error: "Dados de inscrição inválidos." });
    }

    const nome = typeof body.nome === "string" ? body.nome.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const nascimento = typeof body.nascimento === "string" ? body.nascimento : "";
    const fantasia = typeof body.fantasia === "string" ? body.fantasia.trim() : "";
    const parsedBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(nascimento)
        ? new Date(`${nascimento}T00:00:00.000Z`)
        : null;

    if (nome.length < 2 || nome.length > 120) {
        return res.status(400).json({ error: "Informe um nome entre 2 e 120 caracteres." });
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Informe um e-mail válido." });
    }

    if (
        !parsedBirthDate ||
        Number.isNaN(parsedBirthDate.getTime()) ||
        parsedBirthDate.toISOString().slice(0, 10) !== nascimento ||
        nascimento > new Date().toISOString().slice(0, 10)
    ) {
        return res.status(400).json({ error: "Informe uma data de nascimento válida." });
    }

    if (fantasia.length > 80) {
        return res.status(400).json({ error: "O apelido deve ter no máximo 80 caracteres." });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
    const apiKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !apiKey) {
        console.error("Missing SUPABASE_URL or Supabase server key environment variable.");
        return res.status(500).json({ error: "O serviço de inscrições ainda não está configurado." });
    }

    try {
        const headers = {
            apikey: apiKey,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        };

        if (apiKey.startsWith("eyJ")) {
            headers.Authorization = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/inscricoes`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                nome,
                email,
                nascimento,
                fantasia: fantasia || null
            }),
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            console.error(`Supabase insert failed with status ${response.status}.`);
            return res.status(502).json({ error: "Não foi possível salvar a inscrição. Tente novamente." });
        }

        return res.status(201).json({
            message: "Cadastro confirmado! Sua inscrição foi realizada com sucesso."
        });
    } catch (error) {
        console.error("Supabase request failed:", error instanceof Error ? error.message : "Unknown error");
        return res.status(502).json({ error: "Não foi possível salvar a inscrição. Tente novamente." });
    }
};
