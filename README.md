# 🐔 OOPS! ALL CHICKENS

> ## O Núcleo do Tempo
>
> **O apocalipse tem penas. E você tem uma arma.**

OOPS! ALL CHICKENS é um jogo indie de ação e plataforma que combina **movimentação, exploração e progressão de habilidades** com uma aventura inspirada nos clássicos jogos de ação.

Enfrente galinhas zumbis, domine novas habilidades de movimento, explore caminhos secretos e prepare-se para atravessar diferentes épocas, enfrentar criaturas alienígenas e descobrir os mistérios por trás do Núcleo do Tempo.

**A sobrevivência é apenas o começo.**

---

## Mapas

O catálogo de eras e suas propriedades visuais fica em [`meu-app/game/maps/MapCatalog.js`](./meu-app/game/maps/MapCatalog.js). O carregamento e o registro dos construtores ficam em [`meu-app/game/maps/MapManager.js`](./meu-app/game/maps/MapManager.js).

Os construtores de geometria e as mecânicas específicas de cada fase ainda estão em [`meu-app/script.js`](./meu-app/script.js): `e1` a `e8` definem as eras principais e `eMuseu`, `eArranha`, `eColapso` e `eBiblioteca` definem as eras extras. Esses construtores são registrados no `MapManager`; ao criar uma nova era, mantenha o índice alinhado com `EPOCHS` e registre seu construtor correspondente.

## Armas

O catálogo, as categorias, raridades, ofertas da loja e configurações dos projéteis ficam em [`meu-app/game/weapons/WeaponCatalog.js`](./meu-app/game/weapons/WeaponCatalog.js). A lógica de munição, recarga, disparo e equipamento está em [`meu-app/game/weapons/WeaponSystem.js`](./meu-app/game/weapons/WeaponSystem.js), e os modelos e pickups visuais em [`meu-app/game/weapons/WeaponVisuals.js`](./meu-app/game/weapons/WeaponVisuals.js).

Os projéteis soltam faíscas ao atingir o chão ou paredes. As armas de dano em área também mostram uma explosão expansiva com faíscas.

## Publicar uma nova versão

Depois de enviar o workflow para `main`, abra **Actions → Publish OOPS! ALL CHICKENS release → Run workflow**, selecione a branch `main` e informe uma nova tag, por exemplo `v1.0.1`. O workflow gera o AppImage e o instalador `.exe`, então cria ou atualiza o Release com os dois downloads.

```sh
# Alternativamente, publique ambos os downloads enviando uma tag:
git tag v1.0.1
git push origin v1.0.1
```

O instalador Windows não é assinado digitalmente; o Windows pode exibir um aviso do SmartScreen na primeira execução.

## 🎮 Sobre o jogo

Em **OOPS! ALL CHICKENS**, movimentar-se é tão importante quanto combater.

O jogador precisa dominar suas habilidades, explorar o ambiente e encontrar maneiras de superar desafios. Conforme avança, novas possibilidades de movimentação são desbloqueadas, transformando a maneira como cada mapa pode ser explorado.

### ⚡ Movimentação e exploração

- 🏃 **Corrida:** atravesse os cenários com mais velocidade.
- 🦘 **Pulo duplo:** alcance plataformas elevadas e desvie de ataques.
- 🔓 **Novas habilidades:** desbloqueie possibilidades adicionais conforme a progressão.
- 🗺️ **Caminhos alternativos:** descubra rotas diferentes e áreas anteriormente inacessíveis.
- 🕵️ **Segredos e enigmas:** explore os mapas para encontrar novas possibilidades.

Os mapas são projetados para trabalhar em conjunto com as habilidades do jogador. Cada nova habilidade pode abrir caminhos, revelar segredos e permitir abordagens diferentes para os desafios.

### 🔫 Combate e progressão

A exploração é apenas parte da experiência. O jogador também precisa enfrentar inimigos, aprimorar seu arsenal e superar desafios progressivamente mais complexos.

- 🧟 Apocalipse de galinhas zumbis.
- 🔫 Armas de fogo e melhorias de equipamento.
- 📈 Progressão por níveis e desafios.
- ⚔️ Elementos inspirados em guerreiros da antiguidade.
- 👽 Criaturas extraterrestres e ameaças de outros mundos.
- 🌌 Entidades cósmicas e mistérios envolvendo o tempo.

*Algumas dessas ideias fazem parte da visão de desenvolvimento do projeto e podem não estar disponíveis na versão atual.*

