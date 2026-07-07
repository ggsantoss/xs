// =====================================================================
// xs-base64 — Testes (XanaScript)
// =====================================================================
// Nota: requer `xs install base64` ou um runtime que resolva IMPORTA.
// Para testar a implementacao JS diretamente:
//   node --test xs-pacotes/base64/test.js
// =====================================================================

IMPORTA "base64" AS b64

// ── encode ───────────────────────────────────────────────────────────

TESTE "encode - string simples" {
  CRIA result = b64.encode("Hello World")
  ASSUNTO(result, "SGVsbG8gV29ybGQ=")
}

TESTE "encode - string vazia" {
  CRIA result = b64.encode("")
  ASSUNTO(result, "")
}

TESTE "encode - padding com um caractere" {
  CRIA result = b64.encode("a")
  ASSUNTO(result, "YQ==")
}

// ── decode ───────────────────────────────────────────────────────────

TESTE "decode - string base64 valida" {
  CRIA result = b64.decode("SGVsbG8gV29ybGQ=")
  ASSUNTO(result, "Hello World")
}

TESTE "decode - string vazia" {
  CRIA result = b64.decode("")
  ASSUNTO(result, "")
}

// ── Base64URL ────────────────────────────────────────────────────────

TESTE "encodeURL" {
  CRIA result = b64.encodeURL("test")
  AFIRMA(result == "dGVzdA")
}

TESTE "decodeURL" {
  CRIA original = "Hello World!"
  CRIA encoded = b64.encodeURL(original)
  CRIA decoded = b64.decodeURL(encoded)
  ASSUNTO(decoded, original)
}

// ── Validacao ────────────────────────────────────────────────────────

TESTE "isValid" {
  AFIRMA(b64.isValid("SGVsbG8="))
  AFIRMA(!b64.isValid("!!!invalido!!!"))
}

TESTE "tamanho" {
  CRIA size = b64.tamanho("SGVsbG8gV29ybGQ=")
  ASSUNTO(size, 11)
}

// ── Roundtrip ────────────────────────────────────────────────────────

TESTE "roundtrip" {
  CRIA original = "XanaScript"
  CRIA encoded = b64.encode(original)
  CRIA decoded = b64.decode(encoded)
  ASSUNTO(decoded, original)
}

TESTE "roundtrip - URL" {
  CRIA original = "https://example.com/path?query=value"
  CRIA encoded = b64.encodeURL(original)
  CRIA decoded = b64.decodeURL(encoded)
  ASSUNTO(decoded, original)
}
