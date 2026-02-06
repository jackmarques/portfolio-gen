const about = document.getElementById('about');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const formulario = document.getElementById('formulario');
// regex de validação do e-mail
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/jackmarques');
        const perfil = await resposta.json();

        about.innerHTML = '';

        about.innerHTML = `
             <figure class="about-image">
                <img src="${perfil.avatar_url}" alt="Foto do perfil">
            </figure>

            <article class="about-content">
                <h2>Sobre mim</h2>
                <p>
                    Sou desenvolvedora em transição de carreira, com formação técnica em Desenvolvimento de Sistemas e em formação como Desenvolvedora Full Stack pela Generation Brasil. Tenho experiência prévia de mais de 10 anos em ambientes profissionais estruturados, o que fortaleceu habilidades como organização, comunicação, responsabilidade e trabalho em equipe.
                </p>
                <p>
                    Atualmente, desenvolvo projetos utilizando JavaScript, TypeScript, HTML, CSS, Tailwind CSS, React, Vite, NestJS, MySQL, Python, além de Git e GitHub. Busco oportunidades como Desenvolvedora Júnior ou Trainee, onde possa aprender continuamente e contribuir de forma colaborativa.
                </p>

                <div class="about-buttons-data">
                    <div class="buttons-container">
                        <a href="${perfil.html_url}" target="_blank" class="botao">Ver GitHub</a>
                        <a href="https://drive.google.com/file/d/1Oft5iXwck1NtfSlTWiCDR57oMytqXKZF/view?usp=sharing"
                            target="_blank" class="botao-outline">Currículo</a>
                    </div>

                    <div class="data-container">
                        <div class="data-item">
                            <span class="data-number">${perfil.followers}</span>
                            <span class="data-label">Seguidores</span>
                        </div>
                        <div class="data-item">
                            <span class="data-number">${perfil.public_repos}</span>
                            <span class="data-label">Repositórios</span>
                        </div>
                    </div>
                </div>

            </article>
        `
    } catch (error) {
        console.error('Erro ao buscar dados do GitHub', error);
    }
}
getAboutGithub();

async function getProjectsGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/jackmarques/repos?sort=update&per_page=6');
        const repositorios = await resposta.json();

        swiperWrapper.innerHTML = '';

        const linguagens = {
            'JavaScript': { icone: 'javascript' },
            'TypeScript': { icone: 'typescript' },
            'Python': { icone: 'python' },
            'Java': { icone: 'java' },
            'HTML': { icone: 'html' },
            'CSS': { icone: 'css' },
            'PHP': { icone: 'php' },
            'C#': { icone: 'csharp' },
            'Go': { icone: 'go' },
            'Kotlin': { icone: 'kotlin' },
            'Swift': { icone: 'swift' },
        };

        repositorios.forEach(repositorio => {
            const linguagemExibir = repositorio.language || 'GitHub';
            const config = linguagens[repositorio.language] || { icone: 'github' };
            const urlIcone = `./assets/icons/languages/${config.icone}.svg`;

            // Formata o nome do repositório: substitui hífens e underlines por espaços, remove caracteres especiais e converte o texto para letras maiúsculas, tornando-o mais legível no card.
            const nomeFormatado = repositorio.name
                .replace(/[-_]/g, ' ')
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .toUpperCase();

            const descricao = repositorio.description
                ? (repositorio.description.length > 100 ? repositorio.description.substring(0, 97) + '...' : repositorio.description)
                : 'Projeto desenvolvido no GitHub';

            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag"> ${topic}</span>`).join('')
                : `<span class="tag"> ${linguagemExibir}</span>`;

            const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">GitHub</a> ${repositorio.homepage ? `
                        <a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>
                    ` : ''}
                </div>
            `;

            swiperWrapper.innerHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlIcone}" alt="${linguagemExibir}">
                        </div>

                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;

        });

        inciarSwiper();

    } catch (error) {
        console.error('Erro ao buscar repositório', error);
    }
}
getProjectsGithub();

function inciarSwiper() {
    new Swiper('.projects-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        centeredSlides: false,
        loop: true,
        watchOverflow: true,

        breakpoints: {
            0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 40,
                centeredSlides: false
            },
            769: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 40,
                centeredSlides: false
            },
            1025: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 54,
                centeredSlides: false
            }
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },

        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },

        grabCursor: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0
    });
}

// Função de validação do formulário
formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    document.querySelectorAll('form span').forEach(span => span.innerHTML = '');

    let isValid = true;

    const nome = document.getElementById('nome');
    const erroNome = document.getElementById('erro-nome');

    if (nome.value.trim().length < 3) {
        erroNome.innerHTML = 'O nome deve ter no mínimo 3 caracteres.';
        if (isValid) nome.focus();
        isValid = false;
    }

    const email = document.getElementById('email');
    const erroEmail = document.getElementById('erro-email');

    if (!email.value.trim().match(emailRegex)) {
        erroEmail.innerHTML = 'Digite um e-mail válido.';
        if (isValid) email.focus();
        isValid = false;
    }

    const assunto = document.getElementById('assunto');
    const erroAssunto = document.getElementById('erro-assunto');

    if (assunto.value.trim().length < 5) {
        erroAssunto.innerHTML = 'O assunto deve ter no mínimo 5 caracteres.';
        if (isValid) assunto.focus();
        isValid = false;
    }
    const mensagem = document.getElementById('mensagem');
    const erroMensagem = document.getElementById('erro-mensagem');
    if (mensagem.value.trim().length === 0) {
        erroMensagem.innerHTML = 'A mensagem não pode ser vazia.';
        if (isValid) mensagem.focus();
        isValid = false;
    }

    if (isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        formulario.submit();
    }
})