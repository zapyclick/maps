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

async function generateCopy() {
  const postType = document.getElementById('post-type').value;
  const theme = document.getElementById('post-theme').value || 'seu post';
  const audience = document.getElementById('target-audience').value || 'galera';
  const location = document.getElementById('location').value || 'nossa loja';
  const numVariations = 3;

  const prompt = `Crie ${numVariations} posts curtos (100-200 caracteres) para Google Business Profile sobre ${theme}, para ${audience} na ${location}. Use linguagem informal, FOMO, empatia, 1-2 emojis, 3-5 hashtags. Formate como: "1. Copy", "2. Copy". Exemplo: "1. Ei, galera! ${theme} na ${location}! Só hoje! 😎 #Oferta #VemPraCa"`;

  try {
    console.log('Enviando requisição para Hugging Face...');
    const response = await fetch('https://api-inference.huggingface.co/models/distilgpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
// Em searchUnsplash
'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 400,
          temperature: 0.8,
          num_return_sequences: numVariations
        }
      }),
    });

    console.log('Resposta recebida:', response.status);
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    console.log('Dados da API:', data);
    const copies = data
      .map(item => item.generated_text.trim())
      .flatMap(text => text.split('\n').filter(line => /^\d+\./.test(line)))
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .filter(copy => copy.length > 20);
    const output = document.getElementById('copy-output');
    if (copies.length === 0) {
      throw new Error('Nenhuma copy válida gerada pela API.');
    }

    output.innerHTML = copies.map((copy, i) => `
      <p><strong>Var ${i+1}:</strong> ${copy}</p>
      <button class="btn" onclick="navigator.clipboard.writeText('${copy}')">Copiar Var ${i+1}</button>
    `).join('');
  } catch (error) {
    console.error('Erro na IA:', error.message);
    generateCopyFallback();
  }
}

function generateCopyFallback() {
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

async function searchUnsplash() {
  const query = document.getElementById('unsplash-query').value || 'generic';
  const preview = document.getElementById('image-preview');
  preview.innerHTML = '<p>Carregando imagens...</p>';

  try {
    console.log('Buscando imagens no Unsplash...');
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'}`,
        'Accept-Version': 'v1'
      }
    });

    console.log('Resposta do Unsplash:', response.status);
    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.join(', '));
    }

    const photos = data.results || [];
    preview.innerHTML = '';
    if (photos.length === 0) {
      preview.innerHTML = '<p>Nenhuma imagem encontrada.</p>';
      return;
    }

    photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo.urls.small;
      img.alt = photo.alt_description || `Imagem ${index + 1} para ${query}`;
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        preview.innerHTML = '';
        preview.appendChild(img.cloneNode(true));
      });
      preview.appendChild(img);
    });
  } catch (error) {
    console.error('Erro no Unsplash:', error.message);
    preview.innerHTML = '<p>Erro ao carregar imagens. Tente novamente.</p>';
  }
}

function generateAIImage() {
  const theme = document.getElementById('post-theme').value || 'generic';
  console.log(`Simulando IA: Gerar imagem de "${theme}" em estilo realista`);
  const preview = document.getElementById('image-preview');
  const img = document.createElement('img');
  img.src = `https://source.unsplash.com/400x300/?${theme}`; // Placeholder até integrar IA real
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