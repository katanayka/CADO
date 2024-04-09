# Import from libraries
import os
import time
import fitz
import torch
from tqdm import tqdm
from transformers import T5ForConditionalGeneration, T5Tokenizer
import nltk
import networkx as nx
import matplotlib.pyplot as plt
# Import from files
from extract_text import check_toc, split_pdf_by_toc, extract_all_from_heading
from extract_keywords import generate
from extract_noun import extract_definitions
from extract_pages import process_book
# Path input
data_folder = 'H:/DIPLOM/CADO/research/data/readable'
file_name = "Компьютерное_зрение.pdf"
path = f'{data_folder}/{file_name}'
# Models input
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# Load the model and tokenizer for keyword extraction
model_name = "0x7194633/keyt5-base"
tokenizer_tiny = T5Tokenizer.from_pretrained(model_name)
model_keys = T5ForConditionalGeneration.from_pretrained(model_name)
model_keys.to(device)
# Load the model and tokenizer for text punctuation and capitalization correction
model_repunctuate, example_texts, languages, punct, apply_te = torch.hub.load(repo_or_dir='snakers4/silero-models',
                                                                  model='silero_te')
#
from transformers import pipeline
summarizer = pipeline("summarization", model="cointegrated/rut5-base-absum", device=0)
# Download NLTK resources if not already downloaded
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("averaged_perceptron_tagger_ru")
nltk.download('averaged_perceptron_tagger')

# Example usage
doc_lists = []
print(file_name)

doc = fitz.open(path)
processed_book = process_book(path, file_name)
# Print values of df with each label
label_0 = processed_book[processed_book['label'] == 0]["page"].values
label_1 = processed_book[processed_book['label'] == 1]["page"].values
label_2 = processed_book[processed_book['label'] == 2]["page"].values
# unusable_pages is list of label_0 + label_1
unusable_pages = list(label_0) + list(label_2)

toc = check_toc(doc.get_toc(), unusable_pages)
doc_list, a, b, c = split_pdf_by_toc(doc, toc)

for title, blocks in tqdm(doc_list.items()):
    print("\n",title)
    print(blocks)
    tic = time.perf_counter()
    res = extract_all_from_heading(title, blocks, apply_te)
    toc = time.perf_counter()
    print(f"Extract text {toc - tic:0.4f} seconds")
    tic = time.perf_counter()
    term_definitions = extract_definitions(res)
    toc = time.perf_counter()
    print(f"Extract definitions {toc - tic:0.4f} seconds")

    input("Press Enter to continue...")