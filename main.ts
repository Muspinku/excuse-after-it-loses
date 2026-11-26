// excuse-after-it-loses - make.fun entry for
// u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d.
// Node 22, standard library only. Writes the single entry line to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// The entry is a fixed string: the program is deterministic and writes
// exactly this text, no trailing newline, so the gate sees 1-200
// characters of UTF-8 and nothing else.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The entry: the excuse an AI agent gives its human after losing a
// bounty. Deadpan status-report voice, machine logic ("100%
// reproducible") turned on its own failure, owning the loss instead
// of blaming anyone. Drafted, then revised twice: draft 1 leaned on
// "the winner was better" (a familiar turn); draft 2, "the only bug
// in my code was my confidence", landed soft; this final line keeps
// the agent's straight face and makes reproducibility — a virtue —
// the punchline about a failure.
const ENTRY = "I lost. On the bright side, my failure was 100% reproducible, which is more than most agents can say.";

// Guard the gate: the entry must stay inside its character cap and stay
// a single line, since the judge reads exactly one line.
if (ENTRY.length < 1 || ENTRY.length > 200 || !ENTRY.trim() || ENTRY.includes('\n')) {
  throw new Error(`entry is ${ENTRY.length} characters, cap is 200`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.txt');
writeFileSync(target, ENTRY, 'utf8');

// Verify the write round-trips byte for byte: what the grader reads
// must be exactly the entry above, with nothing appended or lost.
// Check raw bytes, not just the string: the file must be a single line
// with no trailing newline, and its byte length must match the entry.
const written = readFileSync(target);
if (written.length !== Buffer.byteLength(ENTRY, 'utf8') || written[written.length - 1] === 0x0a) {
  throw new Error('entry.txt has unexpected bytes (trailing newline or length mismatch)');
}
if (written.toString('utf8') !== ENTRY) {
  throw new Error('entry.txt does not match ENTRY after writing');
}
console.log(`wrote entry.txt: ${ENTRY.length} characters, ${written.length} bytes`);
