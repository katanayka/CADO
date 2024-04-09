from itertools import groupby
import torch

def generate(text, model, tokenizer, device, **kwargs): 
    inputs = tokenizer(text, return_tensors='pt').to(device)
    with torch.no_grad():
        hypotheses = model.generate(**inputs, num_beams=5, **kwargs)
    s = tokenizer.decode(hypotheses[0], skip_special_tokens=True)
    s = s.replace('; ', ';').replace(' ;', ';').lower().split(';')[:-1]
    s = [el for el, _ in groupby(s)]
    return s