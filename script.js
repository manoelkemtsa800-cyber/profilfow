let students = [
    {
        id: "s1",
        name: "Camille Laurent",
        major: "Intelligence Artificielle",
        level: "Master 2",
        bio: "Passionné par le deep learning et la création de modèles éthiques. Plusieurs projets primés.",
        skills: ["Python", "TensorFlow", "Data Science"],
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cv: "#",
        website: "https://portfolio-camille.fr",
        gallery: ["https://picsum.photos/id/1/200/150", "https://picsum.photos/id/2/200/150"],
        progressSkills: { "Python": 90, "TensorFlow": 85, "Data Science": 88 }
    },
    {
        id: "s2",
        name: "Jules Moreau",
        major: "Design & Luxe",
        level: "Bachelor 3",
        bio: "Créatif digital, spécialisé en identité visuelle et expériences immersives.",
        skills: ["UI/UX", "Figma", "Branding"],
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cv: "#",
        website: "https://julesdesign.com",
        gallery: ["https://picsum.photos/id/20/200/150", "https://picsum.photos/id/30/200/150"],
        progressSkills: { "UI/UX": 92, "Figma": 88, "Branding": 79 }
    }
];

let currentView = "home";

function updateProgressFromSkills(student) {
    let prog = {};
    student.skills.forEach(skill => { prog[skill] = Math.floor(Math.random() * 30) + 65; });
    student.progressSkills = prog;
    return student;
}

function saveData() {
    localStorage.setItem("profilflow_students", JSON.stringify(students));
}

function loadData() {
    const stored = localStorage.getItem("profilflow_students");
    if (stored) {
        students = JSON.parse(stored);
    } else {
        students.forEach(s => updateProgressFromSkills(s));
        saveData();
    }
}

function notify(msg, isError = false) {
    const toast = document.createElement("div");
    toast.className = "toast-notify";
    toast.style.background = isError ? "#4a0e1c" : "#1e2a1f";
    toast.style.borderLeftColor = isError ? "#e06c75" : "var(--gold)";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderFullProfile(student) {
    const skillsHtml = student.skills.map(skill => `
        <div style="margin:8px 0">
            <span>${escapeHtml(skill)}</span>
            <div class="skill-progress"><div class="progress-fill" style="width: ${student.progressSkills?.[skill] || 75}%;"></div></div>
        </div>
    `).join('');
    const galleryHtml = (student.gallery || []).map(img => `<img src="${img}" alt="galerie" loading="lazy">`).join('');
    return `
        <div class="profile-header">
            <img class="profile-avatar" src="${student.photo || 'https://randomuser.me/api/portraits/lego/1.jpg'}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'">
            <div>
                <h2>${escapeHtml(student.name)}</h2>
                <p style="color:var(--gold)">${escapeHtml(student.major)} - ${escapeHtml(student.level || 'Étudiant')}</p>
                <p>${escapeHtml(student.bio || 'Aucune biographie')}</p>
                <div class="flex-btns">
                    <button id="openCvBtn" class="btn-sm">📄 Ouvrir CV</button>
                    <button id="openSiteBtn" class="btn-sm">🌐 Site perso</button>
                </div>
            </div>
        </div>
        <h3>Compétences clés</h3>${skillsHtml}
        <h3>🎥 Vidéo de présentation</h3>
        <video controls style="width:100%; border-radius:20px; margin:10px 0;" src="${student.video || ''}"></video>
        <h3>🎧 Audio présentation</h3>
        <audio controls style="width:100%;" src="${student.audio || ''}"></audio>
        <h3>📸 Galerie</h3>
        <div class="gallery">${galleryHtml || '<i>Aucune image</i>'}</div>
        <h3>✨ Projets / Expériences</h3>
        <p>${student.bio || 'Détails professionnels disponibles sur demande.'}</p>
    `;
}

function showProfileModal(student) {
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.innerHTML = `<div class="modal-content"><span class="close-modal">&times;</span><div id="modalDynamicBody"></div></div>`;
    document.body.appendChild(modalDiv);
    const bodyDiv = modalDiv.querySelector("#modalDynamicBody");
    bodyDiv.innerHTML = renderFullProfile(student);
    const closeBtn = modalDiv.querySelector(".close-modal");
    closeBtn.onclick = () => modalDiv.remove();
    modalDiv.style.display = "flex";
    modalDiv.querySelector("#openCvBtn")?.addEventListener("click", () => {
        if (student.cv && student.cv !== "#") window.open(student.cv, '_blank');
        else notify("CV non disponible", true);
    });
    modalDiv.querySelector("#openSiteBtn")?.addEventListener("click", () => {
        if (student.website) window.open(student.website, '_blank');
        else notify("Site non spécifié", true);
    });
}

function attachStudentCardEvents() {
    document.querySelectorAll(".view-profile-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.getAttribute("data-id");
            const student = students.find(s => s.id === id);
            if (student) showProfileModal(student);
        });
    });
    document.querySelectorAll(".student-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("view-profile-btn")) return;
            const id = card.getAttribute("data-id");
            if (id) showProfileModal(students.find(s => s.id === id));
        });
    });
}

