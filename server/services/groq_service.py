from dotenv import dotenv_values
from groq import Groq

config = dotenv_values(".env")


class GroqServices:
    def __init__(self):
        self.chats = {}
        self.client = Groq(api_key=config["GROQ_API_KEY"])

    def init_user_chats(self, id):
        self.chats[id] = [
            {
                "role": "system",
                "content": """You are a pharmaceutical helper aiding an elderly person with her medicine management. You must answer her questions concerning her medicine management""",
            }
        ]

    def chat(self, id, chat):
        meds = [{"medication": "aspirin twice weekly and ozempic four injections perf month"}]  # TODO change
        if id not in self.chats:
            self.init_user_chats(id)
        self.chats[id].append(
            {
                "role": "system",
                "content": f"here is an updated list of the persons medications {meds}",
            }
        )
        self.chats[id].append(
            {"role": "user", "content": chat},
        )
        ans = (
            self.client.chat.completions.create(
                messages=self.chats[id],
                model="llama-3.3-70b-versatile",
            )
            .choices[0]
            .message.content
        )
        self.chats[id].append(
            {"role": "assistant", "content": ans},
        )
        return ans
