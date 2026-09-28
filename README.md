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

Acompanhe a execução em [Actions](https://github.com/mwjrocha-ctrl/SITE-LIBERACTION/actions/workflows/pages.yml).
A publicação só está concluída quando o job `deploy` termina com sucesso.
O arquivo público [deployment.json](https://liberaction.io/deployment.json)
identifica o commit e os assets publicados.
