import fs from 'fs';

let content = fs.readFileSync('src/components/ZanooLanding.tsx', 'utf-8');

const splitPoint1 = content.indexOf('{/* PROBLEMA + FOTOS (reales) */}');
const splitPoint2 = content.indexOf('{/* APP REAL SECTION */}');
const splitPoint3 = content.indexOf('{/* GRATIS + APLICAR */}');
const splitPoint4 = content.indexOf('{/* DEMO (web) */}');
const splitPoint5 = content.indexOf('{/* IMPACTO */}');
const splitPoint6 = content.indexOf('{/* ROADMAP */}');

console.log("Indices:", { splitPoint1, splitPoint2, splitPoint3, splitPoint4, splitPoint5, splitPoint6 });

// Extract chunks
const part_Hero_and_above = content.substring(0, splitPoint1);
const part_Problema = content.substring(splitPoint1, splitPoint2);
const part_AppReal = content.substring(splitPoint2, splitPoint3);
const part_Gratis = content.substring(splitPoint3, splitPoint4);
const part_Demo = content.substring(splitPoint4, splitPoint5);
const part_Impacto = content.substring(splitPoint5, splitPoint6);
const part_Roadmap_and_below = content.substring(splitPoint6);

// NEW ORDER:
// 1. Hero and Above
// 2. Problema
// 3. Demo
// 4. Impacto
// 5. App Real
// 6. Gratis
// 7. Roadmap and below

const newContent = part_Hero_and_above +
    part_Problema +
    part_Demo +
    part_Impacto +
    part_AppReal +
    part_Gratis +
    part_Roadmap_and_below;

fs.writeFileSync('src/components/ZanooLanding.tsx', newContent, 'utf-8');
console.log("Reorder successful!");
