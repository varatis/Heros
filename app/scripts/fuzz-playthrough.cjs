#!/usr/bin/env node
// Ancien point d'entrée conservé, désormais sur le moteur réel et ses interactions.
// La limite est rapportée, jamais requalifiée en mort ou masquée comme réussite.
const {simuler}=require('./ls02-simulate.cjs');
console.log(JSON.stringify(simuler(),null,2));
