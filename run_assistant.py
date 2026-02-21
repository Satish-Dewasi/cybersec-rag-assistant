from cyber_assistant import CyberThreatIntelligenceAssistant

assistant = CyberThreatIntelligenceAssistant()

print("Cyber Threat Intelligence Assistant Ready")
print("Type 'exit' to quit.\n")

while True:
    query = input("Ask your cybersecurity question: ")

    if query.lower() == "exit":
        break

    response = assistant.ask(query)

    print("\n--- RESPONSE ---")
    print("Confidence Level:", response["confidence_level"])
    print("Confidence Score:", response["confidence_score"], "%")
    print("\nAnswer:\n")
    print(response["answer"])
    print("\n" + "=" * 70 + "\n")