import cli from "./cli";

require("tls").DEFAULT_MIN_VERSION = "TLSv1.2";
require("tls").DEFAULT_MAX_VERSION = "TLSv1.2";

cli.run();
