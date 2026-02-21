from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
INDEX_PATH = "vectorstore/faiss_index"

def load_vectorstore():
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )

    vectorstore = FAISS.load_local(
        INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vectorstore


import time

vectorstore = load_vectorstore()

# Warmup query (ignore this)
vectorstore.similarity_search("test", k=1)

query = "remote code execution vulnerability in web servers"

start = time.time()
results = vectorstore.similarity_search(query, k=5)
end = time.time()

print(f"\nSearch Time: {end - start:.4f} seconds")