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

## Estrutura

- `src/types.ts`: tipos de item e faixa, FPS e resolução
- `src/Composition.tsx`: o vídeo em si (componente Remotion que desenha as faixas)
- `src/Timeline.tsx`: a timeline
- `src/App.tsx`: estado do editor, barra de ferramentas e painel de edição
- `src/remotion/`: entrada usada para renderizar o vídeo
- `scripts/render.mjs`: exporta um projeto JSON para .mp4

## Próximos passos possíveis

- Botão de exportar dentro do editor (hoje a exportação é pelo terminal)
- Upload de arquivos locais
- Desfazer e refazer
- Mover itens entre faixas e criar novas faixas

## Licença do Remotion

O Remotion é grátis para pessoa física e empresas com até 3 funcionários. Veja https://remotion.dev/license.
