require('dotenv').config(); // ← Ajoute ceci au début


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


