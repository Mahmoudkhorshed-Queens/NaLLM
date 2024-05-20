# import openai
# from embedding.base_embedding import BaseEmbedding


# class OpenAIEmbedding(BaseEmbedding):
#     """Wrapper around OpenAI embedding models."""

#     def __init__(
#         self, openai_api_key: str, model_name: str = "text-embedding-ada-002"
#     ) -> None:
#         openai.api_key = openai_api_key
#         self.model = model_name

#     def generate(
#         self,
#         input: str,
#     ) -> str:
#         embedding = openai.Embedding.create(input=input, model=self.model)
#         return embedding["data"][0]["embedding"]

from sentence_transformers import SentenceTransformer
from base_embedding import BaseEmbedding


class LlamaEmbedding(BaseEmbedding):
    """Wrapper around HuggingFace embedding models."""

    def __init__(
        self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    ) -> None:
        self.model = SentenceTransformer(model_name)

    def generate(
        self,
        input: str,
    ) -> list:
        embedding = self.model.encode(input)
        return embedding
