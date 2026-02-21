from service import CyberThreatRetriever
import time

retriever = CyberThreatRetriever()

# Warmup
retriever.search("test query", k=1)

start = time.time()

results = retriever.search(
    query="remote code execution",
    k=5,
    doc_type="cve",
    min_severity=9.5,
    year=2025
)

end = time.time()

print(f"\nSearch Time: {end - start:.4f} seconds")

for i, r in enumerate(results, 1):
    print(f"\nResult {i}")
    print("Confidence:", r["confidence"], "%")
    print("Metadata:", r["metadata"])