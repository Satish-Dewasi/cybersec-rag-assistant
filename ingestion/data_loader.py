import json
import os

NVD_PATH = "data/nvd"
OUTPUT_PATH = "data/processed/cleaned_cves.json"

def extract_cvss_score(metrics):
    if "cvssMetricV31" in metrics:
        return metrics["cvssMetricV31"][0]["cvssData"]["baseScore"]
    elif "cvssMetricV30" in metrics:
        return metrics["cvssMetricV30"][0]["cvssData"]["baseScore"]
    elif "cvssMetricV2" in metrics:
        return metrics["cvssMetricV2"][0]["cvssData"]["baseScore"]
    return None

def parse_nvd_file(filepath):
    with open(filepath, "r") as f:
        data = json.load(f)

    filtered_cves = []

    for item in data.get("vulnerabilities", []):
        cve_data = item.get("cve", {})

        cve_id = cve_data.get("id")
        published = cve_data.get("published", "")
        year = int(published[:4]) if published else None

        descriptions = cve_data.get("descriptions", [])
        description = ""
        for desc in descriptions:
            if desc.get("lang") == "en":
                description = desc.get("value")
                break

        metrics = cve_data.get("metrics", {})
        severity = extract_cvss_score(metrics)

        # 🔒 Lock threshold to >= 9.0
        if severity is None or severity < 9.0:
            continue

        filtered_cves.append({
            "cve_id": cve_id,
            "year": year,
            "severity": severity,
            "description": description
        })

    return filtered_cves

def load_all_cves():
    all_cves = []
    for filename in os.listdir(NVD_PATH):
        if filename.endswith(".json"):
            path = os.path.join(NVD_PATH, filename)
            print(f"Processing {filename}...")
            cves = parse_nvd_file(path)
            all_cves.extend(cves)

    return all_cves

def save_cleaned_cves(cves):
    os.makedirs("data/processed", exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(cves, f, indent=2)
    print(f"\nSaved {len(cves)} CVEs to {OUTPUT_PATH}")

if __name__ == "__main__":
    cves = load_all_cves()
    print("Total High/Critical (>=9.0) CVEs:", len(cves))
    save_cleaned_cves(cves)