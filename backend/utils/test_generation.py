from generation_service import CyberThreatGenerator

generator = CyberThreatGenerator()

dummy_docs = [
    {
        "text": "CVE-2025-32432 allows remote code execution in web applications with severity 10.0."
    }
]

response = generator.generate(
    query="Explain remote code execution vulnerability",
    retrieved_docs=dummy_docs,
    confidence_level="high"
)

print(response)