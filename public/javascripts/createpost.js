document.getElementById("file").addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('post').src = window.URL.createObjectURL(file);
    }
});