{
  pkgs, ...
}: {
  # To learn more about how to configure Nix, see  https://docs.fleek.network/docs/collections/nix/
  packages = [
    pkgs.nodejs_20
    pkgs.openssl_3_3
    pkgs.sudo
  ];
  idx.extensions = [];
  idx.previews = {
    previews = {
      web = {
        command = ["npm", "run", "dev", "--", "--port", "$PORT", "--hostname", "0.0.0.0"];
        manager = "web";
      };
    };
  };
}