from cyber_assistant import CyberThreatIntelligenceAssistant

assistant = CyberThreatIntelligenceAssistant()

print("Cyber Threat Intelligence Assistant Ready")
print("Type 'exit' to quit.\n")

while True:
    query = input("Ask your cybersecurity question: ")

    if query.lower() == "exit":
        break

    response = assistant.ask(query)

    confidence_level = response["confidence_level"].upper()
    confidence_score = response["confidence_score"]
    citations = response.get("citations", [])

    print("\n--- RESPONSE ---")

    # Header Block
    if confidence_level != "LOW" and citations:
        print("SOURCES:", " | ".join(citations))
    else:
        print("SOURCES: None")

    print(f"CONFIDENCE: {confidence_level} ({confidence_score}%)")

    print("\nAnswer:\n")
    print(response["answer"])

    print("\n" + "=" * 70 + "\n")