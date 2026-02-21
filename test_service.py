from service import CyberThreatRetriever
import time

retriever = CyberThreatRetriever()

# Warmup
retriever.search("test query", k=1)

query = "remote code execution in web applications"

start = time.time()
results = retriever.search(query, k=5)
end = time.time()

print(f"\nSearch Time: {end - start:.4f} seconds")

for i, r in enumerate(results, 1):
    print(f"\nResult {i}")
    print("Score:", r["score"])
    print("Metadata:", r["metadata"])