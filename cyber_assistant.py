from service import CyberThreatRetriever
from generation_service import CyberThreatGenerator


class CyberThreatIntelligenceAssistant:

    def __init__(self):
        self.retriever = CyberThreatRetriever()
        self.generator = CyberThreatGenerator()

    def ask(self, query: str):

        # Step 1: Retrieve relevant documents
        retrieval_response = self.retriever.search(query=query, k=5)

        confidence_level = retrieval_response["confidence_level"]
        confidence_score = retrieval_response["confidence_score"]
        results = retrieval_response["results"]

        # Step 2: Generate response based on confidence
        answer = self.generator.generate(
            query=query,
            retrieved_docs=results,
            confidence_level=confidence_level
        )

        # Step 3: Return structured response
        return {
            "confidence_level": confidence_level,
            "confidence_score": confidence_score,
            "answer": answer
        }