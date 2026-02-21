import json
import os
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DATA_PATH = "data/processed/embedding_documents.json"
INDEX_PATH = "vectorstore/faiss_index"

def load_documents():
    with open(DATA_PATH, "r") as f:
        raw_docs = json.load(f)

    documents = []
    for item in raw_docs:
        documents.append(
            Document(
                page_content=item["text"],
                metadata=item["metadata"]
            )
        )

    return documents


def build_index(documents):
    print("Loading embedding model...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    print("Generating embeddings & building FAISS index...")
    vectorstore = FAISS.from_documents(documents, embeddings)

    os.makedirs("vectorstore", exist_ok=True)
    vectorstore.save_local(INDEX_PATH)

    print("FAISS index saved successfully.")


if __name__ == "__main__":
    docs = load_documents()
    print("Total documents loaded:", len(docs))
    build_index(docs)