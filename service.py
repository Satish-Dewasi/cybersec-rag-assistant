from typing import Optional, List, Dict

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
INDEX_PATH = "vectorstore/faiss_index"


class CyberThreatRetriever:

    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL
        )

        self.vectorstore = FAISS.load_local(
            INDEX_PATH,
            self.embeddings,
            allow_dangerous_deserialization=True
        )

    def search(
        self,
        query: str,
        k: int = 5,
        doc_type: Optional[str] = None,
        min_severity: Optional[float] = None,
        year: Optional[int] = None,
    ) -> Dict:

        raw_results = self.vectorstore.similarity_search_with_score(query, k=k * 3)

        filtered_results = []

        for doc, score in raw_results:

            metadata = doc.metadata

            if doc_type and metadata.get("type") != doc_type:
                continue

            if min_severity is not None:
                if metadata.get("severity") is None:
                    continue
                if metadata.get("severity") < min_severity:
                    continue

            if year and metadata.get("year") != year:
                continue

            distance = float(score)
            similarity = 1 / (1 + distance)
            confidence = round(similarity * 100, 2)

            filtered_results.append({
                "text": doc.page_content,
                "metadata": metadata,
                "confidence": confidence
            })

            if len(filtered_results) == k:
                break

        # No results → Low confidence
        if not filtered_results:
            return {
                "confidence_level": "low",
                "confidence_score": 0,
                "results": []
            }

        top_confidence = filtered_results[0]["confidence"]

        if top_confidence >= 60:
            level = "high"
        elif top_confidence >= 45:
            level = "medium"
        else:
            level = "low"

        return {
            "confidence_level": level,
            "confidence_score": top_confidence,
            "results": filtered_results
        }