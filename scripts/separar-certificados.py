"""Separa o PDF único de certificados (2 páginas por participante) em <cpf>.pdf.

Uso: python scripts/separar-certificados.py <pdf> <pasta-saida>
Os arquivos gerados vão para o bucket privado `certificados` pelo /admin.
"""
import re
import sys
from pathlib import Path

import pymupdf as fitz

origem, saida = sys.argv[1], Path(sys.argv[2])
saida.mkdir(parents=True, exist_ok=True)
doc = fitz.open(origem)
assert doc.page_count % 2 == 0, f"{doc.page_count} páginas: esperado número par"

vistos = set()
for i in range(0, doc.page_count, 2):
    texto = doc[i].get_text() + doc[i + 1].get_text()
    cpfs = {re.sub(r"\D", "", c) for c in re.findall(r"\d{3}\.\d{3}\.\d{3}-\d{2}", texto)}
    assert len(cpfs) == 1, f"páginas {i + 1}-{i + 2}: CPFs {cpfs}"
    cpf = cpfs.pop()
    assert cpf not in vistos, f"CPF repetido nas páginas {i + 1}-{i + 2}"
    vistos.add(cpf)
    novo = fitz.open()
    novo.insert_pdf(doc, from_page=i, to_page=i + 1)
    novo.save(saida / f"{cpf}.pdf", garbage=4, deflate=True)

print(f"{len(vistos)} certificados em {saida}")
