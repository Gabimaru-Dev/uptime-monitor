const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const urlList = document.getElementById('urlList');

addBtn.onclick = async () => {
  const url = urlInput.value.trim();
  if (!url) return alert('Enter a URL');

  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  const data = await res.json();
  if (data.success) {
    loadUrls();
    urlInput.value = '';
  } else {
    alert(data.error || 'Failed to add URL');
  }
};

async function loadUrls() {
  const res = await fetch('/api/list');
  const urls = await res.json();
  urlList.innerHTML = '';
  urls.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    urlList.appendChild(li);
  });
}

loadUrls();