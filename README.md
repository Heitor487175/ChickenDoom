# ChickenDoom

## Downloads

- [Windows 64-bit (.exe)](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-Windows-x64.exe)
- [Linux 64-bit (.AppImage)](https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-Linux-x64.AppImage)

Os downloads são publicados automaticamente quando uma tag `v*` é enviada ao GitHub. Consulte [todas as releases](https://github.com/Heitor487175/ChickenDoom/releases).

## Publicação

1. Crie uma tag de versão: `git tag v1.0.0`
2. Envie para o GitHub: `git push origin v1.0.0`
3. O workflow em [./.github/workflows/desktop-release.yml](.github/workflows/desktop-release.yml) monta o `.exe` e o `.AppImage` e publica os artefatos na release.

A URL de download usa o padrão do GitHub Releases:

- `https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-Windows-x64.exe`
- `https://github.com/Heitor487175/ChickenDoom/releases/latest/download/ChickenDoom-Linux-x64.AppImage`