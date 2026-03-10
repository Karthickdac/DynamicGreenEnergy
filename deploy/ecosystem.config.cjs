module.exports = {
  apps: [
    {
      name: "dynamic-green-energy",
      script: "./dist/index.cjs",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "/var/log/dge/error.log",
      out_file: "/var/log/dge/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M",
      restart_delay: 3000,
      watch: false,
    },
  ],
};
