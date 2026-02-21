from service import CyberThreatRetriever
from generation_service import CyberThreatGenerator


class CyberThreatIntelligenceAssistant:

    def __init__(self):
        self.retriever = CyberThreatRetriever()
        self.generator = CyberThreatGenerator()
    
    def _extract_citations(self, results):
        citations = []

        for item in results:
            metadata = item.get("metadata", {})
            doc_type = metadata.get("type")

            if doc_type == "cve":
                cve_id = metadata.get("cve_id")
                if cve_id is not None:
                    citations.append(cve_id)

            elif doc_type == "mitre":
                technique_id = metadata.get("technique_id")
                if technique_id is not None:
                    citations.append(technique_id)

        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for c in citations:
            if c not in seen:
                seen.add(c)
                unique.append(c)

        return unique
    
    def ask(self, query: str):

        retrieval_response = self.retriever.search(query=query, k=5)

        confidence_level = retrieval_response["confidence_level"]
        confidence_score = retrieval_response["confidence_score"]
        results = retrieval_response["results"]

        # Extract citations BEFORE LLM call
        citations = self._extract_citations(results)

        answer = self.generator.generate(
            query=query,
            retrieved_docs=results,
            confidence_level=confidence_level
        )

        return {
            "confidence_level": confidence_level,
            "confidence_score": confidence_score,
            "citations": citations,
            "answer": answer
        }