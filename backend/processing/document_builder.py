import json
import os

CVE_PATH = "data/processed/cleaned_cves.json"
MITRE_PATH = "data/processed/cleaned_mitre.json"
OUTPUT_PATH = "data/processed/embedding_documents.json"

def build_cve_documents():
    with open(CVE_PATH, "r") as f:
        cves = json.load(f)

    documents = []

    for cve in cves:
        text = f"""
CVE ID: {cve['cve_id']}
Severity: {cve['severity']}
Year: {cve['year']}
Description: {cve['description']}
""".strip()

        metadata = {
            "type": "cve",
            "cve_id": cve["cve_id"],
            "severity": cve["severity"],
            "year": cve["year"]
        }

        documents.append({
            "text": text,
            "metadata": metadata
        })

    return documents


def build_mitre_documents():
    with open(MITRE_PATH, "r") as f:
        techniques = json.load(f)

    documents = []

    for tech in techniques:
        text = f"""
Technique ID: {tech['technique_id']}
Name: {tech['name']}
Tactics: {', '.join(tech['tactics'])}
Description: {tech['description']}
""".strip()

        metadata = {
            "type": "mitre",
            "technique_id": tech["technique_id"],
            "tactics": tech["tactics"]
        }

        documents.append({
            "text": text,
            "metadata": metadata
        })

    return documents


def save_documents(documents):
    os.makedirs("data/processed", exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(documents, f, indent=2)

    print(f"\nSaved {len(documents)} embedding documents to {OUTPUT_PATH}")


if __name__ == "__main__":
    cve_docs = build_cve_documents()
    mitre_docs = build_mitre_documents()

    all_docs = cve_docs + mitre_docs

    print("CVE docs:", len(cve_docs))
    print("MITRE docs:", len(mitre_docs))
    print("Total docs:", len(all_docs))

    save_documents(all_docs)