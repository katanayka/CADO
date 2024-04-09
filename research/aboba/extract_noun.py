import stanza
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk
from nltk.chunk import conlltags2tree
from nltk.chunk import tree2conlltags
import networkx as nx
import re

# Download the Russian language model for Stanza
# stanza.download("ru")

# Download the NLTK resources if not already downloaded
# nltk.download("punkt")
# nltk.download("stopwords")
# nltk.download("averaged_perceptron_tagger_ru")
# nltk.download('averaged_perceptron_tagger')
# nltk.download('maxent_ne_chunker')
nltk.download('words')

# Load the model and tokenizer for POS tagging
import torch

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

import spacy

# Load the Russian language model for Stanza
# nlp = stanza.Pipeline(lang="ru", processors="tokenize, pos, lemma")

# Load the Russian stopwords
stop_words = set(stopwords.words("russian"))

# Define the function to extract noun phrases
# def extract_noun_phrases(text):
#     """
#         This function extracts noun phrases from Russian text.

#         Args:
#         text: String containing the Russian text.

#         Returns:
#         A list of noun phrases identified in the text.
#     """

#     # Tokenize the input text into sentences
#     sentences = nltk.sent_tokenize(text)

#     # Tokenize the sentences into words and tag them with their part of speech
#     tagged_words = [nlp(sentence) for sentence in sentences]

#     # Define a chunk grammar to match noun phrases and verb phrases
#     grammar = r"""
#         NP: {<ADJ>*<NOUN>+}
#         """

#     # Create a RegexpParser with the chunk grammar
#     cp = nltk.RegexpParser(grammar)

#     # Extract the noun phrases from the tagged words
#     noun_phrases = []
#     for sentence in tagged_words:
#         tree = cp.parse([(word.text, word.upos) for word in sentence.sentences[0].words])
#         for subtree in tree.subtrees():
#             if subtree.label() == 'NP':
#                 #print("NP")
#                 #print(subtree.leaves())
#                 noun_phrases.append(' '.join(word for word, pos in subtree.leaves()))

#     return list(set(noun_phrases))

nlp_spacy = spacy.load("ru_core_news_sm")

import re

def extract_relations(text):
    preprocessed_text = preprocess_text(text)
    
    # Tokenize the input text into sentences
    sentences = nltk.sent_tokenize(preprocessed_text)
    
    # Tokenize the sentences into words and tag them with their part of speech
    tagged_words = [nlp_spacy(sentence) for sentence in sentences]
    
    # Use stanza dependency parsing to extract the relations and create a graph
    relations = []
    nsubj_pattern = re.compile(r"nsubj.*")
    obj_pattern = re.compile(r"obj.*")
    for sentence in tagged_words:
        for token in sentence:
            if nsubj_pattern.match(token.dep_) or obj_pattern.match(token.dep_):
                head = token.head
                relations.append((token.text, head.text, token.dep_))
              
    return relations
    
    

def preprocess_text(text):
    """
        This function preprocesses the input text by removing stopwords and punctuation.

        Args:
        text: String containing the Russian text.

        Returns:
        A list of words in the text after removing stopwords and punctuation.
    """
    
    # Replace — with its equivalent (for example "—" -> "это")
    # But before - check if its not — это 
    if "— это" in text:
        text = text.replace("— это", "это")
    else:
        text = text.replace("—", "это")
    
    # Remove brackets and their contents
    text = re.sub(r'[\[\(\{].*?[\]\)\}]', '', text)
    
    # Remove numbers
    text = ''.join([i for i in text if not i.isdigit()])

    return text

class TreeNode:
    def __init__(self, word):
        self.word = word
        self.children = []

    def add_child(self, child):
        self.children.append(child)

class Tree:
    def __init__(self, root):
        self.root = root

    def __str__(self):
        return self._str_helper(self.root, 0)

    def _str_helper(self, node, level):
        indent = "  " * level
        result = f"{indent}{node.word}\n"
        for child in node.children:
            result += self._str_helper(child, level + 1)
        return result

def extract_definitions(text):
    preprocessed_text = preprocess_text(text)
    
    # Tokenize the input text into sentences
    sentences = nltk.sent_tokenize(preprocessed_text)
    
    # Use spaCy to parse each sentence and extract relations while building the tree
    term_definitions = []
    for sentence in sentences:
        doc = nlp_spacy(sentence)
        for token in doc:
            if token.dep_.startswith("nsubj") or token.dep_.startswith("obj") or token.dep_.startswith("acl"):
                term = token.head.text
                definition = get_definition(token)
                term_definitions.append((term, definition))
    return term_definitions

def get_definition(token):
    definition = []
    for child in token.subtree:
        if child.dep_ not in ["punct", "cc", "conj"]:
            definition.append(child.text)
    return " ".join(definition)

def generate_complete_definitions(term_definitions):
    complete_definitions = {}
    for term, definition in term_definitions:
        if term not in complete_definitions:
            complete_definitions[term] = []
        complete_definitions[term].append(definition)
    
    # Combine definitions into complete sentences
    for term, definitions in complete_definitions.items():
        complete_definitions[term] = " ".join(definitions)
    
    return complete_definitions

def preprocess_text(text):
    """
        This function preprocesses the input text by removing stopwords and punctuation.

        Args:
        text: String containing the Russian text.

        Returns:
        A list of words in the text after removing stopwords and punctuation.
    """
    
    # Replace — with its equivalent (for example "—" -> "это")
    # But before - check if its not — это 
    if "— это" in text:
        text = text.replace("— это", "это")
    else:
        text = text.replace("—", "это")
    
    # Remove brackets and their contents
    text = re.sub(r'[\[\(\{].*?[\]\)\}]', '', text)
    
    # Remove numbers
    text = ''.join([i for i in text if not i.isdigit()])
    
    # Replace - with a ""
    text = text.replace("-", "")
    # Remove я, ты, он, она, оно, мы, вы, они (personal pronouns)
    pronouns = ["я", "ты", "он", "она", "оно", "мы", "вы", "они"]
    for pronoun in pronouns:
        # Check if the pronoun is a separate word
        text = re.sub(r"\b" + pronoun + r"\b", "", text)

    return text