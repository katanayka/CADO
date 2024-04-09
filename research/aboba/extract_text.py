from difflib import SequenceMatcher
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from tqdm import tqdm
import logging

logging.getLogger().setLevel(logging.ERROR)
import chardet
import re


def check_toc(toc, unusable_pages):
    print(len(toc))
    while True:
        made_changes = False
        for i in range(len(toc) - 1):
            if toc[i][0] == toc[i+1][0] and toc[i][2] > toc[i+1][2]:
                # Swap places
                toc[i], toc[i+1] = toc[i+1], toc[i]
                made_changes = True
            elif toc[i][2] > toc[i+1][2]:
                # Remove this element
                toc.pop(i+1)
                made_changes = True
                break  # Break out of the loop after removing an element
        if not made_changes:
            break  # If no changes were made in the current pass, we're done
    # Remove unusable pages from toc
    toc = [elem for elem in toc if elem[2] not in unusable_pages]
    # Remove toc elements with empty page numbers
    toc = [elem for elem in toc if elem[2] is not None]
    print(len(toc))
    return toc

def extract_text_from_blocks(blocks):
    text = ''
    for block_list in blocks:
        for block in block_list:
            text_block = block[4]
            # Detect encoding
            result = chardet.detect(text_block)
            charenc = result['encoding']
            # Decode the text
            text_block = text_block.decode(charenc)
            text_block = text_block.replace('-\n', '')
            text += text_block
    return text

def similar(a, b):
    return max([fuzz.ratio(a.lower().strip(), b.lower().strip())/100,
                fuzz.ratio(a.lower().replace('глава','').replace("\n","").strip(), 
                           b.lower().replace('глава','').replace("\n","").strip())/100])

def get_blocks_on_page(doc, page_number):
    page = doc[page_number]
    textPage = page.get_textpage()
    blocks = textPage.extractBLOCKS()
    blocks.sort(key=lambda x: x[3])
    return blocks
    
def get_blocks_on_pages(doc, pages):
    #print(pages)
    blocks = []
    for page_number in pages:
        blocks.append(get_blocks_on_page(doc, page_number))
    return blocks

def process_text_header(text):
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    # Remove special characters
    text = re.sub(r'[^a-zA-Zа-яА-Я0-9\s.]', '', text)
    # Remove double spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove leading and trailing spaces
    text = text.strip()
    # Lowercase
    text = text.lower()
    return text

def split_pdf_by_toc(pdf_document, toc):
    found_titles = 0
    not_found_titles = 0
    found_half = 0
    blocks_in_toc = {}
    # Remove from toc elements with 
    for toc_elem in tqdm(toc):
        level, title, page_number = toc_elem
        next_block_title = None
        if toc.index(toc_elem) < len(toc) - 1:
            next_block_title = toc[toc.index(toc_elem)+1][1]
        # Get textPage object for the page
        start_page = page_number
        # Get endpage by checking next element in toc 
        # If it is last element, then it is the last page of the document
        if toc.index(toc_elem) == len(toc) - 1:
            end_page = pdf_document.page_count
        else:
            end_page = toc[toc.index(toc_elem)+1][2]
        pages = list(range(start_page-1, end_page))
        blocks = get_blocks_on_pages(pdf_document, pages)
        # Find index of block with header and block with next header
        header_block_index = None
        next_header_block_index = None
        g = 0
        for i in range(len(blocks)):
            for j in range(len(blocks[i])):
                block_text = blocks[i][j][4]
                best_match_cur_head, score_cur = process.extractOne(title, [block_text])
                if next_block_title:
                    best_match_next_head, score_next = process.extractOne(next_block_title, [block_text])
                if score_cur >= 90 and i == 0:
                    header_block_index = g
                if next_block_title and score_next >= 90 and i == len(blocks) - 1:
                    next_header_block_index = g
                    break
                g += 1
        # Get blocks only between header and next header
        # Flatten blocks array to 1D
        blocks = [block for block_list in blocks for block in block_list]
        if header_block_index is not None and next_header_block_index:
            found_titles+=1
            blocks = blocks[header_block_index+1:next_header_block_index]
        # If header_block_index not none or next_header_block_index not none
        if (int(header_block_index is not None)) + (int(next_header_block_index is not None)) == 1:
            found_half+=1
            if next_header_block_index is None:
                blocks = blocks[header_block_index+1:]
            else:
                blocks = blocks[:next_header_block_index]
        if header_block_index is None and next_header_block_index is None:
            not_found_titles+=1
            continue
        #blocks_in_toc[process_text_header(title)] = blocks
        blocks_in_toc[(title)] = blocks
    print(f'{found_titles} - {not_found_titles} - {found_half}')
    return blocks_in_toc, found_titles, not_found_titles, found_half

def process_text(text, apply_te):
    # Remove new lines
    text = text.replace('-\n', '')
    text = text.replace('\n', ' ')
    # Remove leading and trailing spaces
    text = text.strip()
    # Lowercase
    text = text.lower()
    # Remove links and emails
    text = re.sub(r'\b\w+@\w+\.\w{2,4}\b', '', text)
    text = re.sub(r'http[s]?://\S+', '', text)
    # Remove special characters
    text = re.sub(r'[^a-zA-Zа-яА-Я0-9\s]', '', text)
    # Remove double spaces
    text = re.sub(r'\s+', ' ', text)
    text = apply_te(text,lan='ru')
    # Split text into words
    #words = word_tokenize(text)
    #words = [word for word in words if word not in stopwords.words('russian')]
    #return ' '.join(words)
    return text
   
def extract_text_from_block(block):
    text = block[4]
    text = text.replace('-\n', '')
    return text
     
def extract_all_from_heading(title, blocks, apply_te):
    text = ""
    for block in blocks:
        text+=extract_text_from_block(block)
    return process_text(text, apply_te)