function renderHome() {
    return `
        <div class="hero">
            <h1>ProfilFlow</h1>
            <p>Exposez vos talents au monde</p>
            <button class="btn-gold" id="discoverBtn">Découvrir les profils</button>
        </div>
    `;
}

function renderStudentsGrid() {
    if (students.length === 0) return '<div style="text-align:center; padding:4rem;">Aucun étudiant, ajoutez-en via Admin ✦</div>';
    return `
        <div class="students-grid">
            ${students.map(s => `
                <div class="student-card" data-id="${s.id}">
                    <img class="card-img" src="${s.photo || 'https://randomuser.me/api/portraits/lego/1.jpg'}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'">
                    <div class="student-name">${escapeHtml(s.name)}</div>
                    <div class="student-major">${escapeHtml(s.major)} • ${escapeHtml(s.level || 'N/A')}</div>
                    <div class="skills-tags">${s.skills.map(sk => `<span class="skill-tag">${escapeHtml(sk)}</span>`).join('')}</div>
                    <button class="btn-gold view-profile-btn" data-id="${s.id}" style="padding:0.5rem 1rem; font-size:0.9rem;">Voir le profil</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMainView(view) {
    const mainEl = document.getElementById("main-content");
    if (view === "home") {
        mainEl.innerHTML = renderHome();
        document.getElementById("discoverBtn")?.addEventListener("click", () => renderMainView("students"));
    } else if (view === "students") {
        mainEl.innerHTML = `<div class="section"><div class="section-title">✨ Profils d'élite</div><div id="studentsGridContainer"></div><div><input type="text" id="searchStudents" placeholder="Rechercher par nom ou compétence..." style="margin-top:2rem; background:#1c1c22; border:1px solid #d4af37; padding:0.8rem; border-radius:40px; width:100%; color:white;"></div></div>`;
        const container = document.getElementById("studentsGridContainer");
        function updateGrid() {
            const searchTerm = document.getElementById("searchStudents")?.value.toLowerCase() || "";
            let filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm) || s.skills.some(sk => sk.toLowerCase().includes(searchTerm)));
            container.innerHTML = `<div class="students-grid">${filtered.map(s => `
                <div class="student-card" data-id="${s.id}">
                    <img class="card-img" src="${s.photo || 'https://randomuser.me/api/portraits/lego/1.jpg'}">
                    <div class="student-name">${escapeHtml(s.name)}</div>
                    <div class="student-major">${escapeHtml(s.major)}</div>
                    <div class="skills-tags">${s.skills.map(sk => `<span class="skill-tag">${escapeHtml(sk)}</span>`).join('')}</div>
                    <button class="btn-gold view-profile-btn" data-id="${s.id}" style="padding:0.5rem 1rem;">Voir profil</button>
                </div>
            `).join('')}</div>`;
            attachStudentCardEvents();
        }
        updateGrid();
        const searchInput = document.getElementById("searchStudents");
        if (searchInput) searchInput.addEventListener("input", updateGrid);
    }
    currentView = view;
}

