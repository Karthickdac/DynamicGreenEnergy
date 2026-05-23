module.exports = {
  apps: [
    {
      name: "dge-erp",
      script: "./dist/index.cjs",
      cwd: "/home/dynamicgreenenergy-erp/htdocs/erp.dynamicgreenenergy.in",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        PORT: 6100,
      },
      error_file: "/home/dynamicgreenenergy-erp/logs/error.log",
      out_file: "/home/dynamicgreenenergy-erp/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M",
      restart_delay: 3000,
      watch: false,
    },
  ],
};
