import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Ini hanya tes untuk CI
    console.log("Testing CI/CD pipelines");
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
