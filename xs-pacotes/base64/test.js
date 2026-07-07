import b64 from "./base64.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("xs-base64 (JS)", () => {
  describe("encode", () => {
    it("encodes Hello World", () => {
      assert.strictEqual(b64.encode("Hello World"), "SGVsbG8gV29ybGQ=");
    });
    it("returns empty for empty input", () => {
      assert.strictEqual(b64.encode(""), "");
    });
    it("returns empty for null", () => {
      assert.strictEqual(b64.encode(null), "");
    });
    it("pads with one char", () => {
      assert.strictEqual(b64.encode("a"), "YQ==");
    });
    it("pads with two chars", () => {
      assert.strictEqual(b64.encode("ab"), "YWI=");
    });
    it("handles numbers", () => {
      assert.strictEqual(b64.encode("123456"), "MTIzNDU2");
    });
    it("handles symbols", () => {
      assert.strictEqual(b64.encode("!@#$%"), "IUAjJCU=");
    });
  });

  describe("decode", () => {
    it("decodes Base64", () => {
      assert.strictEqual(b64.decode("SGVsbG8gV29ybGQ="), "Hello World");
    });
    it("decodes without padding", () => {
      assert.strictEqual(b64.decode("SGVsbG8"), "Hello");
    });
    it("returns empty for empty input", () => {
      assert.strictEqual(b64.decode(""), "");
    });
    it("handles URL-safe input", () => {
      assert.strictEqual(b64.decode("dGVzdA"), "test");
    });
  });

  describe("encodeURL", () => {
    it("produces URL-safe output (no + or /)", () => {
      const result = b64.encodeURL("hello?\0world");
      assert.ok(!result.includes("+"));
      assert.ok(!result.includes("/"));
    });
    it("removes padding", () => {
      const result = b64.encodeURL("a");
      assert.ok(!result.includes("="));
    });
  });

  describe("decodeURL", () => {
    it("round-trips with encodeURL", () => {
      const original = "Hello World!";
      const encoded = b64.encodeURL(original);
      const decoded = b64.decodeURL(encoded);
      assert.strictEqual(decoded, original);
    });
  });

  describe("encodeFile / decodeToBytes", () => {
    it("encodes bytes", () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111]);
      assert.strictEqual(b64.encodeFile(bytes), "SGVsbG8=");
    });
    it("decodes to bytes", () => {
      const bytes = b64.decodeToBytes("SGVsbG8=");
      assert.deepStrictEqual([...bytes], [72, 101, 108, 108, 111]);
    });
    it("returns empty for empty input", () => {
      assert.strictEqual(b64.encodeFile(new Uint8Array(0)), "");
      assert.strictEqual(b64.decodeToBytes("").length, 0);
    });
  });

  describe("isValid", () => {
    it("accepts valid Base64", () => {
      assert.ok(b64.isValid("SGVsbG8="));
    });
    it("rejects invalid Base64", () => {
      assert.ok(!b64.isValid("!!!invalid!!!"));
    });
    it("rejects empty string", () => {
      assert.ok(!b64.isValid(""));
    });
  });

  describe("tamanho", () => {
    it("calculates decoded size", () => {
      assert.strictEqual(b64.tamanho("SGVsbG8gV29ybGQ="), 11);
    });
    it("returns 0 for empty input", () => {
      assert.strictEqual(b64.tamanho(""), 0);
    });
  });

  describe("round-trip", () => {
    const cases = [
      "XanaScript",
      "Hello World!",
      "a",
      "ab",
      "abc",
      "Oi! Tudo bem? 123 @#$% *()",
      "a b c d e f g",
      "https://example.com/path?query=value&token=abc123",
    ];
    for (const original of cases) {
      it(`round-trips "${original.slice(0, 20)}..."`, () => {
        const encoded = b64.encode(original);
        const decoded = b64.decode(encoded);
        assert.strictEqual(decoded, original);
      });
    }
  });
});
