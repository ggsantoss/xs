# xs-base64

Base64 encode/decode for strings and binary data in XanaScript.

## Install

```bash
xs install base64
```

Or use directly from JavaScript:

```bash
npm install @xanascr/base64
```

## Usage (XanaScript)

```xs
IMPORTA "base64" AS b64

CRIA encoded = b64.encode("Hello World")
# => "SGVsbG8gV29ybGQ="

CRIA decoded = b64.decode("SGVsbG8gV29ybGQ=")
# => "Hello World"

# URL-safe variant
CRIA token = b64.encodeURL("user:password")
# => "dXNlcjpwYXNzd29yZA"

# Validate before use
SE LIGA SO (b64.isValid(someString)) {
  SOLTA_O_GRITO("Valid Base64!")
}
```

## Usage (JavaScript)

```js
import b64 from "@xanascr/base64";

b64.encode("Hello World");
// => "SGVsbG8gV29ybGQ="

b64.decode("SGVsbG8gV29ybGQ=");
// => "Hello World"

// Binary data
const bytes = new Uint8Array([0, 1, 2, 3]);
b64.encodeFile(bytes);
// => "AAECAw=="

const decoded = b64.decodeToBytes("AAECAw==");
// => Uint8Array(4) [0, 1, 2, 3]
```

## API

### `encode(str) -> string`
Encode a UTF-8 string to standard Base64.

### `decode(str) -> string`
Decode Base64 back to UTF-8 string.

### `encodeURL(str) -> string`
Encode to Base64URL (URL-safe, no padding).

### `decodeURL(str) -> string`
Decode Base64URL back to string.

### `encodeFile(bytes) -> string`
Encode a `Uint8Array` (or array of bytes) to Base64.

### `decodeToBytes(str) -> Uint8Array`
Decode Base64 to raw bytes. Returns a `Uint8Array`.

### `isValid(str) -> bool`
Check whether a string is valid Base64.

### `tamanho(str) -> number`
Return the decoded byte length without actually decoding.

## Examples

```xs
IMPORTA "base64" AS b64

# Round-trip
CRIA original = "XanaScript rules!"
CRIA enc = b64.encode(original)
SOLTA_O_GRITO("Encoded:", enc)
CRIA dec = b64.decode(enc)
SOLTA_O_GRITO("Decoded:", dec)

# URL-safe tokens
CRIA token = b64.encodeURL("session:abc123")
SOLTA_O_GRITO("Safe token:", token)

# File contents
CRIA dados = b64.encodeFile([72, 101, 108, 108, 111])
SOLTA_O_GRITO("Base64:", dados)
CRIA bin = b64.decodeToBytes("SGVsbG8=")
SOLTA_O_GRITO("Bytes:", bin)
```

## License

MIT
