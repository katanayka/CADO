import pickle

import pandas as pd
import torch
import fitz
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModel

# Load model from file (models/model_clf.pkl)
with open('models/model_clf.pkl', 'rb') as file:
    model = pickle.load(file)
    
tokenizer = AutoTokenizer.from_pretrained("cointegrated/rubert-tiny2")
model_bert = AutoModel.from_pretrained("cointegrated/rubert-tiny2")

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model_bert.to(device)

def get_bert_embeddings(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
    
    # Move inputs to the same device as the model
    inputs = {key: tensor.to(device) for key, tensor in inputs.items()}
    
    # Get embeddings using the model
    outputs = model_bert(**inputs)
    
    # Get the last hidden state from the model output
    last_hidden_states = outputs.last_hidden_state
    
    # Move the last hidden state to CPU if it was calculated on GPU
    last_hidden_states = last_hidden_states.cpu().detach()
    
    # Average over tokens to get the final embedding
    text_embedding = torch.mean(last_hidden_states, dim=1)
    
    # Move the tensor to the GPU if available
    text_embedding = text_embedding.to(device)
    
    return text_embedding

def extract_page(book_doc, page_number):
    page = book_doc[page_number]
    return page.get_text()

def extract_text_book(book_doc, book_name):
    df = pd.DataFrame(columns=['book', 'page', 'text'])
    for i in range(3, len(book_doc)):
        text = extract_page(book_doc, i)
        df.loc[i] = [book_name, i, text]
    return df

def extract_book_df(path, book_name):
    book_doc = fitz.open(path)
    df = extract_text_book(book_doc, book_name)
    return df

def process_book(path, book_name):
    df = extract_book_df(path, book_name)
    embeddings = []
    for i, row in tqdm(df.iterrows()):
        text = row['text']
        embedding = get_bert_embeddings(text, tokenizer, model)
        embeddings.append(embedding)
    embeddings = torch.cat(embeddings).cpu().detach().numpy()
    predictions = model.predict(embeddings)
    df['label'] = predictions
    return df
    
