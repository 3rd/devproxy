# devproxy

> WIP

## Usage

```
Usage: devproxy [options]

Options:
  -c, --config <config>                config file (default: "config.js")
  -p, --port <port>                    custom proxy port
  --chromium-binary <chromium-binary>  specify chromium binary
  -o, --open <url>                     open url
  -h, --help                           display help for command
```

## Configuration

```js
module.exports = {
  open: "about:blank",
  chromiumBinary: "google-chrome-beta",
  rules: [
    {
      match: ({ url, method, hostname, path }) => {
        return false;
      },
      beforeRequest: ({ id, url, method, hostname, path }) => ({}),
      beforeResponse: (request, response) => {
        // const { id, url, method, hostname, path} = request;
        // const { id, statusCode, headers, body } = response;
        return { statusCode: 200, body: "test" };
      },
    },
  ],
};
```
