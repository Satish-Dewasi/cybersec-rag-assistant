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

    def search(self, query: str, k: int = 5):
        results = self.vectorstore.similarity_search_with_score(query, k=k)

        formatted_results = []

        for doc, score in results:
            formatted_results.append({
                "text": doc.page_content,
                "metadata": doc.metadata,
                "score": float(score)
            })

        return formatted_results