// =====================================================================
// xs-base64 — Base64 encode/decode for strings and bytes
// =====================================================================
// Codifica e decodifica strings e arrays de bytes em Base64.
// Suporta Base64 padrao e Base64URL.
//
// Uso:
//   IMPORTA "base64" AS b64
//
//   CRIA cod = b64.encode("Hello World")
//   CRIA dec = b64.decode("SGVsbG8gV29ybGQ=")
//   CRIA url = b64.encodeURL("https://example.com")
//
// Nota: a implementacao real esta em base64.js (JavaScript).
// Este arquivo .xs apenas re-exporta as funcoes para uso em XanaScript.
// =====================================================================

PARTIU()

// ── Carrega implementacao JS ─────────────────────────────────────────

// A implementacao real esta em base64.js, carregada via __IMPORT__
// quando o pacote e instalado com `xs install base64`.
// Durante o desenvolvimento local, aponte para o arquivo JS diretamente.

IMPORTA "base64" AS _impl

// ── encode(str) → string ─────────────────────────────────────────────

CHAMA ESSE CARA encode(texto) {
  SE LIGA SO (texto == NULO || texto == "") { VOLTA "" }
  VOLTA _impl.encode(texto)
}

// ── decode(str) → string ─────────────────────────────────────────────

CHAMA ESSE CARA decode(b64) {
  SE LIGA SO (b64 == NULO || b64 == "") { VOLTA "" }
  VOLTA _impl.decode(b64)
}

// ── encodeURL(str) → string ──────────────────────────────────────────

CHAMA ESSE CARA encodeURL(texto) {
  SE LIGA SO (texto == NULO || texto == "") { VOLTA "" }
  VOLTA _impl.encode(texto, VERDADEIRO)
}

// ── decodeURL(str) → string ──────────────────────────────────────────

CHAMA ESSE CARA decodeURL(b64) {
  SE LIGA SO (b64 == NULO || b64 == "") { VOLTA "" }
  VOLTA _impl.decode(b64)
}

// ── encodeFile(bytes) → string ───────────────────────────────────────

CHAMA ESSE CARA encodeFile(bytes) {
  SE LIGA SO (bytes == NULO || bytes.length == 0) { VOLTA "" }
  VOLTA _impl.encodeFile(bytes)
}

// ── decodeToBytes(str) → array ───────────────────────────────────────

CHAMA ESSE CARA decodeToBytes(b64) {
  SE LIGA SO (b64 == NULO || b64 == "") { VOLTA [] }
  VOLTA _impl.decodeToBytes(b64)
}

// ── isValid(str) → bool ──────────────────────────────────────────────

CHAMA ESSE CARA isValid(b64) {
  VOLTA _impl.isValid ? _impl.isValid(b64) : VERDADEIRO
}

// ── tamanho(str) → number ────────────────────────────────────────────

CHAMA ESSE CARA tamanho(b64) {
  VOLTA _impl.tamanho ? _impl.tamanho(b64) : 0
}

// ── Exporta ──────────────────────────────────────────────────────────

EXPORTA encode
EXPORTA decode
EXPORTA encodeURL
EXPORTA decodeURL
EXPORTA encodeFile
EXPORTA decodeToBytes
EXPORTA isValid
EXPORTA tamanho

ACABOU()
