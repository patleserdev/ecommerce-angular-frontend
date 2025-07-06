require('dotenv').config(); // ← Ajoute ceci au début

console.log("env",process.env.BACKEND_URL)

module.exports = {
  "/api": {
    "target": process.env.BACKEND_URL,
    "secure": false,
    "changeOrigin": true,
    "withCredentials": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}


