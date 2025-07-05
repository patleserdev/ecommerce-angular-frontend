module.exports = {
  "/api": {
    "target": process.env.BACKEND_URL || "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "withCredentials": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
