# Chicken Doom

## Download para Linux

[Baixar o ZIP com o AppImage](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-AppImages.zip)

## Download para Windows

[Baixar o instalador do Windows (.exe)](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/Chicken-Doom-Setup.exe)

Os arquivos são publicados nos GitHub Releases, não no histórico do repositório. Os links só funcionam depois da criação do Release.

## Mapas

O catálogo de eras e suas propriedades visuais fica em [`meu-app/game/maps/MapCatalog.js`](./meu-app/game/maps/MapCatalog.js). O carregamento e o registro dos construtores ficam em [`meu-app/game/maps/MapManager.js`](./meu-app/game/maps/MapManager.js).

Os construtores de geometria e as mecânicas específicas de cada fase ainda estão em [`meu-app/script.js`](./meu-app/script.js): `e1` a `e8` definem as eras principais e `eMuseu`, `eArranha`, `eColapso` e `eBiblioteca` definem as eras extras. Esses construtores são registrados no `MapManager`; ao criar uma nova era, mantenha o índice alinhado com `EPOCHS` e registre seu construtor correspondente.

## Publicar uma nova versão

Depois de enviar o workflow para `main`, abra **Actions → Publish Chicken Doom release → Run workflow**, selecione a branch `main` e informe uma tag, por exemplo `v1.0.0`. O workflow gera o AppImage e o instalador `.exe`, então cria ou atualiza o Release com os dois downloads.

```sh
# Alternativamente, publique ambos os downloads enviando uma tag:
git tag v1.0.0
git push origin v1.0.0
```

O instalador Windows não é assinado digitalmente; o Windows pode exibir um aviso do SmartScreen na primeira execução.