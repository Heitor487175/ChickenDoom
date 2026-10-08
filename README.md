# Chicken Doom

## Download para Linux

[Baixar o ZIP com o AppImage](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-AppImages.zip)

## Download para Windows

[Baixar o instalador do Windows (.exe)](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/Chicken-Doom-Setup.exe)

Os arquivos são publicados nos GitHub Releases, não no histórico do repositório. Os links só funcionam depois da criação do Release.

## Publicar uma nova versão

Depois de enviar o workflow para `main`, abra **Actions → Publish Chicken Doom release → Run workflow**, selecione a branch `main` e informe uma tag, por exemplo `v1.0.0`. O workflow gera o AppImage e o instalador `.exe`, então cria ou atualiza o Release com os dois downloads.

```sh
# Alternativamente, publique ambos os downloads enviando uma tag:
git tag v1.0.0
git push origin v1.0.0
```

O instalador Windows não é assinado digitalmente; o Windows pode exibir um aviso do SmartScreen na primeira execução.