# Chicken Doom

## Download para Linux

[Baixar o ZIP com o AppImage](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-AppImages.zip)

O arquivo é publicado nos GitHub Releases, não no histórico do repositório. O link só funciona depois da criação do primeiro Release.

## Publicar uma nova versão

Depois de enviar o workflow para `main`, abra **Actions → Publish Linux release → Run workflow**, selecione a branch `main` e informe uma tag, por exemplo `v1.0.0`. O workflow gera o AppImage, cria o Release e anexa o ZIP automaticamente.

```sh
# Alternativamente, publicar enviando uma tag:
git tag v1.0.0
git push origin v1.0.0
```