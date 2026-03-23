const API_URL = "http://localhost:3000/api/articles";

// Charger tous les articles au démarrage
function loadArticles() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Erreur chargement');
            return res.json();
        })
        .then(articles => displayArticles(articles))
        .catch(err => console.error('Erreur:', err));
}

// Afficher les articles
function displayArticles(articles) {
    const container = document.getElementById("articlesList");
    if (!container) return;
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Aucun article pour le moment. Créez le premier !</p>';
        return;
    }
    
    container.innerHTML = "";
    articles.forEach(article => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
            <h3>📌 ${escapeHtml(article.title)}</h3>
            <p><strong>✍️ Auteur :</strong> ${escapeHtml(article.author)}</p>
            <p><strong>📂 Catégorie :</strong> ${escapeHtml(article.category || 'Non catégorisé')}</p>
            <p><strong>🏷️ Tags :</strong> ${escapeHtml(article.tags || 'Aucun')}</p>
            <p><strong>📅 Date :</strong> ${article.date}</p>
            <p><strong>📄 Contenu :</strong><br>${escapeHtml(article.content)}</p>
            <button onclick="editArticle(${article.id})">✏️ Modifier</button>
            <button onclick="deleteArticle(${article.id})">🗑️ Supprimer</button>
        `;
        container.appendChild(div);
    });
}

// Échapper les caractères HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Créer un article
const articleForm = document.getElementById("articleForm");
if (articleForm) {
    articleForm.addEventListener("submit", e => {
        e.preventDefault();
        
        const article = {
            title: document.getElementById("title").value.trim(),
            content: document.getElementById("content").value.trim(),
            author: document.getElementById("author").value.trim(),
            category: document.getElementById("category").value.trim(),
            tags: document.getElementById("tags").value.trim()
        };
        
        if (!article.title || !article.content || !article.author) {
            alert("Le titre, le contenu et l'auteur sont obligatoires !");
            return;
        }
        
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article)
        })
        .then(res => {
            if (!res.ok) throw new Error('Erreur création');
            return res.json();
        })
        .then(() => {
            articleForm.reset();
            loadArticles();
            alert("Article créé avec succès !");
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de la création");
        });
    });
}

// Supprimer un article
function deleteArticle(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error('Erreur suppression');
            return res.json();
        })
        .then(() => {
            loadArticles();
            alert("Article supprimé !");
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de la suppression");
        });
}

// Modifier un article
function editArticle(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(article => {
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            
            modal.innerHTML = `
                <div style="background: white; padding: 25px; border-radius: 15px; width: 90%; max-width: 550px;">
                    <h3 style="margin-bottom: 20px;">✏️ Modifier l'article</h3>
                    <input type="text" id="editTitle" value="${escapeHtml(article.title)}" placeholder="Titre" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                    <input type="text" id="editAuthor" value="${escapeHtml(article.author)}" placeholder="Auteur" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                    <input type="text" id="editCategory" value="${escapeHtml(article.category || '')}" placeholder="Catégorie" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                    <input type="text" id="editTags" value="${escapeHtml(article.tags || '')}" placeholder="Tags" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                    <textarea id="editContent" placeholder="Contenu" rows="6" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">${escapeHtml(article.content)}</textarea>
                    <div style="display:flex; gap:10px;">
                        <button id="saveEdit" style="flex:1; padding:12px; background:#48bb78; color:white; border:none; border-radius:8px; cursor:pointer;">💾 Enregistrer</button>
                        <button id="cancelEdit" style="flex:1; padding:12px; background:#f56565; color:white; border:none; border-radius:8px; cursor:pointer;">❌ Annuler</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            document.getElementById('saveEdit').onclick = () => {
                const updated = {
                    title: document.getElementById('editTitle').value,
                    author: document.getElementById('editAuthor').value,
                    category: document.getElementById('editCategory').value,
                    tags: document.getElementById('editTags').value,
                    content: document.getElementById('editContent').value
                };
                
                if (!updated.title || !updated.author || !updated.content) {
                    alert("Le titre, l'auteur et le contenu sont obligatoires !");
                    return;
                }
                
                fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                })
                .then(res => {
                    if (!res.ok) throw new Error('Erreur modification');
                    return res.json();
                })
                .then(() => {
                    modal.remove();
                    loadArticles();
                    alert("Article modifié avec succès !");
                })
                .catch(err => {
                    console.error(err);
                    alert("Erreur lors de la modification");
                });
            };
            
            document.getElementById('cancelEdit').onclick = () => modal.remove();
        })
        .catch(err => console.error(err));
}

// Rechercher
const searchBtn = document.getElementById("searchBtn");
const resetSearchBtn = document.getElementById("resetSearchBtn");
const searchQuery = document.getElementById("searchQuery");

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const query = searchQuery.value.trim();
        if (!query) {
            loadArticles();
            return;
        }
        fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(articles => displayArticles(articles))
            .catch(err => console.error(err));
    });
}

if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
        if (searchQuery) searchQuery.value = '';
        loadArticles();
    });
}

// Recherche avec la touche Entrée
if (searchQuery) {
    searchQuery.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
}

// Initialisation
loadArticles();
