# Liberaction

Site institucional da Liberaction.

Planejamento patrimonial e tributário internacional especializado em criptoativos.

[liberaction.io](https://liberaction.io/)

## Publicação

Cada push na branch `main` executa o workflow `.github/workflows/pages.yml`:
instala as dependências com `npm ci`, gera os arquivos com `npm run build`,
valida as páginas e publica o conteúdo de `_site/` no GitHub Pages.
Em **Settings → Pages → Source**, mantenha **GitHub Actions** selecionado.

Edite `script.js`, `style.css` e as páginas HTML. Os arquivos em `assets/` são
gerados pelo build; não devem ser alterados manualmente. O build atualiza seus
nomes e as referências nas páginas para evitar o uso de versões antigas em cache.

Para validar localmente, com Node.js 22 instalado:

```sh
npm ci
npm run build
node tools/package-site.mjs
```

Para medir o carregamento e verificar o formulário, deixe `npm run preview`
aberto e execute `npm run check:performance` e `npm run audit:performance`.
As verificações de envio usam um backend simulado e não criam leads reais.
Os relatórios ficam em `reports/performance/`. As ferramentas usam o Chrome
instalado; `CHROME_PATH` permite indicar outro caminho para o executável.

O build entrega os ícones estáticos no HTML e extrai o CSS inicial da mesma
folha usada pelo site. Contato recebe JavaScript próprio e seus estilos completos
no HTML para exibir a primeira pergunta sem esperar uma folha externa. A escolha
e o botão OK funcionam mesmo durante o download da aplicação: as ações são
preservadas e aplicadas quando o formulário inicia. Os eventos de rastreamento
continuam em fila; os scripts externos carregam após o carregamento da página,
na primeira interação ou após sete segundos.

Acompanhe a execução em [Actions](https://github.com/mwjrocha-ctrl/SITE-LIBERACTION/actions/workflows/pages.yml).
A publicação só está concluída quando o job `deploy` termina com sucesso.
O arquivo público [deployment.json](https://liberaction.io/deployment.json)
identifica o commit e os assets publicados.

## Descoberta em buscas e assistentes

As páginas existentes de Estrutura Offshore e Criptoativos apresentam a integração
entre essas áreas desde 2022, com links entre os serviços e dados estruturados.
Mantenha essa informação consistente com a home, Quem Somos e `llms.txt`.
Afirmações de exclusividade de mercado precisam de comprovação pública antes de
serem incluídas no conteúdo ou nos dados estruturados.

O build preenche `inner-hero`, `page-cta` e `legal-page` no HTML inicial. Edite os
atributos desses componentes e seus templates; o próximo build atualiza o conteúdo
gerado. O JavaScript reconhece os componentes já preenchidos e evita duplicação.
`tools/package-site.mjs` verifica títulos, JSON-LD, sitemap e links Markdown do
`llms.txt` antes de preparar a publicação.

O `llms.txt` é um índice segundo a [proposta llms.txt](https://llmstxt.org/), não uma
garantia de indexação ou recomendação. O `robots.txt` permite `OAI-SearchBot` e
preserva o bloqueio de `GPTBot`; busca e treinamento são controles independentes
conforme a [documentação da OpenAI](https://developers.openai.com/api/docs/bots).
Para os recursos de IA da Busca Google, valem as
[orientações de SEO do Google](https://developers.google.com/search/docs/appearance/ai-features).

Depois da publicação, conferir a URL e o sitemap no Google Search Console e no
Bing Webmaster Tools. Acompanhar consultas relacionadas a offshore e cripto,
visitas de assistentes e pedidos de diagnóstico. Entrevistas e participações em
eventos devem receber links para suas fontes públicas quando disponíveis.
