GBP Post Creator
Um aplicativo web simples para criar posts otimizados para o Google Business Profile (GBP) com design neumórfico, linguagem informal e técnicas de neuromarketing.
Funcionalidades

Criação de Posts: Gere textos com FOMO, neurônio espelho e CTAs fortes.
Imagens: Suporte a upload local, busca simulada no Unsplash e placeholder para IA.
Galeria: Visualize e edite posts salvos (localStorage).
Configurações: Adicione nome e logo do negócio.
Design: Neumórfico, responsivo, com paleta e fontes do Google.

Como Rodar Localmente

Clone o repositório: git clone https://github.com/username/gbp-post-creator.git
Abra index.html com um servidor local (ex.: npx live-server).
Acesse no navegador.

Deploy no Netlify

Crie um repositório público no GitHub.
Conecte ao Netlify via painel (selecionar repositório e pasta raiz).
Configure netlify.toml (incluído abaixo).
Deploy automático ao push na branch main.

Roadmap

v2.0: Integração com API do Unsplash e IA gratuita (ex.: Hugging Face).
v3.0: Exportação direta para GBP via API oficial.

Tecnologias

HTML5, CSS3, JavaScript (Vanilla)
Google Fonts (Roboto, Roboto Slab)
Material Icons
localStorage para persistência

Estrutura

index.html: Estrutura principal.
styles.css: Estilos neumórficos.
script.js: Lógica de geração e salvamento.
assets/: Imagens e ícones.
