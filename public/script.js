const form = document.getElementById('monitor-form');
const urlInput = document.getElementById('url');
const siteList = document.getElementById('siteList');

let sites = JSON.parse(localStorage.getItem('gabimaruSites')) || [];

function saveSites() {
  localStorage.setItem('gabimaruSites', JSON.stringify(sites));
}

function getRandomStatus() {
  return Math.random() > 0.2 ? 'up' : 'down'; // 80% chance it's UP
}

function createSiteElement(site) {
  const li = document.createElement('li');
  const status = getRandomStatus();

  li.innerHTML = `
    <span>${site}</span>
    <span class="status ${status}">${status.toUpperCase()}</span>
    <button class="remove-btn">✖</button>
  `;

  li.querySelector('.remove-btn').onclick = () => {
    sites = sites.filter(s => s !== site);
    saveSites();
    renderSites();
  };

  siteList.appendChild(li);
}

function renderSites() {
  siteList.innerHTML = '';
  sites.forEach(createSiteElement);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const site = urlInput.value.trim();
  if (!site) return;

  if (!/^https?:\/\//.test(site)) {
    alert("URL must start with http:// or https://");
    return;
  }

  if (sites.includes(site)) {
    alert("Site already added.");
    return;
  }

  sites.push(site);
  saveSites();
  renderSites();
  urlInput.value = '';
});

renderSites();