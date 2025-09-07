const copyTemplates = {
  offer: [
    "Ei, galera! 🔥 [Tema] tá com tudo aqui na [Local]! Só hoje, corre pra garantir! #Oferta #NãoPerca",
    "Tá na hora de aproveitar! 😎 [Tema] com desconto imperdível na [Local]. Vem antes que acabe! #Promoção",
    "Sabe aquela vontade de [Tema]? Aqui na [Local] tem isso e muito mais! Garanta já! #OfertaRelâmpago"
  ],
  event: [
    "Bora curtir? 🎉 [Tema] rolando na [Local]! Não fica de fora dessa! #EventoTop #VemComAGente",
    "Ei, [Público]! [Tema] tá chegando na [Local]. Reserva seu lugar agora! #Festa #Imperdível",
    "Imagina só: você curtindo [Tema] com a galera na [Local]! 😊 Vem com a gente! #Evento"
  ],
  update: [
    "Novidade quentinha! 🚀 [Tema] acabou de chegar na [Local]. Vem conferir! #Novidade #VemVer",
    "Sabe o que tá bombando? [Tema] na [Local]! 😍 Passa aqui pra ver de perto! #Atualização",
    "[Público], olha só: [Tema] tá rolando na [Local]. Não perde essa! #NovidadeQuente"
  ]
};

function generateCopy() {
  const postType = document.getElementById('post-type').value;
  const theme = document.getElementById('post-theme').value || 'seu post';
  const audience = document.getElementById('target-audience').value || 'galera';
  const location = document.getElementById('location').value || 'nossa loja';
  
  const templates = copyTemplates[postType];
  const copy = templates[Math.floor(Math.random() * templates.length)]
    .replace('[Tema]', theme)
    .replace('[Público]', audience)
    .replace('[Local]', location);
  
  const output = document.getElementById('copy-output');
  output.innerHTML = `
    <p>${copy}</p>
    <button class="btn" onclick="navigator.clipboard.writeText('${copy}')">Copiar Texto</button>
  `;
}

function searchUnsplash() {
  const query = document.getElementById('unsplash-query').value || 'generic';
  const preview = document.getElementById('image-preview');
  const img = document.createElement('img');
  img.src = `https://source.unsplash.com/400x300/?${query}`;
  img.alt = `Imagem de ${query}`;
  preview.innerHTML = '';
  preview.appendChild(img);
}

function generateAIImage() {
  const theme = document.getElementById('post-theme').value || 'generic';
  console.log(`Simulando IA: Gerar imagem de "${theme}" em estilo realista`);
  const preview = document.getElementById('image-preview');
  const img = document.createElement('img');
  img.src = `https://source.unsplash.com/400x300/?${theme}`; // Placeholder
  img.alt = `Imagem gerada para ${theme}`;
  preview.innerHTML = '';
  preview.appendChild(img);
}

document.getElementById('local-image').addEventListener('change', function(e) {
  const preview = document.getElementById('image-preview');
  preview.innerHTML = '';
  for (let file of e.target.files) {
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      preview.appendChild(img);
    }
  }
});

function savePost() {
  const postType = document.getElementById('post-type').value;
  const theme = document.getElementById('post-theme').value;
  const audience = document.getElementById('target-audience').value;
  const location = document.getElementById('location').value;
  const copy = document.getElementById('copy-output').textContent;
  const image = document.getElementById('image-preview').querySelector('img')?.src || '';

  const post = { postType, theme, audience, location, copy, image, date: new Date().toISOString() };
  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.push(post);
  localStorage.setItem('posts', JSON.stringify(posts));

  renderPostPreview(post);
  renderGallery();
}

function renderPostPreview(post) {
  const preview = document.getElementById('post-preview');
  preview.innerHTML = `
    <div class="content">
      <img src="${post.image}" alt="Post image">
      <p>${post.copy}</p>
      <button class="btn" onclick="navigator.clipboard.writeText('${post.copy}')">Copiar Texto</button>
    </div>
  `;
}

function renderGallery() {
  const gallery = document.getElementById('post-gallery');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  gallery.innerHTML = '';
  posts.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'post-preview';
    card.innerHTML = `
      <img src="${post.image}" alt="Post image">
      <div class="content">
        <p>${post.copy}</p>
        <button class="btn" onclick="navigator.clipboard.writeText('${post.copy}')">Copiar</button>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function saveSettings() {
  const businessName = document.getElementById('business-name').value;
  const logo = document.getElementById('business-logo').files[0];
  if (businessName) localStorage.setItem('businessName', businessName);
  if (logo) {
    const reader = new FileReader();
    reader.onload = () => localStorage.setItem('businessLogo', reader.result);
    reader.readAsDataURL(logo);
  }
  alert('Configurações salvas!');
}

document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    document.querySelector(link.getAttribute('href')).classList.add('active');
  });
});

window.onload = () => renderGallery();