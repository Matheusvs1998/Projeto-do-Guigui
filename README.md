# Site do Guigui

Site estático com formulário de inscrição. A rota `api/inscricoes.js` salva os dados no Supabase e é executada como função serverless na Vercel.

## Publicar na Vercel

1. Importe este repositório no painel da Vercel.
2. Use a pasta raiz do repositório como **Root Directory** e selecione **Other** como framework, se solicitado. Não há etapa de build nem diretório de saída a configurar.
3. Em **Settings → Environment Variables**, configure:
   - `SUPABASE_URL`: URL do projeto Supabase.
   - `SUPABASE_SECRET_KEY`: chave secreta do projeto Supabase.
4. Selecione os ambientes desejados (por exemplo, **Production**) e faça o deploy. Um novo deploy é necessário após alterar variáveis.

A Vercel detecta automaticamente os arquivos estáticos e a função dentro de `api/`; não é necessário um `vercel.json` para este projeto.

## Configurar o Supabase

Execute [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor do projeto Supabase para criar a tabela `inscricoes` e suas permissões.

Para desenvolvimento local, copie [`.env.example`](.env.example) para `.env` e preencha as mesmas variáveis. Não publique o `.env` nem compartilhe a chave secreta; ele está excluído do Git.
