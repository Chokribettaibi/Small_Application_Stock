// Gestion des données
let stock = JSON.parse(localStorage.getItem('stock')) || [];
let ventes = JSON.parse(localStorage.getItem('ventes')) || [];

// Sélection des éléments DOM
const sections = document.querySelectorAll('section');
const btns = document.querySelectorAll('nav button');
const formAjoutStock = document.getElementById('form-ajout-stock');
const listeStock = document.getElementById('liste-stock');
const searchInput = document.getElementById('search-input');
const listeVentes = document.getElementById('liste-ventes');
const stockActuel = document.getElementById('stock-actuel');
const historiqueVentes = document.getElementById('historique-ventes');


// Navigation
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.id.split('-')[1];
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `section-${target}`) {
                section.classList.add('active');
            }
        });
        refreshUI();
    });
});

// Ajout d'un nouvel article
formAjoutStock.addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        modele: document.getElementById('modele').value,
        marque: document.getElementById('marque').value,
        prixAchat: parseFloat(document.getElementById('prix-achat').value),
        prixVente: parseFloat(document.getElementById('prix-vente').value),
        dateReception: new Date().toISOString()
    };
    stock.push(newItem);
    saveData();
    formAjoutStock.reset();
    refreshUI();
});

// Fonction de sauvegarde des données
function saveData() {
    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('ventes', JSON.stringify(ventes));
}

// Fonction de mise à jour de l'interface
function refreshUI() {
    refreshStock();
    refreshVentes();
    refreshRapport();
}

// Mise à jour de l'affichage du stock
function refreshStock(items = stock) {
    listeStock.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Modèle</th>
                    <th>Marque</th>
                    <th>Prix d'achat</th>
                    <th>Prix de vente</th>
                    <th>Date de réception</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.modele}</td>
                        <td>${item.marque}</td>
                        <td>${item.prixAchat}€</td>
                        <td>${item.prixVente}€</td>
                        <td>${new Date(item.dateReception).toLocaleString()}</td>
                        <td>
                            <button class="edit-btn" onclick="editItem(${item.id})">Modifier</button>
                            <button class="sell-btn" onclick="sellItem(${item.id})">Vendre</button>
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Mise à jour de l'affichage des ventes
function refreshVentes() {
    listeVentes.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Modèle</th>
                    <th>Marque</th>
                    <th>Prix de vente</th>
                    <th>Date de vente</th>
                    <th>Bénéfice</th>
                </tr>
            </thead>
            <tbody>
                ${ventes.map(vente => `
                    <tr>
                        <td>${vente.modele}</td>
                        <td>${vente.marque}</td>
                        <td>${vente.prixVente}€</td>
                        <td>${new Date(vente.dateVente).toLocaleString()}</td>
                        <td>${(vente.prixVente - vente.prixAchat).toFixed(2)}€</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Mise à jour du rapport
function refreshRapport() {
    const totalStock = stock.length;
    const valeurStock = stock.reduce((acc, item) => acc + item.prixAchat, 0);
    const totalVentes = ventes.length;
    const beneficeTotal = ventes.reduce((acc, vente) => acc + (vente.prixVente - vente.prixAchat), 0);

    stockActuel.innerHTML = `
        <p>Nombre d'articles en stock: ${totalStock}</p>
        <p>Valeur totale du stock: ${valeurStock.toFixed(2)}€</p>
    `;

    historiqueVentes.innerHTML = `
        <p>Nombre total de ventes: ${totalVentes}</p>
        <p>Bénéfice total: ${beneficeTotal.toFixed(2)}€</p>
    `;
}

// Fonction de modification d'un article
function editItem(id) {
    const item = stock.find(i => i.id === id);
    if (!item) return;

    const newModele = prompt('Nouveau modèle:', item.modele);
    if (newModele === null) return;

    const newMarque = prompt('Nouvelle marque:', item.marque);
    if (newMarque === null) return;

    const newPrixAchat = prompt('Nouveau prix d\'achat:', item.prixAchat);
    if (newPrixAchat === null) return;

    const newPrixVente = prompt('Nouveau prix de vente:', item.prixVente);
    if (newPrixVente === null) return;

    item.modele = newModele;
    item.marque = newMarque;
    item.prixAchat = parseFloat(newPrixAchat);
    item.prixVente = parseFloat(newPrixVente);
    item.etat = newEtat;
    item.nomClient = newNomClient;
    item.numeroClient = newNumeroClient;
    item.panne = newPanne;

    saveData();
    refreshUI();
}

// Fonction de vente d'un article
function sellItem(id) {
    const item = stock.find(i => i.id === id);
    if (!item) return;

    if (confirm(`Confirmer la vente de ${item.marque} ${item.modele} ?`)) {
        const vente = {
            ...item,
            dateVente: new Date().toISOString()
        };
        ventes.push(vente);
        stock = stock.filter(i => i.id !== id);
        saveData();
        refreshUI();
    }
}

// Fonction de suppression d'un article
function deleteItem(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        stock = stock.filter(item => item.id !== id);
        saveData();
        refreshUI();
    }
}

// Initialisation de l'interface
refreshUI();