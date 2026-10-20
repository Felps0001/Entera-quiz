param(
 [ValidateSet('win-x64','win-arm64','win-x86')][string]$Runtime = 'win-x64',
 [string]$WebView2RuntimePath
)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$webRoot = Join-Path $projectRoot 'desktop/wwwroot'
$publishRoot = Join-Path $projectRoot "dist/$Runtime"
$publishedExe = [IO.Path]::GetFullPath((Join-Path $publishRoot 'EnteraQuiz.exe'))
$runningQuiz = Get-Process -Name EnteraQuiz -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $publishedExe }
if ($runningQuiz) { throw 'Feche o EnteraQuiz.exe antes de publicar novamente. Nenhum arquivo foi alterado.' }
# Only remove generated directories within this project.
foreach ($target in @($webRoot,$publishRoot)) {
 $resolved = [IO.Path]::GetFullPath($target)
 if (-not $resolved.StartsWith([IO.Path]::GetFullPath($projectRoot) + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw "Destino fora do projeto: $resolved" }
 if (Test-Path -LiteralPath $resolved) { Remove-Item -LiteralPath $resolved -Recurse -Force }
 New-Item -ItemType Directory -Path $resolved -Force | Out-Null
}
Copy-Item -Path (Join-Path $projectRoot 'public/*') -Destination $webRoot -Recurse -Force
& dotnet publish (Join-Path $projectRoot 'desktop/EnteraQuiz.csproj') -c Release -r $Runtime --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o $publishRoot
if ($LASTEXITCODE -ne 0) { throw 'Falha na publicação .NET.' }
if ($WebView2RuntimePath) {
 if (-not (Test-Path (Join-Path $WebView2RuntimePath 'msedgewebview2.exe'))) { throw 'Informe a pasta extraída do WebView2 Fixed Version, contendo msedgewebview2.exe.' }
 Copy-Item -LiteralPath $WebView2RuntimePath -Destination (Join-Path $publishRoot 'WebView2Runtime') -Recurse -Force
} else { Write-Warning 'O destino precisará do WebView2 instalado. Para distribuição offline, use -WebView2RuntimePath com o runtime Fixed Version da arquitetura correta.' }
Write-Host "Publicação concluída: $publishRoot"
