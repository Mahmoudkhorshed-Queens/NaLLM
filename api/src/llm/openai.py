# from typing import (
#     Callable,
#     List,
# )

# import openai
# import tiktoken
from llm.basellm import BaseLLM
# from retry import retry


# class OpenAIChat(BaseLLM):
#     """Wrapper around OpenAI Chat large language models."""

#     def __init__(
#         self,
#         openai_api_key: str,
#         model_name: str = "gpt-3.5-turbo",
#         max_tokens: int = 1000,
#         temperature: float = 0.0,
#     ) -> None:
#         openai.api_key = openai_api_key
#         self.model = model_name
#         self.max_tokens = max_tokens
#         self.temperature = temperature

#     @retry(tries=3, delay=1)
#     def generate(
#         self,
#         messages: List[str],
#     ) -> str:
#         try:
#             completions = openai.ChatCompletion.create(
#                 model=self.model,
#                 temperature=self.temperature,
#                 max_tokens=self.max_tokens,
#                 messages=messages,
#             )
#             return completions.choices[0].message.content
#         # catch context length / do not retry
#         except openai.error.InvalidRequestError as e:
#             return str(f"Error: {e}")
#         # catch authorization errors / do not retry
#         except openai.error.AuthenticationError as e:
#             return "Error: The provided OpenAI API key is invalid"
#         except Exception as e:
#             print(f"Retrying LLM call {e}")
#             raise Exception()

#     async def generateStreaming(
#         self,
#         messages: List[str],
#         onTokenCallback=Callable[[str], None],
#     ) -> str:
#         result = []
#         completions = openai.ChatCompletion.create(
#             model=self.model,
#             temperature=self.temperature,
#             max_tokens=self.max_tokens,
#             messages=messages,
#             stream=True,
#         )
#         result = []
#         for message in completions:
#             # Process the streamed messages or perform any other desired action
#             delta = message["choices"][0]["delta"]
#             if "content" in delta:
#                 result.append(delta["content"])
#             await onTokenCallback(message)
#         return result

#     def num_tokens_from_string(self, string: str) -> int:
#         encoding = tiktoken.encoding_for_model(self.model)
#         num_tokens = len(encoding.encode(string))
#         return num_tokens

#     def max_allowed_token_length(self) -> int:
#         # TODO: list all models and their max tokens from api
#         return 2049
from typing import (
    Callable,
    List,
)

# from transformers import LlamaForCausalLM, LlamaTokenizer
import torch
# from basellm import BaseLLM
from retry import retry

# Load model directly
from transformers import AutoTokenizer, AutoModelForCausalLM

# tokenizer = AutoTokenizer.from_pretrained("TheBloke/Llama-2-7B-32K-Instruct-GPTQ", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("TheBloke/Llama-2-7B-32K-Instruct-GPTQ", trust_remote_code=True)

class Llama2Chat(BaseLLM):
    """Wrapper around HuggingFace Llama2 large language models."""

    def __init__(
        self,
        model_name: str = "TheBloke/Llama-2-7B-32K-Instruct-GPTQ",
        max_tokens: int = 2056,
        temperature: float = 0.0,
    ) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)
        self.max_tokens = max_tokens
        self.temperature = temperature

    @retry(tries=3, delay=1)
    def generate(
        self,
        messages: List[str],
    ) -> str:
        try:
            # Concatenate the messages into a single string
            input_text = " ".join(messages)
            inputs = self.tokenizer(input_text, return_tensors="pt", max_length=self.max_tokens, truncation=True)
            outputs = self.model.generate(**inputs, max_length=self.max_tokens, temperature=self.temperature)
            return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            print(f"Retrying LLM call {e}")
            raise Exception(f"Error: {e}")

    async def generateStreaming(
        self,
        messages: List[str],
        onTokenCallback=Callable[[str], None],
    ) -> str:
        try:
            input_text = " ".join(messages)
            inputs = self.tokenizer(input_text, return_tensors="pt", max_length=self.max_tokens, truncation=True)
            outputs = self.model.generate(**inputs, max_length=self.max_tokens, temperature=self.temperature)
            
            result = []
            for token_id in outputs[0]:
                token = self.tokenizer.decode(token_id, skip_special_tokens=True)
                result.append(token)
                await onTokenCallback(token)
            return result
        except Exception as e:
            print(f"Error during streaming generation: {e}")
            raise Exception(f"Error: {e}")

    def num_tokens_from_string(self, string: str) -> int:
        inputs = self.tokenizer(string, return_tensors="pt")
        return inputs.input_ids.shape[1]

    def max_allowed_token_length(self) -> int:
        return self.tokenizer.model_max_length

