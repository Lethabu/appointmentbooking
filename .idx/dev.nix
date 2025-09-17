{pkgs, ...}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.openssl_3
  ];

  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15;
  };

  idx.extensions = [];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}