---

## 📥 Download

Os downloads abaixo ficam disponíveis nos Releases do GitHub. A versão mais recente é a **v1.0.1**; os arquivos da versão anterior **v1.0.0** continuam disponíveis.

### 🐧 Linux

[⬇️ **OOPS! ALL CHICKENS v1.0.1 para Linux (.AppImage)**](https://github.com/Heitor487175/ChickenDoom/releases/download/v1.0.1/ChickenDoom-AppImages.zip) · [Versão anterior v1.0.0](https://github.com/Heitor487175/ChickenDoom/releases/download/v1.0.0/ChickenDoom-AppImages.zip)

O pacote contém o aplicativo AppImage para execução em sistemas Linux compatíveis.

**Como executar:**

1. Baixe o arquivo ZIP.
2. Extraia o conteúdo:

   ```bash
   unzip ChickenDoom-AppImages.zip
   ```

3. Entre na pasta extraída e localize o arquivo `.AppImage`.
4. Caso necessário, permita sua execução:

   ```bash
   chmod +x ChickenDoom.AppImage
   ```

5. Execute o aplicativo:

   ```bash
   ./ChickenDoom.AppImage
   ```

*Se o arquivo tiver outro nome, substitua `ChickenDoom.AppImage` pelo nome real do arquivo extraído.*

### 🪟 Windows

[⬇️ **OOPS! ALL CHICKENS v1.0.1 para Windows (.exe)**](https://github.com/Heitor487175/ChickenDoom/releases/download/v1.0.1/Chicken-Doom-Setup.exe) · [Versão anterior v1.0.0](https://github.com/Heitor487175/ChickenDoom/releases/download/v1.0.0/Chicken-Doom-Setup.exe)

Baixe o instalador e siga as instruções para instalar o jogo.

> ⚠️ **Aviso sobre o Windows SmartScreen:** o instalador não possui assinatura digital. Por isso, o Windows pode exibir um aviso de segurança durante a instalação ou na primeira execução.

---

## 🗺️ Visão de desenvolvimento

O objetivo do OOPS! ALL CHICKENS é construir uma experiência em que cada fase tenha sua própria identidade, combinando exploração, combate, movimentação e progressão.

### Próximos objetivos

- [ ] Expandir a variedade de mapas e ambientes.
- [ ] Criar objetivos e eventos diferentes entre as fases.
- [ ] Ampliar o sistema de habilidades de movimentação.
- [ ] Desenvolver mapas que aproveitem as habilidades desbloqueadas.
- [ ] Adicionar mais caminhos secretos, chaves e enigmas.
- [ ] Expandir a variedade de inimigos e encontros.
- [ ] Aprimorar o sistema de armas e melhorias.
- [ ] Explorar novas épocas e ameaças relacionadas ao Núcleo do Tempo.

*Esta lista representa objetivos de desenvolvimento e não indica necessariamente recursos já implementados.*

---

## 🛠️ Tecnologias

OOPS! ALL CHICKENS é desenvolvido com tecnologias voltadas para jogos e aplicações executadas no navegador e no desktop.

- **JavaScript** — lógica e sistemas do jogo.
- **HTML5** — estrutura da aplicação.
- **CSS** — interface e apresentação visual.

---

## 🤝 Contribuições

Encontrou um problema ou teve uma ideia para o jogo?

Você pode contribuir com sugestões, relatar bugs ou propor melhorias por meio da seção [Issues](https://github.com/Heitor487175/ChickenDoom/issues).

Toda contribuição que ajude a melhorar a experiência de jogo é bem-vinda!

---

## 👨‍💻 Desenvolvedor

Desenvolvido por [**Heitor Martins (@Heitor487175)**](https://github.com/Heitor487175).

OOPS! ALL CHICKENS é um projeto indie criado com o objetivo de experimentar mecânicas de gameplay, desenvolver sistemas de jogo e transformar uma ideia absurda em uma experiência cada vez mais completa.

---

<div align="center">

### 🐔 LOCK. LOAD. CLUCK.

**THE APOCALYPSE HAS WINGS.**

Se gostou do projeto, deixe uma ⭐ no repositório!

[🎮 Baixar o jogo](https://github.com/Heitor487175/ChickenDoom/releases/latest) · [🐛 Reportar um problema](https://github.com/Heitor487175/ChickenDoom/issues) · [💻 Ver o código](https://github.com/Heitor487175/ChickenDoom)

</div>
