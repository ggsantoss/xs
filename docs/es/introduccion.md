# Primeros Pasos

XanaScript es un lenguaje de programacion con sintaxis en portugues, compilador optimizador (JavaScript + WebAssembly), ORM integrado, macros en tiempo de compilacion, LSP y cero dependencias en tiempo de ejecucion.

## Instalacion

### Via npm (requiere Node.js)

Funciona en Windows, Linux y macOS.

```bash
npm install -g xanascript
xs run app.xs
```

### Via codigo fuente

```bash
git clone https://github.com/xanascr/xs.git
cd xs
npm install
npm install -g bun
node scripts/build-all.js
./dist/xs run app.xs
```

### Extension VS Code

```bash
git clone https://github.com/xanascr/xs-vscode.git
cd xs-vscode
npm install -g vsce
vsce package
code --install-extension xanascript-*.vsix
```

## Inicio Rapido

Cree un archivo `hello.xs`:

```xs
PARTIU()
  SOLTA O GRITO("Hello World!")
ACABOU()
```

Ejecute:

```bash
xs run hello.xs
```

## Documentacion para IA

XanaScript incluye un archivo `llms.txt` con una referencia completa para asistentes de IA. Este archivo cubre toda la sintaxis, funciones nativas, comandos CLI, arquitectura y detalles de la API en un unico documento optimizado para contexto de LLM.

```bash
cat llms.txt  # Referencia completa para IA
```

## Proximos Pasos

- [Referencia de Sintaxis](sintaxis.md)
- [Referencia de CLI](cli.md)
- [Biblioteca Estandar](biblioteca-estandar.md)
- [Documentacion del ORM](orm.md)
- [Ejemplos](ejemplos.md)
