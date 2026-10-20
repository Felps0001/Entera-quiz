# Entera Quiz

O formulário de inscrição está em `inscricao/` (React) e sua API em `api/` (Node.js + MongoDB). Consulte os READMEs de cada pasta para desenvolvimento e publicação. O quiz abaixo mantém sua estrutura atual.

Prévia em HTML, CSS e JavaScript, em uma página, com composição de 1080 × 1920 que se ajusta proporcionalmente à tela.

## Prévia

Requisito: Node.js 20 ou superior. Sem dependências npm.

```powershell
npm start
```

Abra http://localhost:3000. Para acesso na mesma rede, use o IP do computador e a porta 3000 (com permissão no firewall). Encerre com Ctrl+C.

## Conteúdo

Edite `public/questions.js`. A propriedade `correct` é o índice da resposta correta, começando em zero. A sequência de questões é fixa; as alternativas são embaralhadas a cada partida. A questão 5 considera “Diferentes camadas e necessidades” correta, pendente de confirmação editorial.

O resultado fica apenas em memória e é apagado ao reiniciar. Não há cadastro, coleta de dados ou integração externa. As fontes oficiais ANO/Neuzeit não foram fornecidas; esta prévia usa Arial. Logo e textura foram extraídos do PDF fornecido; a paleta segue a página 40.

## Publicação Windows

Na máquina de desenvolvimento: SDK .NET 10 e acesso ao NuGet na primeira publicação.

```powershell
.\public.ps1 -Runtime win-x64
```

O script sincroniza `public` com `desktop/wwwroot` e publica em `dist/win-x64`. Copie a pasta inteira ao dispositivo e abra `EnteraQuiz.exe`. O destino não precisa de Node, SDK ou .NET instalado. Alt+F4 fecha o aplicativo.

O WebView2 é independente do .NET. Para uma máquina que já o possui, o comando acima basta. Para distribuir o runtime junto, baixe e extraia o **Fixed Version Runtime** da arquitetura correta e execute:

```powershell
.\public.ps1 -Runtime win-x64 -WebView2RuntimePath 'C:\caminho\runtime-extraido'
```

Documentação: https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution
Download: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

A pasta fornecida deve conter `msedgewebview2.exe`. O runtime não está incluído no repositório. Os dados temporários do navegador ficam em `%LOCALAPPDATA%\EnteraQuiz\WebView2`. O aplicativo carrega os arquivos locais por um host virtual, sem iniciar servidor Node.