function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth, height = window.innerHeight;
    let particles = [];
    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    window.addEventListener("resize", resize);
    resize();
    for (let i = 0; i < 80; i++) particles.push({ x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 2 + 1, alpha: Math.random() * 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.2 });
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, width, height);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function populateAdminForm(student = null) {
    if (student) {
        document.getElementById("studentId").value = student.id;
        document.getElementById("fullName").value = student.name;
        document.getElementById("major").value = student.major;
        document.getElementById("level").value = student.level || "";
        document.getElementById("bio").value = student.bio || "";
        document.getElementById("skillsInput").value = student.skills.join(", ");
        document.getElementById("photoUrl").value = student.photo || "";
        document.getElementById("videoUrl").value = student.video || "";
        document.getElementById("audioUrl").value = student.audio || "";
        document.getElementById("cvLink").value = student.cv || "";
        document.getElementById("websiteLink").value = student.website || "";
        document.getElementById("galleryImgs").value = (student.gallery || []).join(" | ");
    } else {
        document.getElementById("adminForm").reset();
        document.getElementById("studentId").value = "";
    }
}

function startApp() {
    loadData();
    initParticles();
    renderMainView("home");

    document.querySelectorAll("[data-nav]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const view = e.currentTarget.getAttribute("data-nav");
            if (view === "students") renderMainView("students");
            else if (view === "home") renderMainView("home");
        });
    });

    document.getElementById("adminPanelBtn").onclick = () => {
        const pwd = prompt("Authentification administrateur : saisissez le mot de passe");
        if (pwd === "1234") document.getElementById("adminSidebar").classList.add("open");
        else notify("Accès refusé", true);
    };

    document.getElementById("closeAdminBtn").addEventListener("click", () => document.getElementById("adminSidebar").classList.remove("open"));

    document.getElementById("adminForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("studentId").value;
        const name = document.getElementById("fullName").value;
        const major = document.getElementById("major").value;
        const level = document.getElementById("level").value;
        const bio = document.getElementById("bio").value;
        const skillsStr = document.getElementById("skillsInput").value;
        const skills = skillsStr.split(",").map(s => s.trim()).filter(s => s);
        const photo = document.getElementById("photoUrl").value;
        const video = document.getElementById("videoUrl").value;
        const audio = document.getElementById("audioUrl").value;
        const cv = document.getElementById("cvLink").value;
        const website = document.getElementById("websiteLink").value;
        const galleryStr = document.getElementById("galleryImgs").value;
        const gallery = galleryStr.split("|").map(s => s.trim()).filter(s => s);
        const newStudent = { id: id || `s${Date.now()}`, name, major, level, bio, skills, photo, video, audio, cv, website, gallery, progressSkills: {} };
        updateProgressFromSkills(newStudent);
        if (id) {
            const idx = students.findIndex(s => s.id === id);
            if (idx !== -1) students[idx] = newStudent;
            else students.push(newStudent);
            notify("Profil mis à jour ✨");
        } else {
            students.push(newStudent);
            notify("Nouvel étudiant ajouté");
        }
        saveData();
        document.getElementById("adminSidebar").classList.remove("open");
        renderMainView(currentView === "home" ? "students" : currentView);
    });

    document.getElementById("deleteStudentBtn").addEventListener("click", () => {
        const id = document.getElementById("studentId").value;
        if (!id) { notify("Aucun étudiant sélectionné pour suppression", true); return; }
        students = students.filter(s => s.id !== id);
        saveData();
        notify("Profil supprimé");
        document.getElementById("adminSidebar").classList.remove("open");
        renderMainView(currentView === "home" ? "students" : currentView);
    });

    setTimeout(() => {
        const loader = document.querySelector(".loader");
        if (loader) loader.remove();
    }, 500);
}

startApp();