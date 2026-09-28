# Liberaction

Site estático. Os arquivos HTML e a pasta `assets` já estão prontos para publicação. O servidor de produção não precisa de Node.js.

## Editar e testar

- Edite os HTMLs em `pt/`, os estilos em `style.css` e o comportamento em `script.js`.
- O F5 no VS Code gera os arquivos otimizados antes de iniciar o debug.
- Para gerar manualmente: Node.js 22 ou superior, `npm ci` e `npm run build`.
- `npm run preview` serve a versão pronta em `http://localhost:8081/pt/`.
- Execute novamente o build após alterar HTML, classes, estilos, scripts ou imagens. Não edite diretamente os arquivos com hash em `assets/`.

O build compila Tailwind, elimina CSS não utilizado, compacta o JavaScript, inclui apenas os ícones usados e cria imagens WebP responsivas. As fontes ficam locais, com suas licenças em `assets`. Os originais em `imagens` são mantidos para futuras edições.

## Publicar

Envie `index.html`, `404.html`, `pt/`, `assets/`, `imagens/og-liberaction.jpg`, `robots.txt`, `sitemap.xml` e `llms.txt`. Não envie `node_modules`, `tools`, `reports` ou `.vscode`.

- Apache/LiteSpeed: inclua `.htaccess` para compressão e cache dos arquivos com hash.
- Netlify/Cloudflare Pages: inclua `_headers`. A plataforma cuida da compressão.
- Em outros provedores, ative Brotli/gzip para HTML, CSS, JavaScript e SVG. Use cache de um ano com `immutable` somente nos arquivos com hash; mantenha revalidação no HTML.
- Publique os novos assets antes ou junto dos HTMLs e preserve os assets antigos durante a troca, evitando falhas em abas abertas.

## Medir

Com o preview em execução, `npm run audit` gera os relatórios Lighthouse em `reports`. A comparação local usa o mesmo servidor com gzip e o perfil móvel do Lighthouse; ela não substitui uma medição do domínio publicado.

Referências: [Tailwind compilado](https://v3.tailwindcss.com/docs/installation) e [otimização do LCP](https://web.dev/articles/optimize-lcp).
