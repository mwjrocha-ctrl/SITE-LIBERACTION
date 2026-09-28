$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodeBinary = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:TEMP 'liberaction-toolchain/node-v22.16.0-win-x64/node.exe' }
if (-not (Test-Path -LiteralPath $nodeBinary)) { throw 'Instale Node.js 22 ou superior e execute npm ci para gerar os arquivos do site.' }
Push-Location (Join-Path $PSScriptRoot '..')
try {
    & $nodeBinary 'tools/build.mjs'
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar os arquivos otimizados.' }
} finally { Pop-Location }
