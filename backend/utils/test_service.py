from service import CyberThreatRetriever
import time

retriever = CyberThreatRetriever()

# Warmup (ignore timing)
retriever.search("warmup", k=1)


def run_test(query: str):
    print("\n" + "=" * 70)
    print(f"QUERY: {query}")
    print("=" * 70)

    start = time.time()
    response = retriever.search(query=query, k=5)
    latency = round(time.time() - start, 4)

    print(f"Search Time        : {latency} seconds")
    print(f"Confidence Level   : {response['confidence_level']}")
    print(f"Top Confidence     : {response['confidence_score']} %")

    if not response["results"]:
        print("\nNo relevant results found.")
        return

    print("\nTop Results:")
    print("-" * 70)

    for i, r in enumerate(response["results"], 1):
        print(f"\nResult {i}")
        print(f"Confidence : {r['confidence']} %")
        print(f"Metadata   : {r['metadata']}")


# -----------------------------
# Test Cases
# -----------------------------

if __name__ == "__main__":

    test_queries = [
        "remote code execution vulnerability in web servers",
        "privilege escalation via token impersonation",
        "How to cook pasta?"
    ]

    for q in test_queries:
        run_test(q)