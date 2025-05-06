import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Ini hanya tes untuk CI/CD
    console.log("Testing CI/CD pipelines JOBS on Gitlab test again 7");
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
