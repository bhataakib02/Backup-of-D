async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if(!file) return alert('Select a file');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://127.0.0.1:5000/api/documents/upload', { method:'POST', body:formData });
    const result = await res.json();
    document.getElementById('result').innerText = JSON.stringify(result, null, 2);
}
