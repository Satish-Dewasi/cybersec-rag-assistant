import json
import os

MITRE_PATH = "data/mitre/enterprise-attack.json"
OUTPUT_PATH = "data/processed/cleaned_mitre.json"

def parse_mitre_file():
    with open(MITRE_PATH, "r") as f:
        data = json.load(f)

    techniques = []

    for obj in data.get("objects", []):
        if obj.get("type") != "attack-pattern":
            continue

        technique_id = None

        # Extract MITRE technique ID (e.g., T1059)
        for ref in obj.get("external_references", []):
            if ref.get("source_name") == "mitre-attack":
                technique_id = ref.get("external_id")
                break

        if not technique_id:
            continue

        name = obj.get("name", "")
        description = obj.get("description", "")

        # Extract tactics (kill chain phases)
        tactics = []
        for phase in obj.get("kill_chain_phases", []):
            if phase.get("kill_chain_name") == "mitre-attack":
                tactics.append(phase.get("phase_name"))

        techniques.append({
            "technique_id": technique_id,
            "name": name,
            "description": description,
            "tactics": tactics
        })

    return techniques


def save_cleaned_mitre(techniques):
    os.makedirs("data/processed", exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(techniques, f, indent=2)

    print(f"\nSaved {len(techniques)} MITRE techniques to {OUTPUT_PATH}")


if __name__ == "__main__":
    techniques = parse_mitre_file()
    print("Total MITRE techniques:", len(techniques))
    save_cleaned_mitre(techniques)