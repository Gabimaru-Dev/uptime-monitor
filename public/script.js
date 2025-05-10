const form = document.getElementById('monitor-form');
const urlInput = document.getElementById('url');
const siteList = document.getElementById('siteList');

async function fetchStatuses() {
  const res = await fetch('/status');
  const data = await res.json();

  siteList.innerHTML = '';
  data.forEach(({ url, status }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${url}</span>
      <span class="status ${status}">${status.toUpperCase()}</span>
    `;
    siteList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url.startsWith('http')) return alert('URL must start with http(s)://');

  const res = await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  if (res.ok) {
    urlInput.value = '';
    fetchStatuses();
  } else {
    alert(await res.text());
  }
});

setInterval(fetchStatuses, 10000); // Refresh every 10 seconds
fetchStatuses();