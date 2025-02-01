import cv2

# import pytesseract
from PIL import Image
import easyocr
import os
from groq import Groq
import json
from dotenv import dotenv_values

config = dotenv_values(".env")


LANGS = ["fr", "en"]


def getMessages(s1, rest, bigPicture):
    return [
        {
            "role": "user",
            "content": """
Je suis en train de lire une prescription en français. Sur cette dernière, j'ai recueilli certaines informations en utilisant du OCR. En ce faisant, les données pertinentes ont été obfusquées. C'est votre tache de m'indiquer la vrai valeur qui devrait etre prisent par chacun des champs dans le JSON.
""",
        },
        {
            "role": "user",
            "content": f"""Pour débuter, je veux trouver la fréquence d'utilisation par intervalle, j'ai obtenu le texte suivant: {s1}.  Je veux seulement un chiffre en réponse et tu dois le mettre dans le champ <frequence> et <interval> du json tel qu'indiqué dans les informations. L'intervalle doit être soit 'jour', 'semaine', 'mois' ou 'année'. 
                        
                        Est-ce que la prescription est renouvelable? met cela dans le champ <renew> en boolean.

                        Maintenant, en te fiant à ce texte que voici: {rest}, quel sont les informations pertinentes de la pharmacie? met les dans les champs pharmacy_address, pharmacy_phone et pharmacy_name. 

                        Finalement, en ayant accès à TOUT le texte detecté que voici: {bigPicture}, ajoute les informations quantity, start_date et end_date au JSON. Tu peux également utiliser ces informations résiduelles pour modifier tes autres réponses.
                        
                        le output JSON doit etre sous le format {{frequence:string, renew: boolean,pharmacy_address:string,pharmacy_phone:string,pharmacy_name:string,quantity:number,start_date:string, end_date:string, interval:string }}""",
        },
        {"role": "assistant", "content": "Oui bien sur, la réponse est: "},
    ]


def getTimeUnit(ss):
    sep = "PAR"
    for s in ss:
        if sep in s:
            return s.split(sep)[1]


class OCR:
    def __init__(self):
        self.reader = easyocr.Reader(LANGS)

    def read(self, imgPath, threshold):
        result = self.reader.readtext(imgPath)
        valids = list(filter(lambda x: x[2] >= threshold, result))
        return [v[1] for v in valids]


class groq:
    def __init__(self):
        self.client = Groq(api_key=config["GROQ_API_KEY"])

    def getAnswer(self, posologyText, restText, bigPictureText):
        return (
            self.client.chat.completions.create(
                messages=getMessages(posologyText, restText, bigPictureText),
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
            )
            .choices[0]
            .message.content
        )


class PosologyService:
    def __init__(self):
        print(config)
        self.reader = OCR()
        self.bot = groq()

    def getJson(self, imgs):

        # open camera and get images
        # setup services

        # get images in order (full picture at index 0)
        sorted_imgs = sorted(imgs, key=lambda x: -len(x))

        # identify text sections
        posologyTextBox = self.reader.read(sorted_imgs[1], 0)
        rest = [self.reader.read(img, 0) for img in sorted_imgs[2:]]
        bigPicture = self.reader.read(imgs[0], 0)

        final_object = json.loads(self.bot.getAnswer(posologyTextBox, rest, bigPicture))

        return final_object
