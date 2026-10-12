# Editor de vídeo

Editor de vídeo web feito com React e [Remotion](https://www.remotion.dev).

## O que já tem

- Preview com o Remotion Player (play, pause, tela cheia)
- Timeline com 3 faixas (Texto, Vídeo, Fundo), régua em segundos e playhead sincronizado
- Arrastar itens para mover, puxar a borda direita para mudar a duração
- Adicionar texto, cor de fundo e vídeo (por URL de .mp4)
- Painel para editar texto, cor e duração, e excluir o item

## Rodar

```console
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Exportar para .mp4

Descreva o vídeo num arquivo JSON (veja `projects/teste-img1848.json`) e rode:

```console
npm run render -- projects/teste-img1848.json saida.mp4 pasta-com-os-videos
```

Itens de vídeo com `src` sendo só o nome do arquivo são lidos da pasta passada no terceiro argumento.
Na primeira vez o Remotion baixa o Chrome Headless Shell. Para usar um que já está instalado, defina `REMOTION_BROWSER` com o caminho dele.

## Legendas automáticas

Gera as legendas palavra por palavra com o Whisper, rodando no seu computador (precisa do ffmpeg):

```console
npm run transcribe -- meu-video.mp4 legendas.json
```

Na primeira vez ele baixa o whisper.cpp e o modelo (~1,5 GB para o `medium`; passe `small` ou `base` como terceiro argumento para um modelo menor).
Depois, coloque o conteúdo de `legendas.json` num item `"type": "captions"` do projeto, no campo `captions`.

## O que dá para usar no projeto JSON

- `text`: `animation` (`pop`, `typewriter`), `background`, `rotate`, `y` (altura em %), `fade`
- `video`: `zooms` (cortes com zoom em frames específicos), `grade` (brilho, contraste, saturação), `vignette`
- `captions`: legendas no estilo TikTok com a palavra falada destacada
- `progress`: barra de progresso no topo
- Em qualquer item, `enter` e `exit` com `fade`, `slide-up`, `slide-left`, `zoom` ou `wipe`. Itens sobrepostos em faixas diferentes viram transições.

## Estrutura

- `src/types.ts`: tipos de item e faixa, FPS e resolução
- `src/Composition.tsx`: o vídeo em si (componente Remotion que desenha as faixas)
- `src/items/`: como cada tipo de item é desenhado
- `src/transitions.ts`: animações de entrada e saída
- `src/Timeline.tsx`: a timeline
- `src/App.tsx`: estado do editor, barra de ferramentas e painel de edição
- `src/remotion/`: entrada usada para renderizar o vídeo
- `scripts/render.mjs`: exporta um projeto JSON para .mp4
- `scripts/transcribe.mjs`: gera legendas a partir do áudio

## Próximos passos possíveis

- Botão de exportar dentro do editor (hoje a exportação é pelo terminal)
- Upload de arquivos locais
- Desfazer e refazer
- Mover itens entre faixas e criar novas faixas

## Licença do Remotion

O Remotion é grátis para pessoa física e empresas com até 3 funcionários. Veja https://remotion.dev/license.
