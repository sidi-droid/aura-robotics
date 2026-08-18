# Document Generators

Working scripts that produce the documents in `docs/proposal/` and `docs/literature/`.
These are currently the only executable code in the repository.

| File | Produces | Toolchain |
|---|---|---|
| `aura_proposal_source.html` | `docs/proposal/AURA_Project_Proposal.pdf` | HTML/CSS rendered via WeasyPrint |
| `litreview.js` | `docs/literature/AURA_Literature_Review.docx` | Node.js + `docx` |
| `p40review.js` | `docs/literature/Project40_Literature_Review.docx` | Node.js + `docx` |

## Regenerating

```bash
# PDF proposal
pip install weasyprint
python3 -c "from weasyprint import HTML; HTML('aura_proposal_source.html').write_pdf('AURA_Project_Proposal.pdf')"

# Word documents
npm install docx
node litreview.js
node p40review.js
```
