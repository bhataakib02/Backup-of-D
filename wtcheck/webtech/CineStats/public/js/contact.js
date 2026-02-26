const form = document.getElementById('contactForm');
const msg = document.getElementById('msg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    msg.textContent = 'Thank you! Your message has been received.';
    msg.className = 'success';
    form.reset();
  } catch {
    msg.textContent = 'Sorry, something went wrong.';
    msg.className = 'error';
  }
});


